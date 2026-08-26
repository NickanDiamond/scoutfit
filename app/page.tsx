"use client";

import { useEffect, useMemo, useState, DragEvent } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Search,
  Users,
  Trophy,
  Database,
  WifiOff,
  ArrowLeftRight,
  X,
  ChevronLeft,
  Check,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Shield,
  TrendingUp,
} from "lucide-react";
import { CLUBS as SAMPLE_CLUBS, POSITIONS, PLAYERS as SAMPLE_PLAYERS, SQUADS as SAMPLE_SQUADS, PositionKey, SquadMember } from "@/lib/sampleData";
import {
  METRICS,
  METRIC_LABELS,
  METRIC_HELP,
  Metric,
  rankPlayersRealistic,
  rankToWeights,
  valueScores,
  fitScore,
  Weights,
  Player,
} from "@/lib/scoring";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { getClubs, getClubWeights, getPlayersForPosition, getSquadForClub, getFullSquad, getAllClubWeights, ClubRow } from "@/lib/db";

const COLORS = ["#22d3ee", "#a78bfa", "#f2cd6b", "#fb923c"];
const MAX_COMPARE = 4;
const RANK_STYLES = [
  "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  "bg-slate-400/20 text-slate-300 border-slate-400/40",
  "bg-orange-700/20 text-orange-300 border-orange-700/40",
];

type Step = "club" | "position" | "stats" | "results";
const STEP_ORDER: Step[] = ["club", "position", "stats", "results"];
const STEP_LABEL: Record<Step, string> = {
  club: "Club",
  position: "Position",
  stats: "Stats",
  results: "Results",
};

function Jersey({ number, size = 44 }: { number: number | string; size?: number }) {
  const gid = `jgrad-${number}`;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-lg shrink-0">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <path
        d="M22 3 L10 13 L15 24 L21 20 L21 59 L43 59 L43 20 L49 24 L54 13 L42 3 L34 8 L30 8 Z"
        fill={`url(#${gid})`}
        stroke="#22d3ee"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text x="32" y="41" textAnchor="middle" fontSize="19" fontWeight="800" fill="#67e8f9">
        {number}
      </text>
    </svg>
  );
}

interface XISlot {
  name: string;
  sub?: string;
}

// Rows laid out top (attacking third) to bottom (own third), each slot
// positioned by percentage so the shape reads as a real formation —
// here a 4-2-3-1 minus the goalkeeper (no real GK data to show).
// Numbers follow the traditional outfield shirt-number convention for
// this shape (2/3 full-backs, 4/5 centre-backs, 6 holding mid, 7/11
// wingers, 8 central mid, 9 striker, 10 attacking mid) instead of an
// arbitrary row/column count — real convention, not real squad numbers.
const XI_NUMBERS = [
  [9],           // ST
  [7, 10, 11],   // WING, CAM, WING
  [6, 8],        // DM, CM
  [3, 5, 4, 2],  // FB, CB, CB, FB
];
function PitchXI({ rows }: { rows: XISlot[][] }) {
  const rowYs = [10, 34, 58, 84];
  return (
    <div className="relative pitch-stripes pitch-markings rounded-xl overflow-hidden" style={{ aspectRatio: "3 / 4" }}>
      {rows.map((slots, ri) =>
        slots.map((slot, si) => {
          const count = slots.length;
          const x = ((si + 1) / (count + 1)) * 100;
          return (
            <div
              key={`${ri}-${si}`}
              className="absolute flex flex-col items-center w-20 -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${x}%`, top: `${rowYs[ri]}%` }}
            >
              <Jersey number={XI_NUMBERS[ri]?.[si] ?? si + 1} size={38} />
              <span className="text-white text-[11px] font-semibold mt-0.5 leading-tight drop-shadow truncate max-w-[80px]">
                {slot?.name ?? "—"}
              </span>
              {slot?.sub && <span className="text-white/70 text-[9px] leading-tight">{slot.sub}</span>}
            </div>
          );
        })
      )}
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>("club");
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [clubKey, setClubKey] = useState<string>("");
  const [posKey, setPosKey] = useState<PositionKey | null>(null);
  const [defaultWeights, setDefaultWeights] = useState<Weights | null>(null);
  const [rankedStats, setRankedStats] = useState<Metric[]>([...METRICS]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [valueMode, setValueMode] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [squad, setSquad] = useState<SquadMember[]>([]);
  const [fullSquad, setFullSquad] = useState<Partial<Record<PositionKey, SquadMember[]>>>({});
  const [fullWeights, setFullWeights] = useState<Partial<Record<PositionKey, Weights>>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedSquad, setSelectedSquad] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      getClubs().then(setClubs).catch((e) => setError(e.message));
    } else {
      setClubs(
        Object.entries(SAMPLE_CLUBS).map(([id, c]) => ({
          id,
          name: c.name,
          identity: c.identity,
          budgetTier: c.budgetTier,
        }))
      );
    }
  }, []);

  function chooseClub(id: string) {
    setClubKey(id);
    setStep("position");
  }

  async function choosePosition(pos: PositionKey) {
    setPosKey(pos);
    setError(null);
    let weights: Weights | null;
    if (isSupabaseConfigured) {
      try {
        weights = await getClubWeights(clubKey, pos);
      } catch (e: any) {
        setError(e.message);
        weights = null;
      }
    } else {
      weights = SAMPLE_CLUBS[clubKey].weights[pos];
    }
    setDefaultWeights(weights);
    setRankedStats(
      weights ? [...METRICS].sort((a, b) => weights![b] - weights![a]) : [...METRICS]
    );
    setStep("stats");
  }

  function moveStat(index: number, direction: -1 | 1) {
    setRankedStats((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setRankedStats((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  async function showResults() {
    if (!posKey) return;
    setSelected([]);
    setError(null);
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const [p, s, fs, fw] = await Promise.all([
          getPlayersForPosition(posKey),
          getSquadForClub(clubKey, posKey),
          getFullSquad(clubKey),
          getAllClubWeights(clubKey),
        ]);
        setPlayers(p);
        setSquad(s);
        setFullSquad(fs);
        setFullWeights(fw);
      } else {
        setPlayers(SAMPLE_PLAYERS[posKey]);
        setSquad(SAMPLE_SQUADS[clubKey]?.[posKey] ?? []);
        setFullSquad(SAMPLE_SQUADS[clubKey] ?? {});
        setFullWeights(SAMPLE_CLUBS[clubKey]?.weights ?? {});
      }
      setStep("results");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function startOver() {
    setStep("club");
    setClubKey("");
    setPosKey(null);
    setRankedStats([...METRICS]);
    setValueMode(false);
    setSquad([]);
    setFullSquad({});
    setFullWeights({});
    setSelectedSquad([]);
    setSelected([]);
    setQuery("");
  }

  function backOneStep() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  }

  const weights = useMemo(() => rankToWeights(rankedStats), [rankedStats]);
  const currentClub = clubs.find((c) => c.id === clubKey);
  const currentClubName = currentClub?.name ?? "";
  const byFit = useMemo(
    () => rankPlayersRealistic(players, weights, currentClub?.budgetTier ?? 0),
    [players, weights, currentClub]
  );
  const valueByName = useMemo(() => {
    const scores = valueScores(byFit);
    const m = new Map<string, number>();
    byFit.forEach((p, i) => m.set(p.name, scores[i]));
    return m;
  }, [byFit]);
  const ranked = useMemo(() => {
    if (!valueMode) return byFit;
    return [...byFit].sort(
      (a, b) => (valueByName.get(b.name) ?? 0) - (valueByName.get(a.name) ?? 0)
    );
  }, [byFit, valueByName, valueMode]);
  const filtered = useMemo(
    () => ranked.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [ranked, query]
  );
  const squadRanked = useMemo(
    () =>
      squad
        .map((m) => ({ ...m, score: fitScore({ name: m.name, cost: 0, stats: m.stats }, weights) }))
        .sort((a, b) => b.score - a.score),
    [squad, weights]
  );
  const bestSquadScore = squadRanked.length > 0 ? squadRanked[0].score : null;

  const startingXI = useMemo(() => {
    const bestAt = (pos: PositionKey, n: number) => {
      const members = fullSquad[pos] ?? [];
      const w = fullWeights[pos];
      if (!w || members.length === 0) return [];
      return members
        .map((m) => ({ ...m, score: fitScore({ name: m.name, cost: 0, stats: m.stats }, w) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, n);
    };
    return {
      ST: bestAt("ST", 1),
      WING: bestAt("WING", 2),
      CAM: bestAt("CAM", 1),
      DM: bestAt("DM", 1),
      CM: bestAt("CM", 1),
      FB: bestAt("FB", 2),
      CB: bestAt("CB", 2),
    };
  }, [fullSquad, fullWeights]);

  function toggleCompare(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length + selectedSquad.length >= MAX_COMPARE) return prev;
      return [...prev, name];
    });
  }

  function toggleSquadCompare(name: string) {
    setSelectedSquad((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length + selected.length >= MAX_COMPARE) return prev;
      return [...prev, name];
    });
  }

  interface CompareEntry {
    key: string;
    label: string;
    stats: Player["stats"];
  }
  const compareEntries: CompareEntry[] = [
    ...players
      .filter((p) => selected.includes(p.name))
      .map((p) => ({ key: `t:${p.name}`, label: p.name, stats: p.stats })),
    ...squadRanked
      .filter((m) => selectedSquad.includes(m.name))
      .map((m) => ({ key: `s:${m.name}`, label: `${m.name} (current)`, stats: m.stats })),
  ];
  const radarData = METRICS.map((m) => {
    const row: Record<string, string | number> = { metric: METRIC_LABELS[m] };
    compareEntries.forEach((e) => {
      row[e.key] = e.stats[m];
    });
    return row;
  });

  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <main className="min-h-screen stadium-bg text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#060a14]/85 backdrop-blur-md">
        <div className="h-1 pitch-stripes" />
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="floodlight opacity-70" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-volt-400 to-volt-600 shadow-glow-sm flex items-center justify-center font-bold text-sm text-slate-950">
                SF
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">ScoutFit</h1>
              <p className="text-slate-500 text-xs mt-0.5">Transfer Fit Analyzer</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
              isSupabaseConfigured
                ? "border-volt-600/40 text-volt-400 bg-volt-500/10"
                : "border-amber-700/40 text-amber-300 bg-amber-500/10"
            }`}
          >
            {isSupabaseConfigured ? <Database size={13} /> : <WifiOff size={13} />}
            {isSupabaseConfigured ? "Live database" : "Real EA FC 26 ratings"}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Step tracker */}
        <div className="flex items-center gap-2 mb-8">
          {STEP_ORDER.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center gap-2 text-xs font-medium ${
                  i <= stepIndex ? "text-volt-400" : "text-slate-600"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center border text-[11px] ${
                    i < stepIndex
                      ? "bg-volt-500 border-volt-500 text-slate-950"
                      : i === stepIndex
                      ? "border-volt-500"
                      : "border-slate-700"
                  }`}
                >
                  {i < stepIndex ? <Check size={11} /> : i + 1}
                </span>
                {STEP_LABEL[s]}
              </div>
              {i < STEP_ORDER.length - 1 && <div className="flex-1 h-px bg-slate-800" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 text-xs rounded-lg px-3 py-2 mb-5">
            {error}
          </div>
        )}

        {step !== "club" && (
          <button
            onClick={backOneStep}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-white mb-4"
          >
            <ChevronLeft size={14} /> Back
          </button>
        )}

        {/* Step 1: club */}
        {step === "club" && (
          <div>
            <div className="w-10 h-1.5 rounded-full pitch-stripes mb-3" />
            <h2 className="text-xl font-bold mb-1">Which club are you scouting for?</h2>
            <p className="text-slate-500 text-sm mb-6">Pick a club to get started.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {clubs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => chooseClub(c.id)}
                  className="glass-card rounded-xl p-4 text-left hover:border-volt-500 hover:shadow-glow-sm hover:-translate-y-0.5 transition-all duration-150"
                >
                  <span className="font-semibold text-slate-100">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: position */}
        {step === "position" && (
          <div>
            <div className="w-10 h-1.5 rounded-full pitch-stripes mb-3" />
            <h2 className="text-xl font-bold mb-1">What position does {currentClubName} need?</h2>
            <p className="text-slate-500 text-sm mb-6">Pick the position they're looking to fill.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(POSITIONS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => choosePosition(key as PositionKey)}
                  className="glass-card rounded-xl p-5 text-left hover:border-volt-500 hover:shadow-glow-sm hover:-translate-y-0.5 transition-all duration-150"
                >
                  <span className="font-semibold text-slate-100">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: stats — drag to rank */}
        {step === "stats" && (
          <div>
            <h2 className="text-xl font-bold mb-1">Which stats matter most?</h2>
            <p className="text-slate-500 text-sm mb-6">
              Drag to reorder — rank 1 carries the most weight. We've pre-ranked what{" "}
              {currentClubName} usually prioritizes; rearrange to match what you're after.
            </p>
            <div className="space-y-2 mb-6">
              {rankedStats.map((m, i) => (
                <div
                  key={m}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  className={`w-full flex items-center gap-3 border rounded-xl p-3.5 text-left bg-slate-900/60 transition-colors cursor-grab active:cursor-grabbing ${
                    dragIndex === i ? "border-volt-500 bg-volt-500/10" : "border-slate-800"
                  }`}
                >
                  <span className="text-slate-600 shrink-0">
                    <GripVertical size={16} />
                  </span>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center border border-volt-600/40 text-volt-400 bg-volt-500/10 text-[11px] font-semibold shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="font-medium text-slate-100">{METRIC_LABELS[m]}</span>
                    <span className="text-slate-500 text-xs block">{METRIC_HELP[m]}</span>
                  </span>
                  <span className="text-xs text-slate-500 tabular-nums shrink-0 hidden sm:inline">
                    {weights[m]}%
                  </span>
                  <span className="flex flex-col shrink-0">
                    <button
                      type="button"
                      onClick={() => moveStat(i, -1)}
                      disabled={i === 0}
                      className="text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500"
                      aria-label={`Move ${METRIC_LABELS[m]} up`}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStat(i, 1)}
                      disabled={i === rankedStats.length - 1}
                      className="text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500"
                      aria-label={`Move ${METRIC_LABELS[m]} down`}
                    >
                      <ChevronDown size={14} />
                    </button>
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setValueMode((v) => !v)}
              className={`w-full flex items-center gap-3 border rounded-xl p-3.5 text-left transition-colors mb-6 ${
                valueMode
                  ? "border-volt-500 bg-volt-500/10"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <span
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                  valueMode ? "bg-volt-500 border-volt-500 text-slate-950" : "border-slate-700"
                }`}
              >
                {valueMode && <Check size={12} />}
              </span>
              <span>
                <span className="font-medium text-slate-100">Prioritize value for money</span>
                <span className="text-slate-500 text-xs block">
                  Rank by fit-vs-price, not raw fit — rewards a player who outperforms their
                  price tag over a similarly-good star who costs far more.
                </span>
              </span>
            </button>

            <button
              onClick={showResults}
              className="w-full bg-volt-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none text-slate-950 font-semibold rounded-xl py-3 hover:bg-volt-400 shadow-glow-sm transition-all"
            >
              Show recommendations
            </button>
          </div>
        )}

        {/* Step 4: results */}
        {step === "results" && (
          <div>
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <h2 className="text-xl font-bold">
                Best fits: {currentClubName} · {posKey ? POSITIONS[posKey] : ""}
              </h2>
              <button
                onClick={startOver}
                className="text-xs border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-400 hover:text-white hover:border-volt-500 transition-colors"
              >
                Start over
              </button>
            </div>
            {currentClub?.identity && (
              <p className="text-xs text-slate-500 mb-1">
                <span className="text-slate-400 font-medium">{currentClubName}&rsquo;s identity:</span>{" "}
                {currentClub.identity}
                {currentClub.budgetTier ? ` · realistic budget up to ~€${currentClub.budgetTier}m` : ""}
              </p>
            )}
            <p className="text-slate-500 text-sm mb-6">
              Ranked by priority: {rankedStats.map((m) => METRIC_LABELS[m]).join(" > ")}
              {valueMode && " — sorted for best value, not just raw fit"}.
              {!valueMode && " Sorting also accounts for what's realistic for this club to actually spend."}
            </p>

            {(() => {
              const slot = (m: (typeof startingXI)["ST"][number] | undefined, sub: string) =>
                m ? { name: m.name, sub } : undefined;
              const xiRows: XISlot[][] = [
                [slot(startingXI.ST[0], "ST")].filter(Boolean) as XISlot[],
                [
                  slot(startingXI.WING[0], "WING"),
                  slot(startingXI.CAM[0], "CAM"),
                  slot(startingXI.WING[1], "WING"),
                ].filter(Boolean) as XISlot[],
                [slot(startingXI.DM[0], "DM"), slot(startingXI.CM[0], "CM")].filter(Boolean) as XISlot[],
                [
                  slot(startingXI.FB[0], "FB"),
                  slot(startingXI.CB[0], "CB"),
                  slot(startingXI.CB[1], "CB"),
                  slot(startingXI.FB[1], "FB"),
                ].filter(Boolean) as XISlot[],
              ];
              const hasAny = xiRows.some((r) => r.length > 0);
              return hasAny ? (
                <div className="border border-slate-800 rounded-xl overflow-hidden mb-5">
                  <div className="flex items-center gap-2 text-slate-300 px-4 py-2.5 bg-slate-900">
                    <Shield size={14} />
                    <h3 className="text-xs uppercase tracking-wide font-medium">
                      {currentClubName}&rsquo;s likely current XI
                    </h3>
                    <span className="text-[10px] text-slate-500 ml-auto normal-case">
                      no GK data · numbers aren&rsquo;t real squad numbers
                    </span>
                  </div>
                  <PitchXI rows={xiRows} />
                </div>
              ) : null;
            })()}

            <div className="border border-slate-800 rounded-xl overflow-hidden mb-5">
              <div className="flex items-center gap-2 text-slate-300 px-4 py-2.5 bg-slate-900">
                <Shield size={14} />
                <h3 className="text-xs uppercase tracking-wide font-medium">
                  {currentClubName}&rsquo;s current {posKey ? POSITIONS[posKey] : ""}s
                </h3>
                <span className="text-[10px] text-slate-500 ml-auto normal-case">
                  numbered by fit rank, not real squad numbers
                </span>
              </div>
              {squadRanked.length === 0 ? (
                <p className="text-xs text-slate-500 px-4 py-6 bg-slate-900/60">
                  No current-squad data for this position — can&rsquo;t show an upgrade
                  comparison here, only the ranked targets below.
                </p>
              ) : (
                <div className="pitch-stripes pitch-markings px-4 py-5">
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-4">
                    {squadRanked.map((m, i) => (
                      <div key={m.name} className="flex flex-col items-center w-20 text-center">
                        <Jersey number={i + 1} />
                        <span className="text-white text-xs font-semibold mt-1 leading-tight drop-shadow">
                          {m.name}
                        </span>
                        <span className="text-white/70 text-[10px] leading-tight">
                          age {m.age} · fit {m.score.toFixed(0)}
                        </span>
                        <button
                          onClick={() => toggleSquadCompare(m.name)}
                          className={`mt-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                            selectedSquad.includes(m.name)
                              ? "bg-volt-500 border-volt-500 text-slate-950 font-semibold"
                              : "border-white/30 text-white/80 hover:border-white"
                          }`}
                        >
                          {selectedSquad.includes(m.name) ? "Comparing" : "Compare"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by player name…"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-volt-500 placeholder:text-slate-600"
              />
            </div>

            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={14} />
                  <h3 className="text-xs uppercase tracking-wide font-medium">Ranked recommendations</h3>
                </div>
                <span className="text-xs text-slate-600">{filtered.length} players</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-3">Check up to 4 to compare side by side — including a current squad player above.</p>

              {loading && (
                <div className="space-y-2 animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-9 bg-slate-800/60 rounded-lg" />
                  ))}
                </div>
              )}

              {!loading && filtered.length > 0 && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wide">
                      <th className="py-2 font-medium">#</th>
                      <th className="font-medium">Player</th>
                      <th className="font-medium">Price</th>
                      <th className="font-medium">Fit Score</th>
                      <th className="font-medium">{valueMode ? "Value" : ""}</th>
                      <th className="font-medium">Compare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => (
                      <tr key={p.name} className="border-t border-slate-800/70 hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5">
                          {i < 3 ? (
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-[11px] font-semibold ${RANK_STYLES[i]}`}
                            >
                              {i === 0 ? <Trophy size={11} /> : i + 1}
                            </span>
                          ) : (
                            <span className="text-slate-600 pl-1.5">{i + 1}</span>
                          )}
                        </td>
                        <td className="font-medium text-slate-200">
                          {p.name}
                          {bestSquadScore !== null && p.score > bestSquadScore && (
                            <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-volt-400 bg-volt-500/10 border border-volt-600/40 rounded-full px-1.5 py-0.5 align-middle">
                              <TrendingUp size={9} />+{(p.score - bestSquadScore).toFixed(0)}
                            </span>
                          )}
                          {p.stretch && (
                            <span
                              className="ml-2 inline-flex items-center text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-600/40 rounded-full px-1.5 py-0.5 align-middle"
                              title={`Priced above ${currentClubName}'s realistic budget tier`}
                            >
                              stretch
                            </span>
                          )}
                        </td>
                        <td className="text-slate-400">€{p.cost}m</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-volt-600 to-volt-400 rounded-full shadow-glow-sm"
                                style={{ width: `${p.score}%` }}
                              />
                            </div>
                            <span className="font-semibold tabular-nums text-slate-200 w-9">{p.score.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="text-xs text-slate-400 tabular-nums">
                          {valueMode
                            ? `${(valueByName.get(p.name) ?? 0) >= 0 ? "+" : ""}${(valueByName.get(p.name) ?? 0).toFixed(0)}`
                            : ""}
                        </td>
                        <td>
                          <button
                            onClick={() => toggleCompare(p.name)}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              selected.includes(p.name)
                                ? "bg-volt-500 border-volt-500 text-slate-950"
                                : "border-slate-700 hover:border-volt-500"
                            }`}
                          >
                            {selected.includes(p.name) && <span className="text-[10px] font-bold">✓</span>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {compareEntries.length >= 2 && (
              <div className="glass-card rounded-xl p-4 mt-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ArrowLeftRight size={14} />
                    <h3 className="text-xs uppercase tracking-wide font-medium">Compare</h3>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {compareEntries.map((e, i) => (
                      <span
                        key={e.key}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-slate-800 bg-slate-800/50"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                        {e.label}
                        <button
                          onClick={() =>
                            e.key.startsWith("s:") ? toggleSquadCompare(e.key.slice(2)) : toggleCompare(e.key.slice(2))
                          }
                          className="text-slate-500 hover:text-white"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#2a3346" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#8b93a7", fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    {compareEntries.map((e, i) => (
                      <Radar
                        key={e.key}
                        name={e.label}
                        dataKey={e.key}
                        stroke={COLORS[i]}
                        fill={COLORS[i]}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-slate-700 text-xs mt-10">
          {isSupabaseConfigured ? "Connected to Supabase" : "Real 2024-25 Premier League stats · sample pool"} · ScoutFit prototype
        </p>
      </div>
    </main>
  );
}
