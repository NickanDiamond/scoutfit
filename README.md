# ScoutFit — Transfer Fit Analyzer

Next.js (App Router) + Tailwind + Recharts + lucide-react, wired to
Supabase, with a real-data offline fallback so it runs before you connect
a database.

## Real data, not fictional players

The sample pool (27 players: 9 defenders, 9 midfielders, 9 forwards) is
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
- **5 scoring dimensions**, each with a one-line explanation shown right
  on the slider: Creativity, Threat, Influence, Output (goals+assists per
  90), Reliability (minutes played vs. a full season). No fabricated
  passing/dribbling numbers.
- **Numbered steps** in the UI (1. Club → 2. Position → 3. Priorities →
  4. Ranked list → 5. Compare) so the flow is obvious without instructions.

## Connecting the real database

1. Create a project at supabase.com.
2. Paste `supabase/schema.sql` into the SQL editor and run it. It creates:
   `clubs`, `players`, `player_stats`, `club_weights`, `saved_analyses`.
3. Add rows to `clubs` and matching `club_weights` rows (one per club per
   position, with `creativity_weight`, `threat_weight`,
   `influence_weight`, `productivity_weight`, `reliability_weight` — these
   don't need to sum to 100, the app normalizes them).
4. Import players into `players` + `player_stats` (season defaults to
   `"2024-2025"` — see `DEFAULT_SEASON` in `lib/db.ts`). You can pull more
   real seasons/players from the same vaastav dataset, or swap in FBref /
   Transfermarkt data if you want non-Premier-League clubs.
5. Copy `.env.local.example` to `.env.local` and fill in your project URL
   and anon key (Project Settings → API).
6. Restart `npm run dev` — the badge switches to "Live database" once
   real env vars are detected.

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
