"use client";

import { useMemo, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CLUBS, POSITIONS, PLAYERS, PositionKey } from "@/lib/sampleData";
import { METRICS, METRIC_LABELS, rankPlayers, Weights } from "@/lib/scoring";

const COLORS = ["#4f7cff", "#22c55e", "#f2cd6b"];

export default function Home() {
  const [clubKey, setClubKey] = useState<string>("barcelona");
  const [posKey, setPosKey] = useState<PositionKey>("RW");
  const [weights, setWeights] = useState<Weights>(CLUBS.barcelona.weights.RW);
  const [selected, setSelected] = useState<string[]>([]);

  function applyClubAndPosition(club: string, pos: PositionKey) {
    setClubKey(club);
    setPosKey(pos);
    setWeights(CLUBS[club].weights[pos]);
    setSelected([]);
  }

  const ranked = useMemo(
    () => rankPlayers(PLAYERS[posKey], weights),
    [posKey, weights]
  );

  function toggleSelect(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  }

  const comparePlayers = PLAYERS[posKey].filter((p) => selected.includes(p.name));
  const radarData = METRICS.map((m) => {
    const row: Record<string, string | number> = { metric: METRIC_LABELS[m] };
    comparePlayers.forEach((p) => {
      row[p.name] = p.stats[m];
    });
    return row;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">ScoutFit</h1>
        <p className="text-slate-400 text-sm mb-1">Transfer Fit Analyzer</p>
        <div className="bg-amber-950 border border-amber-700 text-amber-300 text-xs rounded-lg px-3 py-2 my-4">
          Sample/fictional player data — replace lib/sampleData.ts with a Supabase
          query once the real dataset is imported (see supabase/schema.sql).
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <select
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            value={clubKey}
            onChange={(e) => applyClubAndPosition(e.target.value, posKey)}
          >
            {Object.entries(CLUBS).map(([key, club]) => (
              <option key={key} value={key}>
                {club.name}
              </option>
            ))}
          </select>
          <select
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            value={posKey}
            onChange={(e) => applyClubAndPosition(clubKey, e.target.value as PositionKey)}
          >
            {Object.entries(POSITIONS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5 items-start">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs uppercase text-slate-400 mb-3">Priority Weights</h2>
            {METRICS.map((m) => (
              <div key={m} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>{METRIC_LABELS[m]}</span>
                  <span className="text-blue-400 font-semibold">{weights[m]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={weights[m]}
                  onChange={(e) => setWeights({ ...weights, [m]: Number(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>
            ))}
            <button
              className="text-xs border border-slate-700 rounded px-2 py-1 text-slate-400 hover:text-white hover:border-blue-500"
              onClick={() => setWeights(CLUBS[clubKey].weights[posKey])}
            >
              Reset to club default
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs uppercase text-slate-400 mb-3">Ranked Recommendations</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase">
                  <th className="py-2">#</th>
                  <th>Player</th>
                  <th>Age</th>
                  <th>Value</th>
                  <th>Fit Score</th>
                  <th>Compare</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((p, i) => (
                  <tr key={p.name} className="border-t border-slate-800">
                    <td className="py-2 text-slate-500">{i + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>€{p.cost}m</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-800 rounded overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                            style={{ width: `${p.score}%` }}
                          />
                        </div>
                        <span className="font-semibold tabular-nums">{p.score.toFixed(1)}</span>
                      </div>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(p.name)}
                        onChange={() => toggleSelect(p.name)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {comparePlayers.length >= 2 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-5">
            <h2 className="text-xs uppercase text-slate-400 mb-3">Player Comparison</h2>
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
    </main>
  );
}
