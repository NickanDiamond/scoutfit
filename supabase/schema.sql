-- ScoutFit database schema (run in Supabase SQL editor)

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
  age int,
  club text,
  position text,
  market_value numeric,
  created_at timestamptz default now()
);

create table player_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  season text,
  minutes int,
  passing_accuracy numeric,
  progressive_passes numeric,
  progressive_carries numeric,
  expected_assists numeric,
  shot_creating_actions numeric,
  tackles numeric,
  interceptions numeric,
  pressures numeric
);

create table club_weights (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  position text not null,
  passing_weight numeric,
  dribbling_weight numeric,
  creativity_weight numeric,
  defending_weight numeric,
  pressing_weight numeric,
  age_weight numeric
);

create table saved_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  club_id uuid references clubs(id),
  position text,
  created_at timestamptz default now()
);
