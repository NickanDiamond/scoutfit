// Scoring dimensions are chosen to match what's actually measurable from
// free, real player data (FPL-style stats): no invented passing/dribbling
// numbers. Each one maps to a club_weights column of the same name.

export type Metric =
  | "creativity"
  | "threat"
  | "influence"
  | "productivity"
  | "reliability";

export const METRICS: Metric[] = [
  "creativity",
  "threat",
  "influence",
  "productivity",
  "reliability",
];

export const METRIC_LABELS: Record<Metric, string> = {
  creativity: "Creativity",
  threat: "Threat",
  influence: "Influence",
  productivity: "Output",
  reliability: "Reliability",
};

// Short plain-language explanation shown under each slider / on hover.
export const METRIC_HELP: Record<Metric, string> = {
  creativity: "Chances created for teammates",
  threat: "How often they threaten to score",
  influence: "Overall impact on matches",
  productivity: "Goals + assists per 90 minutes",
  reliability: "How nailed-on they are to start",
};

export type Weights = Record<Metric, number>;
export type PlayerStats = Record<Metric, number>; // each 0-100, already normalized

export interface Player {
  id?: string;
  name: string;
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

export function minMaxNormalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 50);
  return values.map((v) => ((v - min) / (max - min)) * 100);
}
