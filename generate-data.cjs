// One-off generator for lib/sampleData.ts. Not part of the running app.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260803);
const clip = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
function noise(spread) { return (rng() + rng() + rng() - 1.5) * spread; }
function ageScore(age, peakStart = 24, peakEnd = 27) {
  if (age >= peakStart && age <= peakEnd) return 100;
  const d = age < peakStart ? peakStart - age : age - peakEnd;
  return Math.max(0, 100 - d * 12);
}

const METRICS = ["passing", "dribbling", "creativity", "defending", "pressing", "age"];

const POSITIONS = { RW: "Right Winger", CB: "Center Back", CM: "Central Midfielder", ST: "Striker" };

const BASE_WEIGHTS = {
  RW: { passing: 30, dribbling: 25, creativity: 25, defending: 0, pressing: 15, age: 5 },
  CB: { passing: 20, dribbling: 0, creativity: 0, defending: 50, pressing: 20, age: 10 },
  CM: { passing: 35, dribbling: 10, creativity: 20, defending: 20, pressing: 10, age: 5 },
  ST: { passing: 10, dribbling: 20, creativity: 30, defending: 0, pressing: 20, age: 20 },
};

const CLUB_LIST = [
  { key: "barcelona", name: "Barcelona", style: "possession" },
  { key: "mancity", name: "Manchester City", style: "possession_press" },
  { key: "bayern", name: "Bayern Munich", style: "press" },
  { key: "realmadrid", name: "Real Madrid", style: "physical" },
  { key: "liverpool", name: "Liverpool", style: "press_counter" },
];

const STYLE_DELTAS = {
  possession: { passing: 10, creativity: 5, defending: -10, pressing: -5 },
  possession_press: { passing: 5, pressing: 10, defending: -10, dribbling: -5 },
  press: { pressing: 15, defending: 5, passing: -10, creativity: -10 },
  physical: { defending: 5, dribbling: 10, creativity: -5, passing: -10 },
  press_counter: { pressing: 15, dribbling: 5, passing: -10, creativity: -10 },
};

function buildWeights(position, style) {
  const base = BASE_WEIGHTS[position];
  const delta = STYLE_DELTAS[style] || {};
  const w = {};
  METRICS.forEach((m) => { w[m] = Math.round(clip((base[m] || 0) + (delta[m] || 0), 0, 100)); });
  return w;
}

const POSITION_STAT_PROFILE = {
  RW: { passing: 75, dribbling: 80, creativity: 78, defending: 22, pressing: 58 },
  CB: { passing: 70, dribbling: 20, creativity: 15, defending: 82, pressing: 62 },
  CM: { passing: 80, dribbling: 60, creativity: 65, defending: 55, pressing: 60 },
  ST: { passing: 55, dribbling: 65, creativity: 70, defending: 15, pressing: 55 },
};

const SURNAMES = [
  "Ferreira","Adebayo","Novak","Okafor","Almeida","Haddad","Petrov","Larsson","Diakite","Sorensen",
  "Adeyemi","Kowalski","Nkemdirim","Wallin","Duarte","Vidmar","Osei","Melchior","Baptiste","Krasnov",
  "Oyelaran","Fontaine","Suzuki","Kallas","Marchetti","Nwosu","Halvorsen","Bianchi","Traore","Vukovic",
  "Ilic","Costa","Nakamura","Dembele","Rasmussen","Kowal","Osei-Mensah","Barreto","Zaïri","Lindqvist",
];
const INITIALS = ["L","K","T","R","D","M","S","J","A","V","B","H","F","E","C","P","N","G","O","I"];

// Shuffle a pool of unique "Initial. Surname" combos, then hand them out
// sequentially so no name repeats across the whole dataset.
const namePool = [];
SURNAMES.forEach((sur) => INITIALS.forEach((ini) => namePool.push(`${ini}. ${sur}`)));
for (let i = namePool.length - 1; i > 0; i--) {
  const j = Math.floor(rng() * (i + 1));
  [namePool[i], namePool[j]] = [namePool[j], namePool[i]];
}
let nameCursor = 0;
function nextName() { return namePool[nameCursor++]; }

const PLAYERS_PER_POSITION = 10;

function genPlayers(position) {
  const profile = POSITION_STAT_PROFILE[position];
  const players = [];
  for (let i = 0; i < PLAYERS_PER_POSITION; i++) {
    const age = Math.round(clip(19 + rng() * 14, 19, 33));
    const stats = {
      passing: Math.round(clip(profile.passing + noise(18), 5, 99)),
      dribbling: Math.round(clip(profile.dribbling + noise(18), 5, 99)),
      creativity: Math.round(clip(profile.creativity + noise(18), 5, 99)),
      defending: Math.round(clip(profile.defending + noise(18), 5, 99)),
      pressing: Math.round(clip(profile.pressing + noise(18), 5, 99)),
      age: ageScore(age),
    };
    const qualityAvg = (stats.passing + stats.dribbling + stats.creativity + stats.defending + stats.pressing) / 5;
    const cost = Math.round(clip(12 + (qualityAvg / 100) * 65 + noise(20), 6, 95));
    players.push({ name: nextName(), age, cost, stats });
  }
  return players;
}

const CLUBS = {};
CLUB_LIST.forEach((c) => {
  CLUBS[c.key] = {
    name: c.name,
    weights: Object.fromEntries(Object.keys(POSITIONS).map((pos) => [pos, buildWeights(pos, c.style)])),
  };
});

const PLAYERS = Object.fromEntries(Object.keys(POSITIONS).map((pos) => [pos, genPlayers(pos)]));

function tsWeights(w) {
  return `{ ${METRICS.map((m) => `${m}: ${w[m]}`).join(", ")} }`;
}
function tsStats(s) {
  return `{ ${METRICS.map((m) => `${m}: ${Math.round(s[m])}`).join(", ")} }`;
}

let out = `import { Weights, Player } from "./scoring";

// Offline fallback data — used automatically when Supabase env vars aren't
// set, so the app still runs before you've connected a real database.
// Generated by generate-data.cjs (deterministic seed) — regenerate with
// \`node generate-data.cjs\` if you want a different sample pool.
// See lib/supabaseClient.ts (isSupabaseConfigured) and lib/db.ts.

export const POSITIONS = {
${Object.entries(POSITIONS).map(([k, v]) => `  ${k}: "${v}",`).join("\n")}
} as const;

export type PositionKey = keyof typeof POSITIONS;

interface ClubDef {
  name: string;
  weights: Record<PositionKey, Weights>;
}

export const CLUBS: Record<string, ClubDef> = {
`;

CLUB_LIST.forEach((c) => {
  out += `  ${c.key}: {\n    name: "${c.name}",\n    weights: {\n`;
  Object.keys(POSITIONS).forEach((pos) => {
    out += `      ${pos}: ${tsWeights(CLUBS[c.key].weights[pos])},\n`;
  });
  out += `    },\n  },\n`;
});

out += `};\n\nexport const PLAYERS: Record<PositionKey, Player[]> = {\n`;
Object.keys(POSITIONS).forEach((pos) => {
  out += `  ${pos}: [\n`;
  PLAYERS[pos].forEach((p) => {
    out += `    { name: "${p.name}", age: ${p.age}, cost: ${p.cost}, stats: ${tsStats(p.stats)} },\n`;
  });
  out += `  ],\n`;
});
out += `};\n`;

require("fs").writeFileSync("lib/sampleData.ts", out);
console.log("wrote lib/sampleData.ts —", CLUB_LIST.length, "clubs,", Object.keys(POSITIONS).length, "positions,", CLUB_LIST.length * 0 + PLAYERS_PER_POSITION * Object.keys(POSITIONS).length, "players");
