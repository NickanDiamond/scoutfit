# ScoutFit — Transfer Fit Analyzer

Next.js (App Router) + Tailwind + Recharts + lucide-react, wired to
Supabase, with a real-data offline fallback so it runs before you connect
a database.

## Real data, not fictional players

The sample pool (84 players: 31 defenders, 36 midfielders, 17 forwards) is
real 2024-25 Premier League season data — goals, assists, minutes,
creativity, influence, threat, and FPL price — sourced from the public
[vaastav/Fantasy-Premier-League](https://github.com/vaastav/Fantasy-Premier-League)
dataset, which mirrors the official Fantasy Premier League API. "Price" is
an FPL game price, not an official transfer valuation — treat it as a
rough proxy, not gospel.

The 5 clubs (Arsenal, Liverpool, Manchester City, Manchester United,
Chelsea) have illustrative tactical-style weight profiles per position —
these are reasonable characterizations, not official club data.

## Run it locally

1. Install Node.js 18+ if you don't have it: https://nodejs.org
2. In this folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:3000.

## How it's simplified

- **3 positions** (Defender / Midfielder / Forward) instead of an invented
  RW/CB/CM/ST scheme — plain language, and it matches what free data
  actually supports.
- **5 scoring dimensions**, each with a one-line explanation: Creativity,
  Threat, Influence, Output (goals+assists per 90), Reliability (minutes
  played vs. a full season). No fabricated passing/dribbling numbers.
- **A step-by-step wizard** instead of one dense dashboard: pick a club,
  pick the position they need, check off which stats matter (equal
  weight each — no percentages to reason about, pre-checked with that
  club's usual top 2 priorities), then see the ranked list. Compare and
  search only appear once you have results.

## Connecting the real database

1. Create a project at supabase.com.
2. Paste `supabase/schema.sql` into the SQL editor and run it. It creates:
   `clubs`, `players`, `player_stats`, `club_weights`, `saved_analyses`.
3. Paste `supabase/seed.sql` into a new query and run it — this loads the
   same 84 real players (and matching club_weights) used in the offline
   sample, so your database starts non-empty. Both files are generated
   together by `node generate-real-data.cjs`.
4. Copy `.env.local.example` to `.env.local` and fill in your project URL
   and anon key (Project Settings → API).
5. Restart `npm run dev` — the badge switches to "Live database" once
   real env vars are detected.
6. To grow past 84 players: add more rows to the `RAW` object in
   `generate-real-data.cjs` (same real-data source, more clubs/players),
   regenerate, and re-run the new `supabase/seed.sql`.

## How the scoring works

- `lib/scoring.ts` — `minMaxNormalize` (scales raw numbers to 0-100),
  `fitScore`/`rankPlayers` (weighted sum of a player's 5 normalized
  dimensions).
- `lib/db.ts` — `getPlayersForPosition` fetches raw stats from
  `player_stats`, derives output (goals+assists per 90) and reliability
  (minutes vs. a full season), then min-max normalizes all 5 dimensions
  across the fetched pool.
- `lib/sampleData.ts` — the real offline data described above, generated
  by `node generate-real-data.cjs` (edit the RAW stats there to refresh
  or expand it).

## Next steps

- Pull more players/positions from the same free dataset to grow past 27.
- Hand-write real `club_weights` rows once you're on Supabase.
- Add a player detail view / saved_analyses persistence for logged-in users.
- Deploy to Vercel — add the same env vars in the project settings there.
