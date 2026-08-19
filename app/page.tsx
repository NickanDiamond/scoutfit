"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { CLUBS as SAMPLE_CLUBS, POSITIONS, PLAYERS as SAMPLE_PLAYERS, PositionKey } from "@/lib/sampleData";
import {
  METRICS,
  METRIC_LABELS,
  METRIC_HELP,
  Metric,
  rankPlayers,
  equalWeights,
  topMetrics,
  Weights,
  Player,
} from "@/lib/scoring";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { getClubs, getClubWeights, getPlayersForPosition, ClubRow } from "@/lib/db";

const COLORS = ["#4f7cff", "#22c55e", "#f2cd6b"];
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

export default function Home() {
  const [step, setStep] = useState<Step>("club");
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [clubKey, setClubKey] = useState<string>("");
  const [posKey, setPosKey] = useState<PositionKey | null>(null);
  const [defaultWeights, setDefaultWeights] = useState<Weights | null>(null);
  const [selectedStats, setSelectedStats] = useState<Metric[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      getClubs().then(setClubs).catch((e) => setError(e.message));
    } else {
      setClubs(Object.entries(SAMPLE_CLUBS).map(([id, c]) => ({ id, name: c.name })));
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
    setSelectedStats(weights ? topMetrics(weights, 2) : []);
    setStep("stats");
  }

  function toggleStat(m: Metric) {
    setSelectedStats((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  async function showResults() {
    if (!posKey) return;
    setSelected([]);
    setError(null);
    setLoading(true);
    try {
      const p = isSupabaseConfigured ? await getPlayersForPosition(posKey) : SAMPLE_PLAYERS[posKey];
      setPlayers(p);
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
    setSelectedStats([]);
    setSelected([]);
    setQuery("");
  }

  function backOneStep() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  }

  const weights = useMemo(() => equalWeights(selectedStats), [selectedStats]);
  const ranked = useMemo(() => rankPlayers(players, weights), [players, weights]);
  const filtered = useMemo(
    () => ranked.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [ranked, query]
  );

  function toggleCompare(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  }

  const comparePlayers = players.filter((p) => selected.includes(p.name));
  const radarData = METRICS.map((m) => {
    const row: Record<string, string | number> = { metric: METRIC_LABELS[m] };
    comparePlayers.forEach((p) => {
      row[p.name] = p.stats[m];
    });
    return row;
  });
  const currentClubName = clubs.find((c) => c.id === clubKey)?.name ?? "";
  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pitch-500 to-blue-600 flex items-center justify-center font-bold text-sm">
              SF
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">ScoutFit</h1>
              <p className="text-slate-500 text-xs mt-0.5">Transfer Fit Analyzer</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
              isSupabaseConfigured
                ? "border-pitch-600/40 text-pitch-400 bg-pitch-500/10"
                : "border-amber-700/40 text-amber-300 bg-amber-500/10"
            }`}
          >
            {isSupabaseConfigured ? <Database size={13} /> : <WifiOff size={13} />}
            {isSupabaseConfigured ? "Live database" : "Real 2024-25 season data"}
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
                  i <= stepIndex ? "text-pitch-400" : "text-slate-600"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center border text-[11px] ${
                    i < stepIndex
                      ? "bg-pitch-500 border-pitch-500 text-slate-950"
                      : i === stepIndex
                      ? "border-pitch-500"
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
            <h2 className="text-xl font-bold mb-1">Which club are you scouting for?</h2>
            <p className="text-slate-500 text-sm mb-6">Pick a club to get started.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {clubs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => chooseClub(c.id)}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-left hover:border-pitch-500 hover:bg-slate-900 transition-colors"
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
            <h2 className="text-xl font-bold mb-1">What position does {currentClubName} need?</h2>
            <p className="text-slate-500 text-sm mb-6">Pick the position they're looking to fill.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(POSITIONS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => choosePosition(key as PositionKey)}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-left hover:border-pitch-500 hover:bg-slate-900 transition-colors"
                >
                  <span className="font-semibold text-slate-100">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: stats */}
        {step === "stats" && (
          <div>
            <h2 className="text-xl font-bold mb-1">Which stats matter most?</h2>
            <p className="text-slate-500 text-sm mb-6">
              Pick as many as you like — we've pre-checked what {currentClubName} usually prioritizes.
            </p>
            <div className="space-y-2 mb-6">
              {METRICS.map((m) => {
                const active = selectedStats.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() => toggleStat(m)}
                    className={`w-full flex items-center gap-3 border rounded-xl p-3.5 text-left transition-colors ${
                      active
                        ? "border-pitch-500 bg-pitch-500/10"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                        active ? "bg-pitch-500 border-pitch-500 text-slate-950" : "border-slate-700"
                      }`}
                    >
                      {active && <Check size={12} />}
                    </span>
                    <span>
                      <span className="font-medium text-slate-100">{METRIC_LABELS[m]}</span>
                      <span className="text-slate-500 text-xs block">{METRIC_HELP[m]}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={showResults}
              disabled={selectedStats.length === 0}
              className="w-full bg-pitch-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-semibold rounded-xl py-3 hover:bg-pitch-400 transition-colors"
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
                className="text-xs border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-400 hover:text-white hover:border-pitch-500 transition-colors"
              >
                Start over
              </button>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Ranked by {selectedStats.map((m) => METRIC_LABELS[m]).join(", ")}.
            </p>

            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by player name…"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pitch-500 placeholder:text-slate-600"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={14} />
                  <h3 className="text-xs uppercase tracking-wide font-medium">Ranked recommendations</h3>
                </div>
                <span className="text-xs text-slate-600">{filtered.length} players</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-3">Check up to 3 to compare side by side.</p>

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
                        <td className="font-medium text-slate-200">{p.name}</td>
                        <td className="text-slate-400">£{p.cost}m</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-pitch-500 rounded-full"
                                style={{ width: `${p.score}%` }}
                              />
                            </div>
                            <span className="font-semibold tabular-nums text-slate-200 w-9">{p.score.toFixed(1)}</span>
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => toggleCompare(p.name)}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              selected.includes(p.name)
                                ? "bg-pitch-500 border-pitch-500 text-slate-950"
                                : "border-slate-700 hover:border-pitch-500"
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

            {comparePlayers.length >= 2 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 mt-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ArrowLeftRight size={14} />
                    <h3 className="text-xs uppercase tracking-wide font-medium">Compare</h3>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {comparePlayers.map((p, i) => (
                      <span
                        key={p.name}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-slate-800 bg-slate-800/50"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                        {p.name}
                        <button onClick={() => toggleCompare(p.name)} className="text-slate-500 hover:text-white">
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
                    {comparePlayers.map((p, i) => (
                      <Radar
                        key={p.name}
                        name={p.name}
                        dataKey={p.name}
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
