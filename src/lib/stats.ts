import type { PitchEvent } from "./types";

export function calcStats(pitches: PitchEvent[], batterSlot?: number) {
  const filtered = batterSlot
    ? pitches.filter((p) => p.batterSlot === batterSlot)
    : pitches;

  // Out does NOT count as a pitch
  const total = filtered.filter((p) => p.result !== "out").length;

  // Hit counts as a strike; Whiff counts as a strike
  const strikes = filtered.filter(
    (p) => p.result === "strike" || p.result === "whiff" || p.result === "hit"
  ).length;

  const balls = filtered.filter((p) => p.result === "ball").length;

  const whiffs = filtered.filter((p) => p.result === "whiff").length;
  const inPlay = filtered.filter((p) => p.result === "in_play").length;

  const hits = filtered.filter((p) => p.result === "hit").length;
  const outs = filtered.filter((p) => p.result === "out").length;

  const strikePct = total ? Math.round((strikes / total) * 100) : 0;

  // Keep whiff% based on pitch-like events (exclude out)
  const whiffOpp = filtered.filter((p) => p.result !== "out").length;
  const whiffPct = whiffOpp ? Math.round((whiffs / whiffOpp) * 100) : 0;

  return {
    total,
    strikes,
    balls,
    whiffs,
    inPlay,
    hits,
    outs,
    strikePct,
    whiffPct,
  };
}
