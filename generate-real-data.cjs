// Generates lib/sampleData.ts (offline fallback) AND supabase/seed.sql
// (real data ready to paste into the Supabase SQL editor) from the same
// source-of-truth: real 2024-25 Premier League season stats — goals,
// assists, minutes, creativity, influence, threat, FPL price — from the
// public vaastav/Fantasy-Premier-League dataset (mirrors the official
// FPL API). 84 real players across 8 real clubs.

const METRICS = ["creativity", "threat", "influence", "productivity", "reliability"];
const clip = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const POSITIONS = { DEF: "Defender", MID: "Midfielder", FWD: "Forward" };
const FULL_SEASON_MINUTES = 3420;

// Real current market values (€m), from Transfermarkt data (players.csv /
// player_valuations.csv, dated Aug 2026). Matched by name to the FPL
// performance-stat rows above.
const REAL_MARKET_VALUES = {
  "W. Saliba": 100.0,
  "Gabriel Magalhães": 75.0,
  "Virgil van Dijk": 15.0,
  "Trent Alexander-Arnold": 60.0,
  "Joško Gvardiol": 70.0,
  "Rúben Dias": 55.0,
  "Marc Cucurella": 50.0,
  "Marc Guéhi": 70.0,
  "Milos Kerkez": 35.0,
  "Ezri Konsa": 40.0,
  "Pau Torres": 20.0,
  "Matty Cash": 22.0,
  "Lucas Digne": 6.0,
  "Adam Smith": 0.3,
  "Marcos Senesi": 25.0,
  "Nathan Collins": 30.0,
  "Ethan Pinnock": 3.0,
  "Lewis Dunk": 3.5,
  "Pervis Estupiñán": 12.0,
  "Jan Paul van Hecke": 45.0,
  "Daniel Muñoz": 22.0,
  "Tyrick Mitchell": 25.0,
  "James Tarkowski": 5.0,
  "Vitalii Mykolenko": 25.0,
  "Jarrad Branthwaite": 40.0,
  "Calvin Bassey": 28.0,
  "Antonee Robinson": 22.0,
  "Joachim Andersen": 20.0,
  "Wout Faes": 10.0,
  "James Justin": 12.0,
  "Victor Kristiansen": 9.0,
  "Mohamed Salah": 22.0,
  "Cole Palmer": 100.0,
  "Bruno Fernandes": 35.0,
  "Bukayo Saka": 110.0,
  "Martin Ødegaard": 65.0,
  "Kevin De Bruyne": 8.0,
  "Phil Foden": 70.0,
  "Alexis Mac Allister": 70.0,
  "Dominik Szoboszlai": 100.0,
  "Youri Tielemans": 30.0,
  "John McGinn": 13.0,
  "Morgan Rogers": 90.0,
  "Justin Kluivert": 25.0,
  "Antoine Semenyo": 80.0,
  "Ryan Christie": 8.0,
  "Lewis Cook": 11.0,
  "Dango Ouattara": 35.0,
  "Keane Lewis-Potter": 25.0,
  "Bryan Mbeumo": 75.0,
  "Kevin Schade": 35.0,
  "Kaoru Mitoma": 22.0,
  "Yankuba Minteh": 45.0,
  "Georginio Rutter": 30.0,
  "Eberechi Eze": 65.0,
  "Ismaïla Sarr": 40.0,
  "Adam Wharton": 70.0,
  "Abdoulaye Doucouré": 5.0,
  "Idrissa Gueye": 0.5,
  "Jack Harrison": 6.5,
  "Dwight McNeil": 18.0,
  "Alex Iwobi": 20.0,
  "Andreas Pereira": 14.0,
  "Emile Smith Rowe": 20.0,
  "Adama Traoré": 6.0,
  "Stephy Mavididi": 8.0,
  "Bilal El Khannouss": 35.0,
  "Erling Haaland": 200.0,
  "Ollie Watkins": 25.0,
  "Kai Havertz": 55.0,
  "Nicolas Jackson": 40.0,
  "Yoane Wissa": 25.0,
  "Danny Welbeck": 3.0,
  "Jean-Philippe Mateta": 30.0,
  "Raúl Jiménez": 3.0,
  "Rasmus Højlund": 60.0,
  "Jhon Durán": 15.0,
  "Evanilson": 35.0,
  "João Pedro": 80.0,
  "Iliman Ndiaye": 55.0,
  "Dominic Calvert-Lewin": 22.0,
  "Rodrigo Muniz": 20.0,
  "Jamie Vardy": 1.0,
  "Patson Daka": 0.4,
};


// [name, club, goals, assists, minutes, creativity, influence, threat, now_cost(tenths of £m)]
const RAW = {
  DEF: [
    ["W. Saliba", "Arsenal", 2, 0, 3039, 150.1, 672.6, 116.0, 64],
    ["Gabriel Magalhães", "Arsenal", 3, 2, 2363, 208.8, 584.6, 287.0, 61],
    ["Virgil van Dijk", "Liverpool", 3, 1, 3330, 206.6, 932.6, 299.0, 67],
    ["Trent Alexander-Arnold", "Liverpool", 3, 7, 2362, 833.7, 723.8, 268.0, 72],
    ["Joško Gvardiol", "Manchester City", 5, 0, 3278, 501.7, 847.0, 497.0, 65],
    ["Rúben Dias", "Manchester City", 0, 0, 2269, 173.8, 478.2, 150.0, 55],
    ["Marc Cucurella", "Chelsea", 5, 2, 2988, 350.6, 668.6, 358.0, 54],
    ["Marc Guéhi", "Crystal Palace", 3, 2, 3059, 237.6, 827.0, 247.0, 47],
    ["Milos Kerkez", "Bournemouth", 2, 6, 3336, 642.0, 694.0, 238.0, 53],
    ["Ezri Konsa", "Aston Villa", 2, 0, 2936, 123.9, 532.8, 166.0, 45],
    ["Pau Torres", "Aston Villa", 0, 0, 2019, 84.5, 350.6, 102.0, 42],
    ["Matty Cash", "Aston Villa", 1, 1, 2069, 181.0, 359.2, 171.0, 44],
    ["Lucas Digne", "Aston Villa", 0, 5, 2348, 583.9, 512.6, 112.0, 44],
    ["Adam Smith", "Bournemouth", 0, 0, 1586, 147.2, 181.8, 24.0, 44],
    ["Marcos Senesi", "Bournemouth", 0, 0, 1103, 84.2, 271.6, 39.0, 46],
    ["Nathan Collins", "Brentford", 2, 7, 3420, 160.5, 1023.2, 311.0, 46],
    ["Ethan Pinnock", "Brentford", 2, 0, 1912, 101.2, 540.2, 193.0, 44],
    ["Lewis Dunk", "Brighton", 0, 1, 2081, 115.7, 425.4, 128.0, 42],
    ["Pervis Estupiñán", "Brighton", 1, 1, 2399, 530.1, 504.4, 173.0, 49],
    ["Jan Paul van Hecke", "Brighton", 1, 1, 2960, 261.8, 736.6, 182.0, 45],
    ["Daniel Muñoz", "Crystal Palace", 4, 6, 3229, 634.2, 816.6, 524.0, 52],
    ["Tyrick Mitchell", "Crystal Palace", 0, 6, 3090, 559.1, 630.8, 170.0, 48],
    ["James Tarkowski", "Everton", 1, 1, 2922, 188.8, 859.0, 217.0, 47],
    ["Vitalii Mykolenko", "Everton", 1, 3, 3082, 428.5, 621.4, 100.0, 44],
    ["Jarrad Branthwaite", "Everton", 0, 1, 2509, 57.7, 624.6, 130.0, 49],
    ["Calvin Bassey", "Fulham", 1, 0, 3074, 96.7, 587.2, 157.0, 45],
    ["Antonee Robinson", "Fulham", 0, 10, 3166, 723.4, 922.2, 206.0, 47],
    ["Joachim Andersen", "Fulham", 0, 0, 2673, 99.0, 687.6, 162.0, 42],
    ["Wout Faes", "Leicester", 1, 0, 2812, 68.5, 678.0, 121.0, 38],
    ["James Justin", "Leicester", 2, 2, 2912, 258.5, 615.2, 202.0, 41],
    ["Victor Kristiansen", "Leicester", 0, 1, 2481, 358.6, 519.4, 40.0, 44],
  ],
  MID: [
    ["Mohamed Salah", "Liverpool", 29, 18, 3374, 1199.2, 1577.0, 1985.0, 136],
    ["Cole Palmer", "Chelsea", 15, 10, 3193, 1259.2, 1068.2, 1052.0, 105],
    ["Bruno Fernandes", "Manchester United", 8, 12, 3017, 1407.7, 1017.8, 587.0, 84],
    ["Bukayo Saka", "Arsenal", 6, 11, 1724, 842.8, 606.0, 830.0, 104],
    ["Martin Ødegaard", "Arsenal", 3, 9, 2321, 968.7, 524.6, 493.0, 82],
    ["Kevin De Bruyne", "Manchester City", 4, 9, 1694, 920.0, 466.6, 411.0, 95],
    ["Phil Foden", "Manchester City", 7, 3, 1771, 749.0, 448.0, 449.0, 91],
    ["Alexis Mac Allister", "Liverpool", 5, 6, 2597, 731.3, 653.4, 357.0, 62],
    ["Dominik Szoboszlai", "Liverpool", 6, 10, 2485, 794.8, 589.8, 601.0, 61],
    ["Youri Tielemans", "Aston Villa", 3, 7, 3025, 963.1, 799.6, 333.0, 55],
    ["John McGinn", "Aston Villa", 1, 4, 2217, 500.6, 277.2, 263.0, 52],
    ["Morgan Rogers", "Aston Villa", 8, 11, 3115, 722.7, 730.6, 689.0, 58],
    ["Justin Kluivert", "Bournemouth", 12, 6, 2339, 654.1, 700.0, 771.0, 59],
    ["Antoine Semenyo", "Bournemouth", 11, 7, 3202, 688.9, 792.2, 1204.0, 57],
    ["Ryan Christie", "Bournemouth", 2, 3, 2114, 576.8, 514.0, 303.0, 48],
    ["Lewis Cook", "Bournemouth", 1, 4, 2976, 727.1, 607.0, 114.0, 50],
    ["Dango Ouattara", "Bournemouth", 7, 4, 1998, 496.8, 624.6, 754.0, 45],
    ["Keane Lewis-Potter", "Brentford", 1, 5, 3092, 462.2, 542.0, 391.0, 50],
    ["Bryan Mbeumo", "Brentford", 20, 9, 3415, 1107.5, 1236.8, 1060.0, 83],
    ["Kevin Schade", "Brentford", 11, 4, 2281, 312.7, 630.8, 892.0, 53],
    ["Kaoru Mitoma", "Brighton", 10, 5, 2597, 578.0, 670.6, 856.0, 63],
    ["Yankuba Minteh", "Brighton", 6, 5, 1831, 448.9, 523.8, 615.0, 48],
    ["Georginio Rutter", "Brighton", 5, 6, 1651, 281.8, 355.4, 404.0, 50],
    ["Eberechi Eze", "Crystal Palace", 8, 8, 2588, 849.2, 685.0, 691.0, 70],
    ["Ismaïla Sarr", "Crystal Palace", 8, 7, 2708, 618.0, 675.0, 866.0, 55],
    ["Adam Wharton", "Crystal Palace", 0, 2, 1314, 381.4, 261.2, 69.0, 47],
    ["Abdoulaye Doucouré", "Everton", 3, 2, 2563, 379.4, 352.6, 348.0, 51],
    ["Idrissa Gueye", "Everton", 0, 3, 3063, 327.2, 522.0, 117.0, 48],
    ["Jack Harrison", "Everton", 1, 3, 2068, 527.7, 277.0, 288.0, 52],
    ["Dwight McNeil", "Everton", 4, 8, 1366, 631.8, 392.0, 207.0, 51],
    ["Alex Iwobi", "Fulham", 9, 6, 2981, 922.4, 806.8, 699.0, 54],
    ["Andreas Pereira", "Fulham", 2, 6, 2004, 868.3, 326.6, 300.0, 49],
    ["Emile Smith Rowe", "Fulham", 6, 3, 2036, 422.3, 433.8, 386.0, 50],
    ["Adama Traoré", "Fulham", 2, 8, 1756, 632.1, 385.4, 426.0, 45],
    ["Stephy Mavididi", "Leicester", 4, 1, 1606, 375.3, 339.2, 302.0, 50],
    ["Bilal El Khannouss", "Leicester", 2, 4, 2179, 634.1, 381.6, 191.0, 48],
  ],
  FWD: [
    ["Erling Haaland", "Manchester City", 22, 3, 2736, 359.4, 946.0, 1511.0, 149],
    ["Ollie Watkins", "Aston Villa", 16, 8, 2593, 345.2, 766.0, 1148.0, 92],
    ["Kai Havertz", "Arsenal", 9, 3, 1872, 269.0, 467.6, 711.0, 77],
    ["Nicolas Jackson", "Chelsea", 10, 6, 2220, 368.3, 546.4, 976.0, 77],
    ["Yoane Wissa", "Brentford", 18, 6, 2921, 400.0, 849.4, 1181.0, 69],
    ["Danny Welbeck", "Brighton", 10, 5, 2109, 331.3, 550.2, 676.0, 55],
    ["Jean-Philippe Mateta", "Crystal Palace", 14, 2, 2642, 405.4, 671.6, 800.0, 75],
    ["Raúl Jiménez", "Fulham", 12, 3, 2486, 372.2, 612.8, 1018.0, 53],
    ["Rasmus Højlund", "Manchester United", 4, 1, 1998, 254.7, 187.0, 432.0, 69],
    ["Jhon Durán", "Aston Villa", 7, 0, 622, 68.9, 273.8, 334.0, 57],
    ["Evanilson", "Bournemouth", 10, 5, 2317, 331.9, 456.0, 966.0, 59],
    ["João Pedro", "Brighton", 10, 6, 1946, 456.0, 567.0, 644.0, 55],
    ["Iliman Ndiaye", "Everton", 9, 0, 2426, 326.4, 598.0, 493.0, 52],
    ["Dominic Calvert-Lewin", "Everton", 3, 2, 1602, 126.1, 200.2, 573.0, 54],
    ["Rodrigo Muniz", "Fulham", 8, 1, 943, 95.3, 352.4, 508.0, 55],
    ["Jamie Vardy", "Leicester", 9, 5, 2825, 270.8, 490.8, 742.0, 54],
    ["Patson Daka", "Leicester", 1, 0, 717, 41.7, 86.0, 148.0, 48],
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
  const creativity = rows.map((r) => r[5]);
  const threat = rows.map((r) => r[7]);
  const influence = rows.map((r) => r[6]);
  const productivity = rows.map((r) => ((r[2] + r[3]) / r[4]) * 90);
  const reliability = rows.map((r) => clip((r[4] / FULL_SEASON_MINUTES) * 100, 0, 100));

  const n = {
    creativity: minMaxNormalize(creativity),
    threat: minMaxNormalize(threat),
    influence: minMaxNormalize(influence),
    productivity: minMaxNormalize(productivity),
    reliability: minMaxNormalize(reliability),
  };

  PLAYERS[pos] = rows.map((r, i) => ({
    name: r[0],
    club: r[1],
    cost: REAL_MARKET_VALUES[r[0]] ?? Math.round((r[8] / 10) * 10) / 10, // real €m market value, FPL price as fallback
    raw: { minutes: r[4], goals: r[2], assists: r[3], creativity: r[5], influence: r[6], threat: r[7] },
    stats: {
      creativity: Math.round(n.creativity[i]),
      threat: Math.round(n.threat[i]),
      influence: Math.round(n.influence[i]),
      productivity: Math.round(n.productivity[i]),
      reliability: Math.round(n.reliability[i]),
    },
  }));
});

const BASE_WEIGHTS = {
  DEF: { creativity: 15, threat: 10, influence: 30, productivity: 15, reliability: 30 },
  MID: { creativity: 30, threat: 15, influence: 20, productivity: 20, reliability: 15 },
  FWD: { creativity: 10, threat: 35, influence: 15, productivity: 30, reliability: 10 },
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
  possession: { creativity: 10, influence: 5, threat: -10, productivity: -5 },
  press: { threat: 10, influence: 5, reliability: -5, creativity: -10 },
  possession_control: { creativity: 15, influence: 5, threat: -10, productivity: -10 },
  direct: { threat: 10, productivity: 5, creativity: -10, reliability: -5 },
  young_dynamic: { productivity: 10, threat: 5, reliability: -10, influence: -5 },
  galactico: { threat: 10, influence: 10, reliability: -10, creativity: -10 },
  defensive_control: { influence: 10, reliability: 10, threat: -10, productivity: -10 },
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

// Real 2024-25 Premier League season data (goals, assists, minutes,
// creativity, influence, threat, FPL price) — source: the public
// vaastav/Fantasy-Premier-League dataset, which mirrors the official
// Fantasy Premier League API. Used as the offline fallback pool of
// realistic transfer targets when Supabase isn't connected.
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
-- 84 real Premier League players (2024-25 performance stats: goals,
-- assists, minutes, creativity, influence, threat — from the public
-- vaastav/Fantasy-Premier-League dataset) plus real current market
-- values in EUR millions (from Transfermarkt data, Aug 2026). 12 clubs
-- across the Premier League, La Liga, Bundesliga, Ligue 1, and Serie A.

with inserted_clubs as (
  insert into clubs (name, league, tactical_style) values
`;
sql += CLUB_LIST.map((c) => `    (${sqlStr(c.name)}, ${sqlStr(c.league)}, ${sqlStr(c.style)})`).join(",\n") + "\n";
sql += `  returning id, name
)
insert into club_weights (club_id, position, creativity_weight, threat_weight, influence_weight, productivity_weight, reliability_weight)
`;
const weightRows = [];
CLUB_LIST.forEach((c) => {
  Object.keys(POSITIONS).forEach((pos) => {
    const w = CLUBS[c.key].weights[pos];
    weightRows.push(`select id, '${pos}', ${w.creativity}, ${w.threat}, ${w.influence}, ${w.productivity}, ${w.reliability} from inserted_clubs where name = ${sqlStr(c.name)}`);
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

sql += `-- Player stats (2024-2025 season)\n`;
Object.keys(POSITIONS).forEach((pos) => {
  PLAYERS[pos].forEach((p) => {
    const r = p.raw;
    sql += `insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)\n`;
    sql += `  select id, '2024-2025', ${r.minutes}, ${r.goals}, ${r.assists}, ${r.creativity}, ${r.influence}, ${r.threat} from players where name = ${sqlStr(p.name)} and position = '${pos}';\n`;
  });
});

require("fs").writeFileSync("supabase/seed.sql", sql);

const total = Object.values(PLAYERS).reduce((s, a) => s + a.length, 0);
console.log("wrote lib/sampleData.ts and supabase/seed.sql —", CLUB_LIST.length, "clubs,", Object.keys(POSITIONS).length, "positions,", total, "real players");
