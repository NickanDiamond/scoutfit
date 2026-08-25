-- ScoutFit database schema (run in Supabase SQL editor)
-- Metrics match what's actually available from free player data (FPL-style
-- stats): creativity, threat, influence, goals/assists, minutes. No
-- invented passing/dribbling numbers.

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
  season text,
  minutes int,
  goals_scored numeric,
  assists numeric,
  creativity numeric,
  influence numeric,
  threat numeric
);

create table club_weights (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  position text not null,   -- 'CB' | 'FB' | 'DM' | 'CM' | 'CAM' | 'WING' | 'ST'
  creativity_weight numeric,
  threat_weight numeric,
  influence_weight numeric,
  productivity_weight numeric,
  reliability_weight numeric
);

create table saved_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  club_id uuid references clubs(id),
  position text,
  created_at timestamptz default now()
);
