// Generates lib/sampleData.ts from real 2024-25 Premier League season stats
// (source: vaastav/Fantasy-Premier-League public dataset, mirroring the
// official FPL API — goals, assists, minutes, creativity, influence,
// threat, and FPL price are all real numbers for real players).
//
// Positions are the plain DEF/MID/FWD buckets FPL itself uses — simpler
// than an invented RW/CB/CM/ST scheme, and it's what the free data
// actually supports without guessing.

const METRICS = ["creativity", "threat", "influence", "productivity", "reliability"];
const clip = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const POSITIONS = { DEF: "Defender", MID: "Midfielder", FWD: "Forward" };

// [name, goals, assists, minutes, creativity, influence, threat, now_cost(tenths of £m)]
const RAW = {
  DEF: [
    ["W. Saliba", 2, 0, 3039, 150.1, 672.6, 116.0, 64],
    ["Gabriel Magalhães", 3, 2, 2363, 208.8, 584.6, 287.0, 61],
    ["Virgil van Dijk", 3, 1, 3330, 206.6, 932.6, 299.0, 67],
    ["Trent Alexander-Arnold", 3, 7, 2362, 833.7, 723.8, 268.0, 72],
    ["Joško Gvardiol", 5, 0, 3278, 501.7, 847.0, 497.0, 65],
    ["Rúben Dias", 0, 0, 2269, 173.8, 478.2, 150.0, 55],
    ["Marc Cucurella", 5, 2, 2988, 350.6, 668.6, 358.0, 54],
    ["Marc Guéhi", 3, 2, 3059, 237.6, 827.0, 247.0, 47],
    ["Milos Kerkez", 2, 6, 3336, 642.0, 694.0, 238.0, 53],
  ],
  MID: [
    ["Mohamed Salah", 29, 18, 3374, 1199.2, 1577.0, 1985.0, 136],
    ["Cole Palmer", 15, 10, 3193, 1259.2, 1068.2, 1052.0, 105],
    ["Bruno Fernandes", 8, 12, 3017, 1407.7, 1017.8, 587.0, 84],
    ["Bukayo Saka", 6, 11, 1724, 842.8, 606.0, 830.0, 104],
    ["Martin Ødegaard", 3, 9, 2321, 968.7, 524.6, 493.0, 82],
    ["Kevin De Bruyne", 4, 9, 1694, 920.0, 466.6, 411.0, 95],
    ["Phil Foden", 7, 3, 1771, 749.0, 448.0, 449.0, 91],
    ["Alexis Mac Allister", 5, 6, 2597, 731.3, 653.4, 357.0, 62],
    ["Dominik Szoboszlai", 6, 10, 2485, 794.8, 589.8, 601.0, 61],
  ],
  FWD: [
    ["Erling Haaland", 22, 3, 2736, 359.4, 946.0, 1511.0, 149],
    ["Ollie Watkins", 16, 8, 2593, 345.2, 766.0, 1148.0, 92],
    ["Kai Havertz", 9, 3, 1872, 269.0, 467.6, 711.0, 77],
    ["Nicolas Jackson", 10, 6, 2220, 368.3, 546.4, 976.0, 77],
    ["Yoane Wissa", 18, 6, 2921, 400.0, 849.4, 1181.0, 69],
    ["Danny Welbeck", 10, 5, 2109, 331.3, 550.2, 676.0, 55],
    ["Jean-Philippe Mateta", 14, 2, 2642, 405.4, 671.6, 800.0, 75],
    ["Raúl Jiménez", 12, 3, 2486, 372.2, 612.8, 1018.0, 53],
    ["Rasmus Højlund", 4, 1, 1998, 254.7, 187.0, 432.0, 69],
  ],
};

const FULL_SEASON_MINUTES = 3420; // 38 games x 90

function minMaxNormalize(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 50);
  return values.map((v) => ((v - min) / (max - min)) * 100);
}

const PLAYERS = {};
Object.keys(POSITIONS).forEach((pos) => {
  const rows = RAW[pos];
  const creativity = rows.map((r) => r[4]);
  const threat = rows.map((r) => r[6]);
  const influence = rows.map((r) => r[5]);
  const productivity = rows.map((r) => ((r[1] + r[2]) / r[3]) * 90); // goals+assists per 90
  const reliability = rows.map((r) => clip((r[3] / FULL_SEASON_MINUTES) * 100, 0, 100));

  const nCreativity = minMaxNormalize(creativity);
  const nThreat = minMaxNormalize(threat);
  const nInfluence = minMaxNormalize(influence);
  const nProductivity = minMaxNormalize(productivity);
  const nReliability = minMaxNormalize(reliability);

  PLAYERS[pos] = rows.map((r, i) => ({
    name: r[0],
    cost: Math.round((r[7] / 10) * 10) / 10, // now_cost tenths -> £m
    stats: {
      creativity: Math.round(nCreativity[i]),
      threat: Math.round(nThreat[i]),
      influence: Math.round(nInfluence[i]),
      productivity: Math.round(nProductivity[i]),
      reliability: Math.round(nReliability[i]),
    },
  }));
});

// Club weight profiles: a position baseline plus a real, commonly-known
// tactical-style adjustment per club (possession-heavy, high-press, etc).
// These are illustrative characterizations, not official club data.
const BASE_WEIGHTS = {
  DEF: { creativity: 15, threat: 10, influence: 30, productivity: 15, reliability: 30 },
  MID: { creativity: 30, threat: 15, influence: 20, productivity: 20, reliability: 15 },
  FWD: { creativity: 10, threat: 35, influence: 15, productivity: 30, reliability: 10 },
};

const CLUB_LIST = [
  { key: "arsenal", name: "Arsenal", style: "possession" },
  { key: "liverpool", name: "Liverpool", style: "press" },
  { key: "mancity", name: "Manchester City", style: "possession_control" },
  { key: "manutd", name: "Manchester United", style: "direct" },
  { key: "chelsea", name: "Chelsea", style: "young_dynamic" },
];

const STYLE_DELTAS = {
  possession: { creativity: 10, influence: 5, threat: -10, productivity: -5 },
  press: { threat: 10, influence: 5, reliability: -5, creativity: -10 },
  possession_control: { creativity: 15, influence: 5, threat: -10, productivity: -10 },
  direct: { threat: 10, productivity: 5, creativity: -10, reliability: -5 },
  young_dynamic: { productivity: 10, threat: 5, reliability: -10, influence: -5 },
};

function buildWeights(position, style) {
  const base = BASE_WEIGHTS[position];
  const delta = STYLE_DELTAS[style] || {};
  const w = {};
  METRICS.forEach((m) => {
    w[m] = Math.round(clip((base[m] || 0) + (delta[m] || 0), 0, 100));
  });
  return w;
}

const CLUBS = {};
CLUB_LIST.forEach((c) => {
  CLUBS[c.key] = {
    name: c.name,
    weights: Object.fromEntries(Object.keys(POSITIONS).map((pos) => [pos, buildWeights(pos, c.style)])),
  };
});

function tsWeights(w) {
  return `{ ${METRICS.map((m) => `${m}: ${w[m]}`).join(", ")} }`;
}
function tsStats(s) {
  return `{ ${METRICS.map((m) => `${m}: ${s[m]}`).join(", ")} }`;
}

let out = `import { Weights, Player } from "./scoring";

// Real 2024-25 Premier League season data (goals, assists, minutes,
// creativity, influence, threat, FPL price) — source: the public
// vaastav/Fantasy-Premier-League dataset, which mirrors the official
// Fantasy Premier League API. Used as the offline fallback pool of
// realistic transfer targets when Supabase isn't connected.
// Generated by generate-real-data.cjs — regenerate with
// \`node generate-real-data.cjs\` after editing the RAW stats above.
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
    out += `    { name: "${p.name}", cost: ${p.cost}, stats: ${tsStats(p.stats)} },\n`;
  });
  out += `  ],\n`;
});
out += `};\n`;

require("fs").writeFileSync("lib/sampleData.ts", out);
console.log("wrote lib/sampleData.ts —", CLUB_LIST.length, "clubs,", Object.keys(POSITIONS).length, "positions,", Object.values(PLAYERS).reduce((s, a) => s + a.length, 0), "real players");
