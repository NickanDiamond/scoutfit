export type Metric =
  | "passing"
  | "progression"
  | "retention"
  | "dribbling"
  | "creation"
  | "pressing"
  | "defending"
  | "age_score";

export const METRICS: Metric[] = [
  "passing",
  "progression",
  "retention",
  "dribbling",
  "creation",
  "pressing",
  "defending",
  "age_score",
];

export const METRIC_LABELS: Record<Metric, string> = {
  passing: "Passing Accuracy",
  progression: "Progressive Passes",
  retention: "Ball Retention",
  dribbling: "Dribbling",
  creation: "Chance Creation",
  pressing: "Pressing",
  defending: "Defending",
  age_score: "Age Fit",
};

export type Weights = Record<Metric, number>;
export type PlayerStats = Record<Metric, number>;

export interface Player {
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
