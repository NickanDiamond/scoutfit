# ScoutFit — Transfer Fit Analyzer

Next.js (App Router) + Tailwind + Recharts starter, scoring logic in plain
TypeScript, Supabase schema ready to wire in.

## Run it locally

1. Install Node.js 18+ if you don't have it: https://nodejs.org
2. In this folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:3000 — runs on sample/fictional player data
   (lib/sampleData.ts) until you connect real data.

## What's already built

- `lib/scoring.ts` — the weighted fit-score math (normalize weights, score a
  player, rank a list). Pure functions, no UI, easy to unit test.
- `lib/sampleData.ts` — placeholder clubs/positions/players standing in for
  the real dataset.
- `app/page.tsx` — the whole UI: club/position pickers, weight sliders,
  ranked table, radar-chart comparison (pick 2-3 players to compare).
- `supabase/schema.sql` — the five tables from the project concept (clubs,
  players, player_stats, club_weights, saved_analyses). Not connected yet.

## Next steps (in order)

1. Create a Supabase project at supabase.com, paste `supabase/schema.sql`
   into the SQL editor and run it.
2. Clean an FBref + Transfermarkt dataset with pandas, load it into
   `players` and `player_stats`.
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase
   project URL + anon key (Project Settings → API).
4. Replace the static `PLAYERS[posKey]` in `app/page.tsx` with a Supabase
   query filtered by position.
5. Populate `club_weights` for your chosen clubs/positions instead of the
   hardcoded weights in `sampleData.ts`.
6. Deploy to Vercel — add the same env vars in the project settings there.
