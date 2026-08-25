// Scoring dimensions are EA Sports FC's own six-stat "pentagon" (Pace,
// Shooting, Passing, Dribbling, Defending, Physical) plus Age (as
// "Youth" — younger scores higher). Real ratings, not invented numbers.
// Each maps to a club_weights column of the same name.

export type Metric =
  | "pace"
  | "shooting"
  | "passing"
  | "dribbling"
  | "defending"
  | "physical"
  | "youth";

export const METRICS: Metric[] = [
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "physical",
  "youth",
];

export const METRIC_LABELS: Record<Metric, string> = {
  pace: "Pace",
  shooting: "Shooting",
  passing: "Passing",
  dribbling: "Dribbling",
  defending: "Defending",
  physical: "Physical",
  youth: "Youth",
};

// Short plain-language explanation shown under each stat.
export const METRIC_HELP: Record<Metric, string> = {
  pace: "Raw speed, sprinting and accelerating",
  shooting: "Finishing quality and shot power",
  passing: "Range and accuracy of their passing",
  dribbling: "Ball control and beating defenders",
  defending: "Tackling, positioning, and pressing",
  physical: "Strength, stamina, and winning duels",
  youth: "How many years of prime are still ahead",
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

// "Value for money" ranking, take two:
//
// The first version was `score / (cost + 1)` using raw €m cost. That
// broke in practice — real transfer prices span ~€0.3m to ~€200m (a
// 600x range) while fit scores only span roughly 20-80 points (a 4x
// range). Dividing by raw cost meant price completely dominated the
// ratio, so "value mode" was effectively just "cheapest first," barely
// touched by how good the actual fit was.
//
// Fix: compare percentile ranks instead of raw magnitudes. Both a
// player's fit score and their cost get converted to a 0-100 rank
// *within the current results pool* (100 = best fit / most expensive),
// then value = fitPercentile - costPercentile. A player who fits
// better than their price would suggest scores well; a star who's both
// the best fit AND the most expensive nets out near zero, the way an
// "expected performance for this price tag" read should work.
export function percentileRanks(values: number[]): number[] {
  const n = values.length;
  if (n <= 1) return values.map(() => 50);
  const sorted = [...values].sort((a, b) => a - b);
  return values.map((v) => {
    // average rank among ties, 0-100 scale
    const below = sorted.filter((x) => x < v).length;
    const equal = sorted.filter((x) => x === v).length;
    const rank = below + (equal - 1) / 2;
    return (rank / (n - 1)) * 100;
  });
}

export function valueScores(
  players: (Player & { score: number })[]
): number[] {
  const fitPct = percentileRanks(players.map((p) => p.score));
  const costPct = percentileRanks(players.map((p) => p.cost));
  return players.map((_, i) => fitPct[i] - costPct[i]);
}

// A club's real transfer-spending power (see budgetTier in CLUBS)
// matters for a *scouting* tool: the whole point is recommending
// players this specific club could realistically sign, not just the
// best stat-fit on earth regardless of price. Below budget, no
// penalty. Above it, a soft (square-root) penalty knocks the score
// down without zeroing out a genuine standout who's only a bit of a
// stretch — it should still show up, just not automatically outrank
// every realistic option purely because raw fit was marginally higher.
export function realismMultiplier(cost: number, budgetTier: number): number {
  if (!budgetTier || budgetTier <= 0 || cost <= budgetTier) return 1;
  return Math.sqrt(budgetTier / cost);
}

export function rankPlayersRealistic(
  players: Player[],
  weights: Weights,
  budgetTier: number
): (Player & { score: number; realism: number; stretch: boolean })[] {
  return players
    .map((p) => {
      const score = fitScore(p, weights);
      const realism = score * realismMultiplier(p.cost, budgetTier);
      return { ...p, score, realism, stretch: budgetTier > 0 && p.cost > budgetTier };
    })
    .sort((a, b) => b.realism - a.realism);
}
