-- ScoutFit database schema (run in Supabase SQL editor)
-- Metrics are EA Sports FC 26's own six-stat "pentagon" (pace, shooting,
-- passing, dribbling, defending, physical) plus age — real ratings, not
-- invented numbers.

create table clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  league text,
  tactical_style text,
  created_at timestamptz default now()
);

create table players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  club text,
  position text,           -- 'CB' | 'FB' | 'DM' | 'CM' | 'CAM' | 'WING' | 'ST'
  price numeric,            -- real market value in €m (Transfermarkt, Aug 2026)
  created_at timestamptz default now()
);

create table player_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  season text,               -- 'FC26' (EA Sports FC 26 ratings edition)
  pace numeric,
  shooting numeric,
  passing numeric,
  dribbling numeric,
  defending numeric,
  physical numeric,
  age numeric
);

create table club_weights (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  position text not null,   -- 'CB' | 'FB' | 'DM' | 'CM' | 'CAM' | 'WING' | 'ST'
  pace_weight numeric,
  shooting_weight numeric,
  passing_weight numeric,
  dribbling_weight numeric,
  defending_weight numeric,
  physical_weight numeric,
  youth_weight numeric
);

create table saved_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  club_id uuid references clubs(id),
  position text,
  created_at timestamptz default now()
);

-- A club's real current squad at each position (EA Sports FC 26 ratings),
-- normalized against the same bounds as the scouting target pool so a
-- squad player's fit score is directly comparable to a transfer
-- target's fit score. Powers the "vs your current squad" comparison.
create table squad_players (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  name text not null,
  position text not null,   -- 'CB' | 'FB' | 'DM' | 'CM' | 'CAM' | 'WING' | 'ST'
  pace numeric,
  shooting numeric,
  passing numeric,
  dribbling numeric,
  defending numeric,
  physical numeric,
  youth numeric,            -- pre-normalized from age (younger = higher), see generate-real-data.cjs
  age numeric                -- raw age, for display only
);
