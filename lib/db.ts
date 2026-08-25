import { supabase } from "./supabaseClient";
import { Player, Weights, minMaxNormalize } from "./scoring";
import { PositionKey, SquadMember, POSITIONS } from "./sampleData";

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


interface RawSquadRow {
  name: string;
  age: number;
  pace: number | null;
  shooting: number | null;
  passing: number | null;
  dribbling: number | null;
  defending: number | null;
  physical: number | null;
  youth: number | null;
}

// A club's real current squad at a position. Values in Supabase are
// pre-normalized at generation time (see generate-real-data.cjs BOUNDS)
// against the same scale as the target pool, so they're returned as-is
// — no live re-normalization, which would break the apples-to-apples
// comparison with scouting targets.
export async function getSquadForClub(
  clubId: string,
  position: PositionKey
): Promise<SquadMember[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("squad_players")
    .select("name, age, pace, shooting, passing, dribbling, defending, physical, youth")
    .eq("club_id", clubId)
    .eq("position", position);
  if (error) throw error;
  const rows = (data ?? []) as RawSquadRow[];
  return rows.map((r) => ({
    name: r.name,
    age: r.age,
    stats: {
      pace: r.pace ?? 0,
      shooting: r.shooting ?? 0,
      passing: r.passing ?? 0,
      dribbling: r.dribbling ?? 0,
      defending: r.defending ?? 0,
      physical: r.physical ?? 0,
      youth: r.youth ?? 0, // pre-normalized at write time (generate-real-data.cjs), same scale as the target pool
    },
  }));
}


// All club_weights rows for a club in one query, grouped by position —
// used to build the full-XI formation view (needs every position's
// default weights, not just the one being scouted).
export async function getAllClubWeights(
  clubId: string
): Promise<Partial<Record<PositionKey, Weights>>> {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from("club_weights")
    .select(
      "position, pace_weight, shooting_weight, passing_weight, dribbling_weight, defending_weight, physical_weight, youth_weight"
    )
    .eq("club_id", clubId);
  if (error) throw error;
  const out: Partial<Record<PositionKey, Weights>> = {};
  (data ?? []).forEach((row: any) => {
    out[row.position as PositionKey] = {
      pace: row.pace_weight ?? 0,
      shooting: row.shooting_weight ?? 0,
      passing: row.passing_weight ?? 0,
      dribbling: row.dribbling_weight ?? 0,
      defending: row.defending_weight ?? 0,
      physical: row.physical_weight ?? 0,
      youth: row.youth_weight ?? 0,
    };
  });
  return out;
}

interface RawFullSquadRow extends RawSquadRow {
  position: PositionKey;
}

// The club's entire real current squad (all 7 positions in one query),
// grouped by position — used for the full-XI formation view.
export async function getFullSquad(
  clubId: string
): Promise<Partial<Record<PositionKey, SquadMember[]>>> {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from("squad_players")
    .select("name, age, position, pace, shooting, passing, dribbling, defending, physical, youth")
    .eq("club_id", clubId);
  if (error) throw error;
  const rows = (data ?? []) as RawFullSquadRow[];
  const out: Partial<Record<PositionKey, SquadMember[]>> = {};
  Object.keys(POSITIONS).forEach((pos) => {
    out[pos as PositionKey] = rows
      .filter((r) => r.position === pos)
      .map((r) => ({
        name: r.name,
        age: r.age,
        stats: {
          pace: r.pace ?? 0,
          shooting: r.shooting ?? 0,
          passing: r.passing ?? 0,
          dribbling: r.dribbling ?? 0,
          defending: r.defending ?? 0,
          physical: r.physical ?? 0,
          youth: r.youth ?? 0,
        },
      }));
  });
  return out;
}
