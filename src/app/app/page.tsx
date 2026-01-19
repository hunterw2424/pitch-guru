"use client";

import { useEffect, useState } from "react";
import { createGame, createPitcher, getStore, setActivePitcher } from "@/lib/store";
import type { Pitcher } from "@/lib/types";

export default function AppHome() {
  const [pitchers, setPitchers] = useState<Pitcher[]>([]);
  const [newPitcherName, setNewPitcherName] = useState("");
  const [selectedPitcherId, setSelectedPitcherId] = useState<string>("");
  const [opponent, setOpponent] = useState("");

  const reload = () => {
    const s = getStore();
    setPitchers(s.pitchers);
    // default select first pitcher if none selected
    if (!selectedPitcherId && s.pitchers.length) setSelectedPitcherId(s.pitchers[0].id);
  };

  useEffect(() => reload(), []);

  const handleAddPitcher = () => {
    const name = newPitcherName.trim();
    if (!name) return;
    const p = createPitcher(name);
    setNewPitcherName("");
    reload();
    setSelectedPitcherId(p.id);
  };

  const handleStartGame = () => {
    if (!selectedPitcherId) return alert("Select a pitcher first.");
    const opp = opponent.trim();
    if (!opp) return alert("Enter opponent first.");

    const g = createGame(opp, new Date().toISOString().slice(0, 10));
    setActivePitcher(g.id, selectedPitcherId);

    // go to the real game route with an id
    window.location.href = `/app/game/${g.id}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Pitch Guru</h1>
          <a
            href="/"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Home / Landing →
          </a>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Pitcher</h2>

            <label className="mt-4 block text-xs text-white/60">Select existing</label>
            <select
              value={selectedPitcherId}
              onChange={(e) => setSelectedPitcherId(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
            >
              {pitchers.length === 0 && <option value="">No pitchers yet</option>}
              {pitchers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-xs text-white/60">Or create new</label>
            <div className="mt-2 flex gap-2">
              <input
                value={newPitcherName}
                onChange={(e) => setNewPitcherName(e.target.value)}
                placeholder="e.g. Hunter Wilson"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={handleAddPitcher}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Add
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Game</h2>

            <label className="mt-4 block text-xs text-white/60">Opponent</label>
            <input
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="e.g. Lewisburg High School"
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
            />

            <button
              onClick={handleStartGame}
              className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400"
            >
              Start Game
            </button>

            <p className="mt-3 text-xs text-white/50">
              This will take you to the live tracker screen.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
