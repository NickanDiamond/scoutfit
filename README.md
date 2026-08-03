# ScoutFit — Transfer Fit Analyzer

Next.js (App Router) + Tailwind + Recharts + lucide-react, wired to
Supabase, with an offline sample-data fallback so it runs before you
connect a database.

Covers the full MVP scope: 5 clubs, 4 positions, 40 sample players (10
per position) until you swap in a real dataset.

## Run it locally

1. Install Node.js 18+ if you don't have it: https://nodejs.org
2. In this folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:3000. Without a `.env.local`, it runs on the
   sample/fictional players in `lib/sampleData.ts` — the badge in the top
   bar shows "Sample data" vs "Live database".

## Connecting the real database

1. Create a project at supabase.com.
2. Paste `supabase/schema.sql` into the SQL editor and run it. It creates:
   `clubs`, `players`, `player_stats`, `club_weights`, `saved_analyses`.
3. Add rows to `clubs` and matching rows to `club_weights` (one row per
   club per position, with `passing_weight`, `dribbling_weight`,
   `creativity_weight`, `defending_weight`, `pressing_weight`,
   `age_weight` — these don't need to sum to exactly 100, the app
   normalizes them).
4. Import players into `players` + `player_stats` (season defaults to
   `"2024-2025"` — see `DEFAULT_SEASON` in `lib/db.ts`).
5. Copy `.env.local.example` to `.env.local` and fill in your project URL
   and anon key (Project Settings → API).
6. Restart `npm run dev` — the badge switches to "Live database" once
   real env vars are detected, and the app fetches from Supabase instead.

## How the scoring works

- `lib/scoring.ts` — pure functions: `minMaxNormalize` (scales a list of
  raw numbers to 0-100), `ageScore` (scores age against a 24-27 "prime
  years" band, not against the pool), `fitScore`/`rankPlayers` (weighted
  sum of a player's 6 normalized dimensions: passing, dribbling,
  creativity, defending, pressing, age).
- `lib/db.ts` — `getPlayersForPosition` fetches raw stats from
  `player_stats`, converts counting stats to per-90, min-max normalizes
  each raw stat across the fetched pool, then averages related sub-stats
  into the 6 scoring dimensions.
- `lib/sampleData.ts` — offline fallback with the same shape `lib/db.ts`
  produces. Regenerate it (different clubs, positions, or player count)
  by editing and re-running `node generate-data.cjs`.

## UI

Club/position pickers, a name filter, adjustable weight sliders (with
reset-to-club-default), a ranked table with medal badges for the top 3
and a live fit-score bar, and a radar-chart comparison for up to 3
selected players.

## Next steps

- Clean an FBref + Transfermarkt dataset with pandas and load it into
  `players`/`player_stats` (a one-off Python import script, not part of
  this repo yet — swaps out the 40 sample players for the real ~100-300).
- Hand-write real `club_weights` rows for your chosen clubs/positions.
- Add a player detail view / saved_analyses persistence for logged-in users.
- Deploy to Vercel — add the same env vars in the project settings there.
