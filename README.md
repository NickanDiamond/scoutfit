# ScoutFit — Transfer Fit Analyzer

Next.js (App Router) + Tailwind + Recharts + lucide-react, wired to
Supabase, with a real-data offline fallback so it runs before you connect
a database.

## Real data, not fictional players

The sample pool (88 players) uses two real data sources:

- Ratings — real **EA Sports FC 26** player ratings: Pace, Shooting,
  Passing, Dribbling, Defending, Physical (EA's own six-stat "pentagon"),
  plus Age. Matched by name to each real player from EA's official
  ratings data.
- Prices and positions — real current market values in €m, and each
  player's actual sub-position, from Transfermarkt data, matched by
  name. Prices are real transfer valuations, not a fantasy-game price.

2 players from an earlier version of the pool (Andreas Pereira, Jamie
Vardy) were dropped — they don't have EA FC 26 ratings, so there was no
real data to give them instead of faking it.

The 12 clubs (Arsenal, Liverpool, Manchester City, Manchester United,
Chelsea, FC Barcelona, Real Madrid, Bayern Munich, Paris Saint-Germain,
Juventus, Borussia Dortmund, Inter Milan) have illustrative tactical-style
weight profiles per position — these are reasonable characterizations,
not official club data.

## Run it locally

1. Install Node.js 18+ if you don't have it: https://nodejs.org
2. In this folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:3000.

## Positions are real, not invented

**7 granular positions** — Centre-Back, Fullback, Defensive Midfielder,
Central Midfielder, Attacking Midfielder, Winger, Striker — taken
directly from Transfermarkt's own position taxonomy for each player,
instead of a coarse Defender/Midfielder/Forward split.

One honest limitation: **there's no "False Nine" / Second Striker
bucket.** Checked directly against the real data — zero current Premier
League players are tagged that position. Rather than fake a populated
category, it's left out; a false nine's skill set (Dribbling + Shooting,
lower reliance on Physical/aerial presence) is best approximated today
by ranking a Striker or Attacking Midfielder with Dribbling and Shooting
pulled to the top of the stats ranking.

Central Midfielder is also a thinner bucket (5 real players) after the
EA FC 26 data swap dropped one unmatched name — same principle: real
data only, no filler.

## How it's simplified

- **7 scoring dimensions**, each with a one-line explanation: Pace,
  Shooting, Passing, Dribbling, Defending, Physical (EA Sports FC's own
  pentagon), and Youth (age, flipped so younger scores higher). No
  fabricated stats — these are real player ratings.
- **A step-by-step wizard** instead of one dense dashboard: pick a club,
  pick the position they need, drag-to-rank which stats matter most
  (rank 1 carries the most weight, pre-ordered to that club's usual
  priorities), then see the ranked list. Compare and search only appear
  once you have results.

## Connecting the real database

1. Create a project at supabase.com.
2. Paste `supabase/schema.sql` into the SQL editor and run it. It creates:
   `clubs`, `players`, `player_stats`, `club_weights`, `saved_analyses`.
3. Paste `supabase/seed.sql` into a new query and run it — this loads the
   same 88 real players (and matching club_weights) used in the offline
   sample, so your database starts non-empty. Both files are generated
   together by `node generate-real-data.cjs`.
4. Copy `.env.local.example` to `.env.local` and fill in your project URL
   and anon key (Project Settings → API).
5. Restart `npm run dev` — the badge switches to "Live database" once
   real env vars are detected.
6. To grow past 88 targets or 269 squad players: add more rows to the `RAW` / `RAW_SQUAD` objects in
   `generate-real-data.cjs` (same real-data source, more clubs/players),
   regenerate, and re-run the new `supabase/seed.sql`.
7. **If you're upgrading from an earlier version** — any version before
   this one is missing the `squad_players` table (new), and earlier
   versions also used different column names in `player_stats` /
   `club_weights` (pace/shooting/passing/... instead of the old
   creativity/threat/influence/...). Drop and recreate everything:
   ```sql
   drop table if exists saved_analyses, squad_players, player_stats, club_weights, players, clubs cascade;
   ```
   then paste and run the new `supabase/schema.sql`, then the new
   `supabase/seed.sql`. (If you only need to add `squad_players` without
   touching existing data, you can instead just run the `create table
   squad_players (...)` block from `schema.sql` on its own, then re-run
   `seed.sql` — it'll error on duplicate club/player rows, so truncate
   `clubs, players cascade` first if you go that route.)

## How the scoring works

- `lib/scoring.ts` — `minMaxNormalize` (scales raw numbers to 0-100),
  `fitScore`/`rankPlayers` (weighted sum of a player's 7 normalized
  dimensions), `rankToWeights` (turns a drag-to-rank order into
  descending weights — rank 1 gets the biggest share), `valueScores`
  (percentile-based value-for-money — see below).
- `lib/db.ts` — `getPlayersForPosition` fetches raw ratings from
  `player_stats`, derives youth (age flipped), then min-max normalizes
  all 7 dimensions across the fetched pool.
- `lib/sampleData.ts` — the real offline data described above, generated
  by `node generate-real-data.cjs` (edit the RAW stats there to refresh
  or expand it).

### Value-for-money mode (fixed)

The first version of this used `score / cost` directly in euros. That
was a bug in practice: real transfer prices span about €0.3m to €200m
(a ~600x range) while fit scores only span roughly 20-80 points (a ~4x
range), so dividing by raw cost meant price completely dominated —
"value mode" was effectively just sorting cheapest-first, barely
touched by how good the fit actually was.

The fix (`percentileRanks` + `valueScores` in `lib/scoring.ts`):
convert both fit score and cost to a percentile rank *within the
current results pool* (0-100, 100 = best fit / most expensive), then
`value = fitPercentile - costPercentile`. A player who fits better than
their price tag suggests scores well and positive; a star who's both
the best fit and the most expensive nets out near zero — "performing
about as well as you'd expect for the price," not penalized just for
being expensive. This is what actually surfaces a cheap specialist who
overperforms their price tag, the original goal of this mode.

### Drag-to-rank stats

Instead of equal-weight checkboxes, the stats step is a draggable
ordered list of all 7 dimensions. Order determines weight — the top
stat gets the largest share, the bottom stat the smallest — via
`rankToWeights` in `lib/scoring.ts`. Arrow buttons are included next to
each row as a non-drag fallback (keyboard/touch friendly).

## Current squad vs. upgrade

Each of the 12 clubs' real current squads (269 outfield players, EA FC 26
ratings) is pulled from the same source as the scouting targets. On the
results step, a "current squad" panel shows who the club actually has at
that position today, scored with the exact same weights you picked — so
it's a genuine apples-to-apples comparison, not a separate scale that
happens to look similar.

Squad players are normalized against the *target pool's* min/max bounds
(computed once in `generate-real-data.cjs`, not per-club), so a fit
score of 76 means the same thing whether it's a player you already have
or one you're scouting. Any transfer target whose score beats the
club's best current option at that position gets a small "+N upgrade"
badge — only shown when it's a real, positive difference, not asserted
for every recommendation.

## Next steps

- Backfill the thinner Central Midfielder bucket with more real EA FC 26
  players.
- Hand-write real `club_weights` rows once you're on Supabase.
- Add a player detail view / saved_analyses persistence for logged-in users.
- Deploy to Vercel — add the same env vars in the project settings there.
