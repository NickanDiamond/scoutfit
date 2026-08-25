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

// Simple equal-weight split across whichever stats the user picked as
// mattering — no sliders, no percentages to reason about. Kept as a
// fallback / building block for rankToWeights below.
export function equalWeights(selected: Metric[]): Weights {
  const w = {} as Weights;
  METRICS.forEach((m) => {
    w[m] = 0;
  });
  if (selected.length === 0) return w;
  const share = Math.round(100 / selected.length);
  selected.forEach((m) => {
    w[m] = share;
  });
  return w;
}

// Converts a drag-to-rank ordering into descending weights: rank 1 (most
// important, index 0) gets the biggest share, the last stat gets the
// smallest. Uses a simple descending-weight sequence (n, n-1, ..., 1) so
// the gap between neighbors is even and predictable, then normalizes to
// whole percentages that sum to 100. Any metric not included in `ranked`
// gets 0 weight, same contract as equalWeights.
export function rankToWeights(ranked: Metric[]): Weights {
  const w = {} as Weights;
  METRICS.forEach((m) => {
    w[m] = 0;
  });
  const n = ranked.length;
  if (n === 0) return w;
  if (n === 1) {
    w[ranked[0]] = 100;
    return w;
  }
  // Raw shares: first pick gets weight n, last pick gets weight 1.
  const rawWeights = ranked.map((_, i) => n - i);
  const rawTotal = rawWeights.reduce((s, v) => s + v, 0);
  let rounded = rawWeights.map((v) => Math.round((v / rawTotal) * 100));
  // Rounding can drift the total off 100 by a point or two — correct it
  // on the highest-ranked stat so "most important" stays most important.
  const drift = 100 - rounded.reduce((s, v) => s + v, 0);
  rounded[0] += drift;
  ranked.forEach((m, i) => {
    w[m] = rounded[i];
  });
  return w;
}

// Given a club's default weight profile, suggest the top N stats as a
// sensible starting point for the "which stats matter" step.
export function topMetrics(weights: Weights, n = 2): Metric[] {
  return [...METRICS].sort((a, b) => weights[b] - weights[a]).slice(0, n);
}

// Fit points per €m spent (a +1 floor keeps very cheap players from
// producing wild ratios via near-zero division). Used for a "best value"
// ranking mode, so a cheap specialist can outrank a pricier all-rounder
// who's only marginally better on raw fit.
export function valueRatio(score: number, cost: number): number {
  return score / (cost + 1);
}
