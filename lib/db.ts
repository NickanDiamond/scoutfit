import { supabase } from "./supabaseClient";
import { Player, Weights, minMaxNormalize, ageScore } from "./scoring";
import { PositionKey } from "./sampleData";

export const DEFAULT_SEASON = "2024-2025";

export interface ClubRow {
  id: string;
  name: string;
}

export async function getClubs(): Promise<ClubRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("clubs").select("id, name").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getClubWeights(
  clubId: string,
  position: PositionKey
): Promise<Weights | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("club_weights")
    .select(
      "passing_weight, dribbling_weight, creativity_weight, defending_weight, pressing_weight, age_weight"
    )
    .eq("club_id", clubId)
    .eq("position", position)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    passing: data.passing_weight ?? 0,
    dribbling: data.dribbling_weight ?? 0,
    creativity: data.creativity_weight ?? 0,
    defending: data.defending_weight ?? 0,
    pressing: data.pressing_weight ?? 0,
    age: data.age_weight ?? 0,
  };
}

interface RawPlayerRow {
  id: string;
  name: string;
  age: number;
  market_value: number;
  player_stats: {
    minutes: number;
    passing_accuracy: number | null;
    progressive_passes: number | null;
    progressive_carries: number | null;
    dribbles_completed: number | null;
    expected_assists: number | null;
    shot_creating_actions: number | null;
    tackles: number | null;
    interceptions: number | null;
    pressures: number | null;
  }[];
}

// Fetches every player at `position` with a player_stats row for `season`,
// converts counting stats to per-90, min-max normalizes each raw stat
// across the fetched pool, then averages the normalized sub-stats that
// belong to the same scoring dimension. Age is scored separately via a
// prime-years curve (not pool-relative).
export async function getPlayersForPosition(
  position: PositionKey,
  season: string = DEFAULT_SEASON
): Promise<Player[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("players")
    .select(
      `id, name, age, market_value,
       player_stats!inner ( minutes, passing_accuracy, progressive_passes, progressive_carries, dribbles_completed, expected_assists, shot_creating_actions, tackles, interceptions, pressures )`
    )
    .eq("position", position)
    .eq("player_stats.season", season);

  if (error) throw error;
  const rows = (data ?? []) as unknown as RawPlayerRow[];
  if (rows.length === 0) return [];

  const per90 = (value: number | null, minutes: number) =>
    minutes > 0 ? ((value ?? 0) / minutes) * 90 : 0;

  const stats = rows.map((r) => {
    const s = r.player_stats[0];
    return {
      passingAccuracy: s.passing_accuracy ?? 0,
      progressivePasses: per90(s.progressive_passes, s.minutes),
      progressiveCarries: per90(s.progressive_carries, s.minutes),
      dribblesCompleted: per90(s.dribbles_completed, s.minutes),
      expectedAssists: per90(s.expected_assists, s.minutes),
      shotCreatingActions: per90(s.shot_creating_actions, s.minutes),
      tackles: per90(s.tackles, s.minutes),
      interceptions: per90(s.interceptions, s.minutes),
      pressures: per90(s.pressures, s.minutes),
    };
  });

  const normPassingAccuracy = minMaxNormalize(stats.map((s) => s.passingAccuracy));
  const normProgressivePasses = minMaxNormalize(stats.map((s) => s.progressivePasses));
  const normProgressiveCarries = minMaxNormalize(stats.map((s) => s.progressiveCarries));
  const normDribbles = minMaxNormalize(stats.map((s) => s.dribblesCompleted));
  const normXA = minMaxNormalize(stats.map((s) => s.expectedAssists));
  const normSCA = minMaxNormalize(stats.map((s) => s.shotCreatingActions));
  const normTackles = minMaxNormalize(stats.map((s) => s.tackles));
  const normInterceptions = minMaxNormalize(stats.map((s) => s.interceptions));
  const normPressures = minMaxNormalize(stats.map((s) => s.pressures));

  return rows.map((r, i) => ({
    id: r.id,
    name: r.name,
    age: r.age,
    cost: r.market_value,
    stats: {
      passing: (normPassingAccuracy[i] + normProgressivePasses[i]) / 2,
      dribbling: (normProgressiveCarries[i] + normDribbles[i]) / 2,
      creativity: (normXA[i] + normSCA[i]) / 2,
      defending: (normTackles[i] + normInterceptions[i]) / 2,
      pressing: normPressures[i],
      age: ageScore(r.age),
    },
  }));
}
