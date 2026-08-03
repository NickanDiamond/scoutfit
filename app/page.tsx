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
  SlidersHorizontal,
  Users,
  RefreshCw,
  Trophy,
  Database,
  WifiOff,
  ArrowLeftRight,
  X,
} from "lucide-react";
import { CLUBS as SAMPLE_CLUBS, POSITIONS, PLAYERS as SAMPLE_PLAYERS, PositionKey } from "@/lib/sampleData";
import { METRICS, METRIC_LABELS, rankPlayers, Weights, Player } from "@/lib/scoring";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { getClubs, getClubWeights, getPlayersForPosition, ClubRow } from "@/lib/db";

const COLORS = ["#4f7cff", "#22c55e", "#f2cd6b"];
const RANK_STYLES = [
  "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  "bg-slate-400/20 text-slate-300 border-slate-400/40",
  "bg-orange-700/20 text-orange-300 border-orange-700/40",
];

export default function Home() {
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [clubKey, setClubKey] = useState<string>("");
  const [posKey, setPosKey] = useState<PositionKey>("RW");
  const [weights, setWeights] = useState<Weights | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      getClubs()
        .then((rows) => {
          setClubs(rows);
          if (rows.length > 0) setClubKey(rows[0].id);
        })
        .catch((e) => setError(e.message));
    } else {
      const sampleRows = Object.entries(SAMPLE_CLUBS).map(([id, c]) => ({ id, name: c.name }));
      setClubs(sampleRows);
      setClubKey(sampleRows[0].id);
    }
  }, []);

  useEffect(() => {
    if (!clubKey) return;
    setSelected([]);
    setError(null);

    if (isSupabaseConfigured) {
      setLoading(true);
      Promise.all([getClubWeights(clubKey, posKey), getPlayersForPosition(posKey)])
        .then(([w, p]) => {
          setWeights(w);
          setPlayers(p);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      setWeights(SAMPLE_CLUBS[clubKey].weights[posKey]);
      setPlayers(SAMPLE_PLAYERS[posKey]);
    }
  }, [clubKey, posKey]);

  const ranked = useMemo(() => {
    if (!weights) return [];
    return rankPlayers(players, weights);
  }, [players, weights]);

  const filtered = useMemo(
    () => ranked.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [ranked, query]
  );

  function toggleSelect(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  }

  function resetWeights() {
    if (isSupabaseConfigured) {
      getClubWeights(clubKey, posKey).then(setWeights).catch((e) => setError(e.message));
    } else {
      setWeights(SAMPLE_CLUBS[clubKey].weights[posKey]);
    }
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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
            {isSupabaseConfigured ? "Live database" : "Sample data"}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 text-xs rounded-lg px-3 py-2 mb-5">
            {error}
          </div>
        )}

        {/* Club / position controls */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pitch-500"
            value={clubKey}
            onChange={(e) => setClubKey(e.target.value)}
          >
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pitch-500"
            value={posKey}
            onChange={(e) => setPosKey(e.target.value as PositionKey)}
          >
            {Object.entries(POSITIONS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by player name…"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pitch-500 placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5 items-start">
          {/* Weights */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <SlidersHorizontal size={14} />
              <h2 className="text-xs uppercase tracking-wide font-medium">Priority Weights</h2>
            </div>
            {weights &&
              METRICS.map((m) => (
                <div key={m} className="mb-3.5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300">{METRIC_LABELS[m]}</span>
                    <span className="text-pitch-400 font-semibold tabular-nums">{weights[m]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={weights[m]}
                    onChange={(e) => setWeights({ ...weights, [m]: Number(e.target.value) })}
                    className="w-full accent-pitch-500"
                  />
                </div>
              ))}
            <button
              className="flex items-center gap-1.5 text-xs border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-400 hover:text-white hover:border-pitch-500 transition-colors mt-1"
              onClick={resetWeights}
            >
              <RefreshCw size={12} />
              Reset to {currentClubName || "club"} default
            </button>
          </div>

          {/* Results */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Users size={14} />
                <h2 className="text-xs uppercase tracking-wide font-medium">Ranked Recommendations</h2>
              </div>
              <span className="text-xs text-slate-600">{filtered.length} players</span>
            </div>

            {loading && (
              <div className="space-y-2 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-9 bg-slate-800/60 rounded-lg" />
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <p className="text-slate-500 text-sm py-6 text-center">No players match right now.</p>
            )}

            {!loading && filtered.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wide">
                    <th className="py-2 font-medium">#</th>
                    <th className="font-medium">Player</th>
                    <th className="font-medium">Age</th>
                    <th className="font-medium">Value</th>
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
                      <td className="text-slate-400">{p.age}</td>
                      <td className="text-slate-400">€{p.cost}m</td>
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
                          onClick={() => toggleSelect(p.name)}
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
        </div>

        {/* Compare */}
        {comparePlayers.length >= 2 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 mt-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-400">
                <ArrowLeftRight size={14} />
                <h2 className="text-xs uppercase tracking-wide font-medium">Player Comparison</h2>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {comparePlayers.map((p, i) => (
                  <span
                    key={p.name}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-slate-800 bg-slate-800/50"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                    {p.name}
                    <button onClick={() => toggleSelect(p.name)} className="text-slate-500 hover:text-white">
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

        <p className="text-center text-slate-700 text-xs mt-8">
          {isSupabaseConfigured ? "Connected to Supabase" : "Sample data mode"} · ScoutFit prototype
        </p>
      </div>
    </main>
  );
}
