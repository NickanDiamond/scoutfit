// Generates lib/sampleData.ts (offline fallback) AND supabase/seed.sql
// (real data ready to paste into the Supabase SQL editor) from the same
// source-of-truth: real EA Sports FC 26 player ratings (pace, shooting,
// passing, dribbling, defending, physical, age — the same six-stat
// "pentagon" EA uses, plus age) matched by name to real current market
// values (EUR) from Transfermarkt data. 88 real players across 7
// granular real positions (Centre-Back, Fullback, Defensive Midfielder,
// Central Midfielder, Attacking Midfielder, Winger, Striker), sourced
// from Transfermarkt's own sub_position taxonomy.
// NOTE: "False Nine" / Second Striker is intentionally not a bucket —
// zero current Premier League players are tagged that position in the
// real data, so it can't be backed with real stats without faking it.
// NOTE: 2 players from the original pool (Andreas Pereira, Jamie Vardy)
// were dropped — they don't have EA FC 26 ratings, so there's no real
// pentagon data to give them. 88 players remain, all real matches.

const METRICS = ["pace", "shooting", "passing", "dribbling", "defending", "physical", "youth"];
const clip = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const POSITIONS = {
  CB: "Centre-Back",
  FB: "Fullback",
  DM: "Defensive Midfielder",
  CM: "Central Midfielder",
  CAM: "Attacking Midfielder",
  WING: "Winger",
  ST: "Striker",
};

// [name, club, pace, shooting, passing, dribbling, defending, physical, age, cost(€m, real Transfermarkt market value)]
const RAW = {
  CB: [
    ["W. Saliba", "Arsenal", 77, 39, 68, 72, 87, 83, 25, 100.0],
    ["Virgil van Dijk", "Liverpool", 73, 60, 72, 72, 90, 87, 34, 15.0],
    ["Joško Gvardiol", "Manchester City", 78, 71, 75, 78, 84, 82, 24, 70.0],
    ["Rúben Dias", "Manchester City", 59, 39, 69, 69, 86, 84, 28, 55.0],
    ["Marc Guéhi", "Crystal Palace", 69, 39, 69, 73, 83, 78, 25, 70.0],
    ["Ezri Konsa", "Aston Villa", 75, 53, 71, 75, 84, 78, 28, 40.0],
    ["Pau Torres", "Aston Villa", 67, 41, 75, 69, 82, 73, 29, 20.0],
    ["Marcos Senesi", "AFC Bournemouth", 56, 42, 70, 72, 79, 75, 28, 25.0],
    ["Nathan Collins", "Brentford", 62, 31, 58, 63, 80, 81, 24, 30.0],
    ["Ethan Pinnock", "Brentford", 60, 36, 56, 61, 78, 79, 32, 3.0],
    ["Lewis Dunk", "Brighton", 37, 52, 66, 64, 78, 78, 34, 3.5],
    ["Jan Paul van Hecke", "Brighton", 67, 46, 72, 70, 80, 78, 25, 45.0],
    ["James Tarkowski", "Everton", 45, 47, 64, 59, 81, 82, 33, 5.0],
    ["Jarrad Branthwaite", "Everton", 71, 39, 58, 60, 80, 78, 23, 40.0],
    ["Calvin Bassey", "Fulham", 81, 44, 63, 68, 77, 87, 26, 28.0],
    ["Joachim Andersen", "Fulham", 39, 57, 71, 65, 78, 82, 29, 20.0],
    ["Wout Faes", "Leicester City", 52, 39, 54, 60, 73, 75, 27, 10.0],
  ],
  FB: [
    ["Gabriel Magalhães", "Arsenal", 64, 44, 64, 65, 88, 84, 28, 75.0],
    ["Trent Alexander-Arnold", "Real Madrid", 76, 72, 89, 80, 80, 74, 27, 60.0],
    ["Marc Cucurella", "Chelsea", 75, 64, 79, 80, 82, 79, 27, 50.0],
    ["Milos Kerkez", "Liverpool", 87, 59, 75, 78, 77, 80, 22, 35.0],
    ["Matty Cash", "Aston Villa", 75, 66, 71, 75, 75, 76, 28, 22.0],
    ["Lucas Digne", "Aston Villa", 69, 68, 79, 76, 77, 74, 32, 6.0],
    ["Adam Smith", "AFC Bournemouth", 60, 59, 70, 70, 73, 68, 34, 0.3],
    ["Pervis Estupiñán", "Inter Milan", 76, 57, 77, 78, 75, 72, 28, 12.0],
    ["Daniel Muñoz", "Crystal Palace", 75, 69, 72, 76, 79, 81, 29, 22.0],
    ["Tyrick Mitchell", "Crystal Palace", 75, 41, 68, 73, 76, 70, 26, 25.0],
    ["Vitalii Mykolenko", "Everton", 74, 55, 71, 71, 77, 71, 26, 25.0],
    ["Antonee Robinson", "Fulham", 88, 46, 75, 77, 78, 80, 28, 22.0],
    ["James Justin", "Leeds United", 79, 52, 69, 70, 71, 70, 28, 12.0],
    ["Victor Kristiansen", "Leicester City", 68, 59, 67, 73, 72, 73, 23, 9.0],
    ["Keane Lewis-Potter", "Brentford", 77, 67, 72, 77, 70, 64, 25, 25.0],
  ],
  DM: [
    ["Adam Wharton", "Crystal Palace", 62, 62, 81, 77, 75, 69, 22, 70.0],
    ["Idrissa Gueye", "Everton", 60, 59, 70, 73, 80, 70, 36, 0.5],
    ["Moisés Caicedo", "Chelsea", 71, 64, 78, 81, 84, 82, 24, 100.0],
    ["Ryan Gravenberch", "Liverpool", 76, 76, 81, 85, 81, 81, 23, 80.0],
    ["Carlos Baleba", "Brighton", 74, 70, 75, 80, 79, 79, 22, 55.0],
    ["Amadou Onana", "Aston Villa", 74, 62, 72, 73, 78, 81, 24, 45.0],
    ["Boubacar Kamara", "Aston Villa", 64, 55, 74, 75, 83, 80, 26, 40.0],
    ["James Garner", "Everton", 58, 65, 78, 72, 71, 70, 25, 45.0],
  ],
  CM: [
    ["Alexis Mac Allister", "Liverpool", 66, 82, 85, 85, 78, 76, 27, 70.0],
    ["Youri Tielemans", "Aston Villa", 54, 79, 85, 80, 75, 72, 28, 30.0],
    ["John McGinn", "Aston Villa", 69, 77, 78, 80, 77, 83, 31, 13.0],
    ["Ryan Christie", "AFC Bournemouth", 69, 70, 77, 78, 74, 76, 31, 8.0],
    ["Lewis Cook", "AFC Bournemouth", 69, 63, 77, 77, 75, 73, 29, 11.0],
  ],
  CAM: [
    ["Cole Palmer", "Chelsea", 75, 83, 87, 87, 50, 65, 23, 100.0],
    ["Bruno Fernandes", "Manchester United", 67, 83, 89, 83, 65, 75, 31, 35.0],
    ["Martin Ødegaard", "Arsenal", 68, 79, 88, 87, 67, 65, 27, 65.0],
    ["Kevin De Bruyne", "SSC Napoli", 66, 83, 92, 84, 65, 72, 34, 8.0],
    ["Phil Foden", "Manchester City", 81, 81, 82, 89, 57, 57, 25, 70.0],
    ["Dominik Szoboszlai", "Liverpool", 79, 82, 84, 82, 67, 76, 25, 100.0],
    ["Morgan Rogers", "Aston Villa", 77, 77, 79, 84, 67, 79, 23, 90.0],
    ["Justin Kluivert", "AFC Bournemouth", 87, 78, 76, 81, 38, 62, 26, 25.0],
    ["Eberechi Eze", "Arsenal", 74, 80, 81, 87, 50, 68, 27, 65.0],
    ["Abdoulaye Doucouré", "Neom", 53, 76, 71, 73, 75, 81, 33, 5.0],
    ["Emile Smith Rowe", "Fulham", 72, 72, 75, 80, 52, 61, 25, 20.0],
    ["Bilal El Khannouss", "VfB Stuttgart", 76, 64, 76, 82, 38, 56, 21, 35.0],
  ],
  WING: [
    ["Mohamed Salah", "Liverpool", 89, 88, 86, 90, 45, 76, 33, 22.0],
    ["Bukayo Saka", "Arsenal", 84, 82, 85, 88, 60, 73, 24, 110.0],
    ["Antoine Semenyo", "AFC Bournemouth", 80, 78, 73, 81, 40, 79, 26, 80.0],
    ["Dango Ouattara", "Brentford", 85, 70, 70, 78, 53, 59, 24, 35.0],
    ["Bryan Mbeumo", "Manchester United", 88, 84, 79, 84, 49, 76, 26, 75.0],
    ["Kevin Schade", "Brentford", 92, 75, 70, 78, 30, 68, 24, 35.0],
    ["Kaoru Mitoma", "Brighton", 87, 73, 76, 86, 57, 64, 28, 22.0],
    ["Yankuba Minteh", "Brighton", 94, 67, 66, 81, 55, 57, 21, 45.0],
    ["Ismaïla Sarr", "Crystal Palace", 91, 78, 76, 78, 28, 69, 28, 40.0],
    ["Jack Harrison", "Leeds United", 76, 69, 71, 75, 47, 66, 29, 6.5],
    ["Dwight McNeil", "Everton", 67, 76, 79, 79, 55, 68, 26, 18.0],
    ["Alex Iwobi", "Fulham", 76, 74, 77, 81, 56, 73, 29, 20.0],
    ["Adama Traoré", "Fulham", 94, 65, 67, 81, 37, 82, 30, 6.0],
    ["Stephy Mavididi", "Leicester City", 87, 73, 69, 75, 28, 72, 27, 8.0],
    ["Iliman Ndiaye", "Everton", 84, 76, 70, 84, 40, 63, 26, 55.0],
  ],
  ST: [
    ["Georginio Rutter", "Brighton", 77, 75, 75, 80, 60, 74, 23, 30.0],
    ["Erling Haaland", "Manchester City", 86, 91, 70, 80, 45, 88, 25, 200.0],
    ["Ollie Watkins", "Aston Villa", 77, 83, 73, 80, 50, 80, 30, 25.0],
    ["Kai Havertz", "Arsenal", 72, 79, 78, 81, 48, 74, 26, 55.0],
    ["Nicolas Jackson", "FC Bayern München", 82, 77, 69, 79, 40, 77, 24, 40.0],
    ["Yoane Wissa", "Newcastle Utd", 85, 82, 70, 80, 31, 71, 29, 25.0],
    ["Danny Welbeck", "Brighton", 60, 78, 74, 77, 45, 77, 35, 3.0],
    ["Jean-Philippe Mateta", "Crystal Palace", 75, 84, 70, 77, 41, 81, 28, 30.0],
    ["Raúl Jiménez", "Fulham", 57, 79, 74, 75, 46, 79, 34, 3.0],
    ["Rasmus Højlund", "SSC Napoli", 85, 76, 58, 72, 33, 79, 23, 60.0],
    ["Jhon Durán", "Fenerbahçe", 81, 81, 63, 75, 32, 80, 22, 15.0],
    ["Evanilson", "AFC Bournemouth", 76, 79, 66, 77, 37, 76, 26, 35.0],
    ["João Pedro", "Chelsea", 78, 78, 72, 81, 37, 70, 24, 80.0],
    ["Dominic Calvert-Lewin", "Leeds United", 72, 72, 63, 70, 38, 75, 29, 22.0],
    ["Rodrigo Muniz", "Fulham", 68, 74, 59, 71, 42, 76, 24, 20.0],
    ["Patson Daka", "Leicester City", 86, 71, 58, 74, 26, 67, 27, 0.4],
  ],
};

function minMaxNormalize(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 50);
  return values.map((v) => ((v - min) / (max - min)) * 100);
}

const PLAYERS = {};
Object.keys(POSITIONS).forEach((pos) => {
  const rows = RAW[pos];
  const pace = rows.map((r) => r[2]);
  const shooting = rows.map((r) => r[3]);
  const passing = rows.map((r) => r[4]);
  const dribbling = rows.map((r) => r[5]);
  const defending = rows.map((r) => r[6]);
  const physical = rows.map((r) => r[7]);
  // Youth: younger = higher score. Flip age's sign before normalizing so
  // the youngest player in the bucket lands at 100, oldest at 0.
  const youthRaw = rows.map((r) => -r[8]);

  const n = {
    pace: minMaxNormalize(pace),
    shooting: minMaxNormalize(shooting),
    passing: minMaxNormalize(passing),
    dribbling: minMaxNormalize(dribbling),
    defending: minMaxNormalize(defending),
    physical: minMaxNormalize(physical),
    youth: minMaxNormalize(youthRaw),
  };

  PLAYERS[pos] = rows.map((r, i) => ({
    name: r[0],
    club: r[1],
    cost: r[9],
    raw: { pace: r[2], shooting: r[3], passing: r[4], dribbling: r[5], defending: r[6], physical: r[7], age: r[8] },
    stats: {
      pace: Math.round(n.pace[i]),
      shooting: Math.round(n.shooting[i]),
      passing: Math.round(n.passing[i]),
      dribbling: Math.round(n.dribbling[i]),
      defending: Math.round(n.defending[i]),
      physical: Math.round(n.physical[i]),
      youth: Math.round(n.youth[i]),
    },
  }));
});

const BASE_WEIGHTS = {
  CB:   { pace: 10, shooting: 0,  passing: 15, dribbling: 5,  defending: 35, physical: 20, youth: 15 },
  FB:   { pace: 20, shooting: 5,  passing: 15, dribbling: 15, defending: 20, physical: 10, youth: 15 },
  DM:   { pace: 5,  shooting: 0,  passing: 20, dribbling: 10, defending: 30, physical: 20, youth: 15 },
  CM:   { pace: 10, shooting: 5,  passing: 25, dribbling: 20, defending: 15, physical: 15, youth: 10 },
  CAM:  { pace: 10, shooting: 20, passing: 25, dribbling: 25, defending: 0,  physical: 5,  youth: 15 },
  WING: { pace: 30, shooting: 15, passing: 10, dribbling: 25, defending: 0,  physical: 5,  youth: 15 },
  ST:   { pace: 20, shooting: 35, passing: 5,  dribbling: 15, defending: 0,  physical: 15, youth: 10 },
};
const CLUB_LIST = [
  { key: "arsenal", name: "Arsenal", league: "Premier League", style: "possession" },
  { key: "liverpool", name: "Liverpool", league: "Premier League", style: "press" },
  { key: "mancity", name: "Manchester City", league: "Premier League", style: "possession_control" },
  { key: "manutd", name: "Manchester United", league: "Premier League", style: "direct" },
  { key: "chelsea", name: "Chelsea", league: "Premier League", style: "young_dynamic" },
  { key: "barcelona", name: "FC Barcelona", league: "La Liga", style: "possession_control" },
  { key: "realmadrid", name: "Real Madrid", league: "La Liga", style: "galactico" },
  { key: "bayern", name: "Bayern Munich", league: "Bundesliga", style: "press" },
  { key: "psg", name: "Paris Saint-Germain", league: "Ligue 1", style: "possession" },
  { key: "juventus", name: "Juventus FC", league: "Serie A", style: "defensive_control" },
  { key: "dortmund", name: "Borussia Dortmund", league: "Bundesliga", style: "direct" },
  { key: "intermilan", name: "Inter Milan", league: "Serie A", style: "defensive_control" },
];
const STYLE_DELTAS = {
  possession: { passing: 10, dribbling: 5, pace: -5, physical: -10 },
  press: { defending: 10, physical: 5, pace: 5, passing: -5 },
  possession_control: { passing: 15, dribbling: 10, physical: -10, pace: -10 },
  direct: { pace: 10, physical: 5, passing: -10, dribbling: -5 },
  young_dynamic: { youth: 15, pace: 5, physical: -5, defending: -10 },
  galactico: { shooting: 10, dribbling: 10, defending: -15, youth: -5 },
  defensive_control: { defending: 15, physical: 10, pace: -5, shooting: -10 },
};
function buildWeights(position, style) {
  const base = BASE_WEIGHTS[position];
  const delta = STYLE_DELTAS[style] || {};
  const w = {};
  METRICS.forEach((m) => { w[m] = Math.round(clip((base[m] || 0) + (delta[m] || 0), 0, 100)); });
  return w;
}
const CLUBS = {};
CLUB_LIST.forEach((c) => {
  CLUBS[c.key] = { name: c.name, weights: Object.fromEntries(Object.keys(POSITIONS).map((pos) => [pos, buildWeights(pos, c.style)])) };
});

// ---------- lib/sampleData.ts ----------
function tsWeights(w) { return `{ ${METRICS.map((m) => `${m}: ${w[m]}`).join(", ")} }`; }
function tsStats(s) { return `{ ${METRICS.map((m) => `${m}: ${s[m]}`).join(", ")} }`; }

let ts = `import { Weights, Player } from "./scoring";

// Real EA Sports FC 26 player ratings (pace, shooting, passing,
// dribbling, defending, physical, age — matched by name to each real
// player), plus real current market values in €m from Transfermarkt
// data. Used as the offline fallback pool of realistic transfer targets
// when Supabase isn't connected.
// Generated by generate-real-data.cjs — regenerate with
// \`node generate-real-data.cjs\` after editing the RAW stats above.
// This also produces supabase/seed.sql from the same source data.
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
  ts += `  ${c.key}: {\n    name: "${c.name}",\n    weights: {\n`;
  Object.keys(POSITIONS).forEach((pos) => { ts += `      ${pos}: ${tsWeights(CLUBS[c.key].weights[pos])},\n`; });
  ts += `    },\n  },\n`;
});
ts += `};\n\nexport const PLAYERS: Record<PositionKey, Player[]> = {\n`;
Object.keys(POSITIONS).forEach((pos) => {
  ts += `  ${pos}: [\n`;
  PLAYERS[pos].forEach((p) => { ts += `    { name: "${p.name}", cost: ${p.cost}, stats: ${tsStats(p.stats)} },\n`; });
  ts += `  ],\n`;
});
ts += `};\n`;
require("fs").writeFileSync("lib/sampleData.ts", ts);

// ---------- supabase/seed.sql ----------
function sqlStr(s) { return `'${String(s).replace(/'/g, "''")}'`; }

let sql = `-- ScoutFit real-data seed (run AFTER schema.sql)
-- 88 real players with real EA Sports FC 26 ratings (pace, shooting,
-- passing, dribbling, defending, physical, age) plus real current
-- market values in EUR millions (from Transfermarkt data). 12 clubs
-- across the Premier League, La Liga, Bundesliga, Ligue 1, and Serie A.

with inserted_clubs as (
  insert into clubs (name, league, tactical_style) values
`;
sql += CLUB_LIST.map((c) => `    (${sqlStr(c.name)}, ${sqlStr(c.league)}, ${sqlStr(c.style)})`).join(",\n") + "\n";
sql += `  returning id, name
)
insert into club_weights (club_id, position, pace_weight, shooting_weight, passing_weight, dribbling_weight, defending_weight, physical_weight, youth_weight)
`;
const weightRows = [];
CLUB_LIST.forEach((c) => {
  Object.keys(POSITIONS).forEach((pos) => {
    const w = CLUBS[c.key].weights[pos];
    weightRows.push(`select id, '${pos}', ${w.pace}, ${w.shooting}, ${w.passing}, ${w.dribbling}, ${w.defending}, ${w.physical}, ${w.youth} from inserted_clubs where name = ${sqlStr(c.name)}`);
  });
});
sql += weightRows.join("\nunion all\n") + ";\n\n";

sql += `-- Players\ninsert into players (name, club, position, price) values\n`;
const playerRows = [];
Object.keys(POSITIONS).forEach((pos) => {
  PLAYERS[pos].forEach((p) => {
    playerRows.push(`  (${sqlStr(p.name)}, ${sqlStr(p.club)}, '${pos}', ${p.cost})`);
  });
});
sql += playerRows.join(",\n") + ";\n\n";

sql += `-- Player ratings (EA Sports FC 26)\n`;
Object.keys(POSITIONS).forEach((pos) => {
  PLAYERS[pos].forEach((p) => {
    const r = p.raw;
    sql += `insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)\n`;
    sql += `  select id, 'FC26', ${r.pace}, ${r.shooting}, ${r.passing}, ${r.dribbling}, ${r.defending}, ${r.physical}, ${r.age} from players where name = ${sqlStr(p.name)} and position = '${pos}';\n`;
  });
});

require("fs").writeFileSync("supabase/seed.sql", sql);

const total = Object.values(PLAYERS).reduce((s, a) => s + a.length, 0);
console.log("wrote lib/sampleData.ts and supabase/seed.sql —", CLUB_LIST.length, "clubs,", Object.keys(POSITIONS).length, "positions,", total, "real players");
