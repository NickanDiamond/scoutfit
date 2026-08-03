// Scoring dimensions match the club_weights table columns:
// passing_weight, dribbling_weight, creativity_weight, defending_weight,
// pressing_weight, age_weight.

export type Metric =
  | "passing"
  | "dribbling"
  | "creativity"
  | "defending"
  | "pressing"
  | "age";

export const METRICS: Metric[] = [
  "passing",
  "dribbling",
  "creativity",
  "defending",
  "pressing",
  "age",
];

export const METRIC_LABELS: Record<Metric, string> = {
  passing: "Passing",
  dribbling: "Dribbling",
  creativity: "Creativity",
  defending: "Defending",
  pressing: "Pressing",
  age: "Age Fit",
};

export type Weights = Record<Metric, number>;
export type PlayerStats = Record<Metric, number>; // each 0-100, already normalized

export interface Player {
  id?: string;
  name: string;
  age: number;
  cost: number;
  stats: PlayerStats;
}

export function normalizeWeights(weights: Weights): Weights {
  const total = METRICS.reduce((sum, m) => sum + weights[m], 0) || 1;
  const normalized = {} as Weights;
  METRICS.forEach((m) => {
    normalized[m] = weights[m] / total;
  });
  return normalized;
}

export function fitScore(player: Player, weights: Weights): number {
  const normalized = normalizeWeights(weights);
  return METRICS.reduce((sum, m) => sum + normalized[m] * player.stats[m], 0);
}

export function rankPlayers(
  players: Player[],
  weights: Weights
): (Player & { score: number })[] {
  return players
    .map((p) => ({ ...p, score: fitScore(p, weights) }))
    .sort((a, b) => b.score - a.score);
}

// Min-max scale a list of raw numbers to 0-100. Used to normalize each raw
// stat across the fetched player pool before combining into a dimension.
export function minMaxNormalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 50);
  return values.map((v) => ((v - min) / (max - min)) * 100);
}

// Age isn't normalized against the pool — it's scored against an absolute
// "prime years" band, since a 24-year-old is desirable whether or not
// anyone else in the pool is also 24.
export function ageScore(age: number, peakStart = 24, peakEnd = 27): number {
  if (age >= peakStart && age <= peakEnd) return 100;
  const distance = age < peakStart ? peakStart - age : age - peakEnd;
  return Math.max(0, 100 - distance * 12);
}
