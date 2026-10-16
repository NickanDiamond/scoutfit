# ScoutFit — Transfer Fit Analyzer

A scouting tool that ranks real transfer targets for a club based on what that club actually needs at a position — and what it can realistically afford.

**Live:** [scoutfit.vercel.app](https://scoutfit.vercel.app)

<!-- Add a screenshot: save it as docs/screenshot.png and uncomment the line below -->
<!-- ![ScoutFit screenshot](docs/screenshot.png) -->

## What it does

1. Pick one of 12 clubs (Arsenal, Real Madrid, Bayern, Dortmund, …) and the position they need.
2. Drag to rank which stats matter most — pre-ordered to that club's tactical priorities.
3. Get a ranked list of 88 real players, compared against the club's current squad at that position, with a full-pitch view of the club's strongest current XI.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · Recharts · Supabase (Postgres)

Runs fully offline from bundled sample data; switches to Supabase automatically when env vars are present.

## Data

- **Ratings:** EA Sports FC 26 — Pace, Shooting, Passing, Dribbling, Defending, Physical, plus age.
- **Prices and positions:** Transfermarkt market values (€m) and sub-positions, matched by player name.
- **Squads:** 269 current outfield players across the 12 clubs.
- Club tactical weight profiles are hand-written characterizations, not official data.

Real data only: players without an FC 26 rating were dropped rather than given invented stats.

## How the scoring works

All logic lives in [`lib/scoring.ts`](lib/scoring.ts).

- **Fit score:** each of 7 dimensions (6 ratings + youth) is min–max normalized to 0–100 across the pool, then combined as a weighted sum.
- **Drag-to-rank → weights:** a ranking of *n* stats maps to linear weights *n, n−1, …, 1*, normalized to whole percentages summing to 100. Rounding drift goes to the top-ranked stat so it always stays the heaviest.
- **Budget realism:** each club has a budget tier. Players priced above it get a soft penalty of `√(budget / cost)` — enough to stop an unaffordable superstar from automatically topping the list, without hiding them (they're tagged *stretch*).
- **Value-for-money mode:** the first version used `score / cost`, which turned out to be a bug in practice — prices span ~600× while fit scores span ~4×, so it effectively sorted by cheapest. The fix converts both to percentile ranks within the result pool and uses `value = fitPercentile − costPercentile`, which surfaces cheap players who outperform their price tag.
- **Squad comparison:** current squad players are normalized against the *target pool's* bounds, so a score of 76 means the same thing for a player you have and one you're scouting. Targets that beat the club's best current option get a "+N upgrade" badge.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Connect Supabase (optional)

1. Create a Supabase project, then run `supabase/schema.sql` and `supabase/seed.sql` in the SQL editor.
2. Copy `.env.local.example` to `.env.local` and add your project URL and anon key.
3. Restart the dev server — the badge switches to "Live database."

Both SQL files and the offline sample data are generated together by `node generate-real-data.cjs`.

## Limitations

- No goalkeepers — the ratings pool has no goalkeeper data.
- No false-nine bucket — no current players in the source data carry that position tag.
- Central Midfielder is a thin pool (5 players).

## License

MIT
