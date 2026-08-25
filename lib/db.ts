import { supabase } from "./supabaseClient";
import { Player, Weights, minMaxNormalize } from "./scoring";
import { PositionKey } from "./sampleData";

export const DEFAULT_SEASON = "FC26";

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
      "pace_weight, shooting_weight, passing_weight, dribbling_weight, defending_weight, physical_weight, youth_weight"
    )
    .eq("club_id", clubId)
    .eq("position", position)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    pace: data.pace_weight ?? 0,
    shooting: data.shooting_weight ?? 0,
    passing: data.passing_weight ?? 0,
    dribbling: data.dribbling_weight ?? 0,
    defending: data.defending_weight ?? 0,
    physical: data.physical_weight ?? 0,
    youth: data.youth_weight ?? 0,
  };
}

interface RawPlayerRow {
  id: string;
  name: string;
  price: number;
  player_stats: {
    pace: number | null;
    shooting: number | null;
    passing: number | null;
    dribbling: number | null;
    defending: number | null;
    physical: number | null;
    age: number | null;
  }[];
}

// Fetches every player at `position` with a player_stats row for
// `season`, then min-max normalizes pace/shooting/passing/dribbling/
// defending/physical/youth (youth = age flipped so younger scores
// higher) across the fetched pool so every dimension lands on a
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
       player_stats!inner ( pace, shooting, passing, dribbling, defending, physical, age )`
    )
    .eq("position", position)
    .eq("player_stats.season", season);

  if (error) throw error;
  const rows = (data ?? []) as unknown as RawPlayerRow[];
  if (rows.length === 0) return [];

  const derived = rows.map((r) => {
    const s = r.player_stats[0];
    return {
      pace: s.pace ?? 0,
      shooting: s.shooting ?? 0,
      passing: s.passing ?? 0,
      dribbling: s.dribbling ?? 0,
      defending: s.defending ?? 0,
      physical: s.physical ?? 0,
      youthRaw: -(s.age ?? 0),
    };
  });

  const nPace = minMaxNormalize(derived.map((d) => d.pace));
  const nShooting = minMaxNormalize(derived.map((d) => d.shooting));
  const nPassing = minMaxNormalize(derived.map((d) => d.passing));
  const nDribbling = minMaxNormalize(derived.map((d) => d.dribbling));
  const nDefending = minMaxNormalize(derived.map((d) => d.defending));
  const nPhysical = minMaxNormalize(derived.map((d) => d.physical));
  const nYouth = minMaxNormalize(derived.map((d) => d.youthRaw));

  return rows.map((r, i) => ({
    id: r.id,
    name: r.name,
    cost: r.price,
    stats: {
      pace: nPace[i],
      shooting: nShooting[i],
      passing: nPassing[i],
      dribbling: nDribbling[i],
      defending: nDefending[i],
      physical: nPhysical[i],
      youth: nYouth[i],
    },
  }));
}
