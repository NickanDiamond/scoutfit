import { supabase } from "./supabaseClient";
import { Player, Weights, minMaxNormalize } from "./scoring";
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
      "creativity_weight, threat_weight, influence_weight, productivity_weight, reliability_weight"
    )
    .eq("club_id", clubId)
    .eq("position", position)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    creativity: data.creativity_weight ?? 0,
    threat: data.threat_weight ?? 0,
    influence: data.influence_weight ?? 0,
    productivity: data.productivity_weight ?? 0,
    reliability: data.reliability_weight ?? 0,
  };
}

interface RawPlayerRow {
  id: string;
  name: string;
  price: number;
  player_stats: {
    minutes: number;
    goals_scored: number | null;
    assists: number | null;
    creativity: number | null;
    influence: number | null;
    threat: number | null;
  }[];
}

const FULL_SEASON_MINUTES = 3420;

// Fetches every player at `position` with a player_stats row for `season`,
// derives "output" (goals+assists per 90) and "reliability" (minutes played
// vs a full season), then min-max normalizes creativity/threat/influence/
// output/reliability across the fetched pool so every dimension lands on a
// comparable 0-100 scale.
export async function getPlayersForPosition(
  position: PositionKey,
  season: string = DEFAULT_SEASON
): Promise<Player[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("players")
    .select(
      `id, name, price,
       player_stats!inner ( minutes, goals_scored, assists, creativity, influence, threat )`
    )
    .eq("position", position)
    .eq("player_stats.season", season);

  if (error) throw error;
  const rows = (data ?? []) as unknown as RawPlayerRow[];
  if (rows.length === 0) return [];

  const clip = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const derived = rows.map((r) => {
    const s = r.player_stats[0];
    const minutes = s.minutes || 0;
    const productivity = minutes > 0 ? (((s.goals_scored ?? 0) + (s.assists ?? 0)) / minutes) * 90 : 0;
    const reliability = clip((minutes / FULL_SEASON_MINUTES) * 100, 0, 100);
    return {
      creativity: s.creativity ?? 0,
      threat: s.threat ?? 0,
      influence: s.influence ?? 0,
      productivity,
      reliability,
    };
  });

  const nCreativity = minMaxNormalize(derived.map((d) => d.creativity));
  const nThreat = minMaxNormalize(derived.map((d) => d.threat));
  const nInfluence = minMaxNormalize(derived.map((d) => d.influence));
  const nProductivity = minMaxNormalize(derived.map((d) => d.productivity));
  const nReliability = minMaxNormalize(derived.map((d) => d.reliability));

  return rows.map((r, i) => ({
    id: r.id,
    name: r.name,
    cost: r.price,
    stats: {
      creativity: nCreativity[i],
      threat: nThreat[i],
      influence: nInfluence[i],
      productivity: nProductivity[i],
      reliability: nReliability[i],
    },
  }));
}
