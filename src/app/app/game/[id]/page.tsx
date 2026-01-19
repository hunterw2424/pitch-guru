"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addPitch,
  addAtBat,
  getGameData,
  setActivePitcher,
  setInning,
  undoLastPitch,
  undoLastAtBat,
  setActiveBatter,
  updateLineupName,
} from "@/lib/store";
import type { PitchResult, Pitcher, PitchType } from "@/lib/types";
import { calcStats } from "@/lib/stats";

function pitchTypeLabel(pt: PitchType) {
  switch (pt) {
    case "fastball":
      return "FB";
    case "curveball":
      return "CB";
    case "slider":
      return "SL";
    case "changeup":
      return "CH";
    default:
      return String(pt).toUpperCase();
  }
}

function resultLabel(r: string) {
  switch (r) {
    case "hit":
      return "Hit";
    case "out":
      return "Out";
    case "hr":
      return "HR";
    case "so":
      return "K";
    case "rbi":
      return "RBI";
    default:
      return r;
  }
}

export default function GamePage({ params }: { params: { id: string } }) {
  const gameId = params.id;

  const [pitchers, setPitchers] = useState<Pitcher[]>([]);
  const [activePitcherId, setActivePitcherId] = useState<string | undefined>(undefined);
  const [inning, setInningState] = useState(1);
  const [pitches, setPitches] = useState<any[]>([]);
  const [atBats, setAtBats] = useState<any[]>([]);
  const [opponent, setOpponent] = useState("");

  const [lineup, setLineup] = useState<{ slot: number; name?: string }[]>([]);
  const [activeBatterSlot, setActiveBatterSlotState] = useState<number>(1);
  const [pitchType, setPitchType] = useState<PitchType>("fastball");

  const reload = () => {
    const { pitchers, game, pitches, atBats } = getGameData(gameId);

    setPitchers(pitchers);
    setPitches(pitches);
    setAtBats(atBats);

    setOpponent(game?.opponent ?? "Game");
    setActivePitcherId(game?.activePitcherId);

    setInningState(game?.inning ?? 1);

    const gameLineup =
      game?.lineup ?? Array.from({ length: 9 }, (_, i) => ({ slot: i + 1, name: "" }));
    setLineup(gameLineup);

    const ab = game?.activeBatterSlot ?? 1;
    setActiveBatterSlotState(ab);
  };

  useEffect(() => reload(), []);

  const stats = useMemo(() => calcStats(pitches), [pitches]);
  const hitterStats = useMemo(
    () => calcStats(pitches, activeBatterSlot),
    [pitches, activeBatterSlot]
  );

  const activePitcher = pitchers.find((p) => p.id === activePitcherId);

  const activeBatterName =
    lineup.find((b) => b.slot === activeBatterSlot)?.name?.trim() || `Hitter ${activeBatterSlot}`;

  const lastAB = useMemo(() => {
    const ending = [...atBats]
      .filter((a: any) => a.batterSlot === activeBatterSlot && a.result !== "rbi")
      .sort((a: any, b: any) => b.createdAt - a.createdAt)[0];
    if (!ending) return null;
    return ending;
  }, [atBats, activeBatterSlot]);

  const logPitch = (result: PitchResult) => {
    if (!activePitcherId) return alert("Select a pitcher first.");

    addPitch({
      gameId,
      pitcherId: activePitcherId,
      inning,
      result,
      pitchType,
      batterSlot: activeBatterSlot,
    });

    reload();
  };

  const nextHitter = () => {
    const next = activeBatterSlot >= 9 ? 1 : activeBatterSlot + 1;
    setActiveBatterSlotState(next);
    setActiveBatter(gameId, next);
    reload();
  };

  // ✅ Batter tracker summary table (per hitter)
  const batterTable = useMemo(() => {
    const rows = Array.from({ length: 9 }, (_, i) => i + 1).map((slot) => {
      const name = lineup.find((b) => b.slot === slot)?.name?.trim() || `Hitter ${slot}`;

      const events = atBats.filter((a: any) => a.batterSlot === slot);

      const AB = events.filter((a: any) => a.result !== "rbi").length;
      const H = events.filter((a: any) => a.result === "hit" || a.result === "hr").length;
      const HR = events.filter((a: any) => a.result === "hr").length;
      const SO = events.filter((a: any) => a.result === "so").length;
      const OUT = events.filter((a: any) => a.result === "out").length;
      const RBI = events.filter((a: any) => a.result === "rbi").length;

      const pitchesSeen = events
        .filter((a: any) => a.result !== "rbi")
        .reduce((sum: number, a: any) => sum + (a.pitches ?? 0), 0);

      return { slot, name, AB, H, HR, RBI, SO, OUT, pitchesSeen };
    });

    return rows;
  }, [atBats, lineup]);

  // ✅ NEW FIX: update atBats state immediately after logging, so table updates instantly
  const logAB = (result: "out" | "hit" | "hr" | "so") => {
    const ab = addAtBat({ gameId, batterSlot: activeBatterSlot, result });
    setAtBats((prev) => [...prev, ab]); // ✅ instant UI update
    reload(); // keeps everything else in sync (pitchesSeen calc, etc.)
  };

  const addRBI = () => {
    const ab = addAtBat({ gameId, batterSlot: activeBatterSlot, result: "rbi" });
    setAtBats((prev) => [...prev, ab]); // ✅ instant UI update
    reload();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between">
          <a href="/app" className="text-sm text-white/70 hover:text-white">
            ← Back to App
          </a>
          <a href="/" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">
            Home / Landing →
          </a>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">vs {opponent}</h1>

              <p className="text-sm text-white/70">
                Pitcher:{" "}
                <span className="font-semibold text-white">
                  {activePitcher?.name ?? "None selected"}
                </span>
              </p>

              <p className="text-sm text-white/70">
                Hitter: <span className="font-semibold text-white">{activeBatterName}</span>
                <span className="text-white/50"> (#{activeBatterSlot})</span>
              </p>

              <p className="text-xs text-white/60 mt-1">
                {lastAB ? (
                  <>
                    Last AB:{" "}
                    <span className="text-white/80 font-semibold">{resultLabel(lastAB.result)}</span>
                    {lastAB.result !== "rbi" ? (
                      <>
                        {" "}
                        • Pitches: <span className="text-white/80 font-semibold">{lastAB.pitches}</span>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>Last AB: —</>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={activePitcherId ?? ""}
                onChange={(e) => {
                  const id = e.target.value;
                  setActivePitcherId(id);
                  setActivePitcher(gameId, id);
                  reload();
                }}
                className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
              >
                <option value="" disabled>
                  Select pitcher
                </option>
                {pitchers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm">
                <span className="text-white/60">Inning</span>
                <input
                  type="number"
                  min={1}
                  value={inning}
                  onChange={(e) => {
                    const val = Number(e.target.value || 1);
                    setInningState(val);
                    setInning(gameId, val);
                  }}
                  className="w-16 bg-transparent text-white outline-none"
                />
              </div>

              <button
                onClick={nextHitter}
                className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Next hitter →
              </button>

              <button
                onClick={() => {
                  undoLastPitch(gameId);
                  reload();
                }}
                className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/5"
              >
                Undo Pitch
              </button>

              <button
                onClick={() => {
                  undoLastAtBat(gameId);
                  reload();
                }}
                className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/5"
              >
                Undo AB
              </button>
            </div>
          </div>

          {/* Lineup input + at-bat controls */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
              <p className="text-sm font-semibold">Opponent Lineup (1–9)</p>
              <p className="mt-1 text-xs text-white/60">Names optional — leave blank if you want.</p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {lineup.map((b) => (
                  <div key={b.slot} className="flex items-center gap-2">
                    <span className="w-7 text-sm font-semibold text-white/70">{b.slot}</span>
                    <input
                      value={b.name ?? ""}
                      onChange={(e) => {
                        const name = e.target.value;
                        setLineup((prev) =>
                          prev.map((x) => (x.slot === b.slot ? { ...x, name } : x))
                        );
                        updateLineupName(gameId, b.slot, name);
                      }}
                      placeholder={`Hitter ${b.slot}`}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
              <p className="text-sm font-semibold">At-bat + Pitch Controls</p>

              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60 w-24">Pitch Type</span>
                  <div className="grid grid-cols-4 gap-2 w-full">
                    <PTButton active={pitchType === "fastball"} onClick={() => setPitchType("fastball")}>
                      FB
                    </PTButton>
                    <PTButton active={pitchType === "curveball"} onClick={() => setPitchType("curveball")}>
                      CB
                    </PTButton>
                    <PTButton active={pitchType === "slider"} onClick={() => setPitchType("slider")}>
                      SL
                    </PTButton>
                    <PTButton active={pitchType === "changeup"} onClick={() => setPitchType("changeup")}>
                      CH
                    </PTButton>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-white/60">Selected hitter pitch stats</p>
                  <p className="mt-1 text-sm font-semibold">
                    Strikes/Balls: {hitterStats.strikes}/{hitterStats.balls} • Hits: {hitterStats.hits} • Outs:{" "}
                    {hitterStats.outs}
                  </p>
                </div>

                {/* ✅ Batter tracker logging */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-white/60">Log this hitter’s at-bat result</p>
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    <SmallBtn onClick={() => logAB("out")}>Out</SmallBtn>
                    <SmallBtn onClick={() => logAB("hit")}>Hit</SmallBtn>
                    <SmallBtn onClick={() => logAB("hr")}>HR</SmallBtn>
                    <SmallBtn onClick={() => logAB("so")}>K</SmallBtn>
                    <SmallBtn onClick={addRBI}>+RBI</SmallBtn>
                  </div>
                  <p className="mt-2 text-[11px] text-white/50">
                    Out/Hit/HR/K records pitches seen since this hitter’s last AB. +RBI adds an RBI to this hitter.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pitcher stats row */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-6">
            <MiniStat label="Total pitches" value={String(stats.total)} />
            <MiniStat label="Strike %" value={`${stats.strikePct}%`} />
            <MiniStat label="Whiff %" value={`${stats.whiffPct}%`} />
            <MiniStat label="Strikes / Balls" value={`${stats.strikes} / ${stats.balls}`} />
            <MiniStat label="Hits" value={String(stats.hits)} />
            <MiniStat label="Outs" value={String(stats.outs)} />
          </div>

          {/* Pitch logging buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6">
            <Primary onClick={() => logPitch("strike")}>Strike</Primary>
            <Secondary onClick={() => logPitch("ball")}>Ball</Secondary>
            <Secondary onClick={() => logPitch("whiff")}>Whiff</Secondary>
            <Secondary onClick={() => logPitch("in_play")}>In Play</Secondary>
            <Secondary onClick={() => logPitch("hit")}>Hit</Secondary>
            <Secondary onClick={() => logPitch("out")}>Out</Secondary>
          </div>

          {/* ✅ Batter Tracker Table */}
          <div className="mt-6 rounded-xl border border-white/10 bg-slate-950 p-4">
            <p className="text-sm font-semibold">Batter Tracker (Opponent)</p>
            <p className="mt-1 text-xs text-white/60">Tracks AB, hits, HR, RBI, K, outs, and pitches seen.</p>

            <div className="mt-4 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-white/60">
                  <tr className="border-b border-white/10">
                    <th className="py-2 text-left">#</th>
                    <th className="py-2 text-left">Hitter</th>
                    <th className="py-2 text-right">AB</th>
                    <th className="py-2 text-right">H</th>
                    <th className="py-2 text-right">HR</th>
                    <th className="py-2 text-right">RBI</th>
                    <th className="py-2 text-right">K</th>
                    <th className="py-2 text-right">OUT</th>
                    <th className="py-2 text-right">Pitches</th>
                  </tr>
                </thead>
                <tbody>
                  {batterTable.map((r) => (
                    <tr
                      key={r.slot}
                      className={[
                        "border-b border-white/5",
                        r.slot === activeBatterSlot ? "bg-white/[0.06]" : "",
                      ].join(" ")}
                      onClick={() => {
                        setActiveBatterSlotState(r.slot);
                        setActiveBatter(gameId, r.slot);
                        reload();
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="py-2">{r.slot}</td>
                      <td className="py-2">{r.name}</td>
                      <td className="py-2 text-right">{r.AB}</td>
                      <td className="py-2 text-right">{r.H}</td>
                      <td className="py-2 text-right">{r.HR}</td>
                      <td className="py-2 text-right">{r.RBI}</td>
                      <td className="py-2 text-right">{r.SO}</td>
                      <td className="py-2 text-right">{r.OUT}</td>
                      <td className="py-2 text-right">{r.pitchesSeen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent pitches */}
          <div className="mt-6 rounded-xl border border-white/10 bg-slate-950 p-4">
            <p className="text-sm font-semibold">Recent pitches</p>
            <div className="mt-3 space-y-2">
              {[...pitches]
                .slice(-8)
                .reverse()
                .map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  >
                    <span className="capitalize">
                      {p.result.replace("_", " ")}{" "}
                      <span className="text-xs text-white/60">
                        • {pitchTypeLabel(p.pitchType)} • #{p.batterSlot}
                      </span>
                    </span>
                    <span className="text-xs text-white/60">Inning {p.inning}</span>
                  </div>
                ))}
              {!pitches.length && <p className="text-sm text-white/60">No pitches yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function Primary({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-emerald-500 px-4 py-4 text-sm font-bold text-slate-950 hover:bg-emerald-400"
    >
      {children}
    </button>
  );
}

function Secondary({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-sm font-bold hover:bg-white/[0.07]"
    >
      {children}
    </button>
  );
}

function PTButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg px-3 py-2 text-sm font-semibold border",
        active
          ? "bg-emerald-500 text-slate-950 border-emerald-400"
          : "bg-white/5 text-white border-white/15 hover:bg-white/[0.07]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function SmallBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-xs font-bold hover:bg-white/[0.07]"
    >
      {children}
    </button>
  );
}
