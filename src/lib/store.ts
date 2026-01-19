"use client";

import type {
  Game,
  Pitcher,
  PitchEvent,
  PitchResult,
  PitchType,
  AtBatEvent,
  AtBatResult,
} from "./types";

const KEY = "pitch-guru-store-v1";

type Store = {
  games: Game[];
  pitchers: Pitcher[];
  pitches: PitchEvent[];
  atBats: AtBatEvent[]; // ✅ NEW
};

const empty: Store = { games: [], pitchers: [], pitches: [], atBats: [] };

function load(): Store {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Store>) : {};
    return {
      games: parsed.games ?? [],
      pitchers: parsed.pitchers ?? [],
      pitches: parsed.pitches ?? [],
      atBats: (parsed as any).atBats ?? [],
    };
  } catch {
    return empty;
  }
}

function save(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function getStore(): Store {
  return load();
}

export function createPitcher(name: string, throws?: "R" | "L", number?: string) {
  const store = load();
  const pitcher: Pitcher = { id: uid("p"), name, throws, number };
  store.pitchers.unshift(pitcher);
  save(store);
  return pitcher;
}

export function createGame(opponent: string, dateISO: string) {
  const store = load();

  const lineup = Array.from({ length: 9 }, (_, i) => ({
    slot: i + 1,
    name: "",
  }));

  const game: Game = {
    id: uid("g"),
    opponent,
    dateISO,
    createdAt: Date.now(),
    inning: 1,
    lineup,
    activeBatterSlot: 1,
  };

  store.games.unshift(game);
  save(store);
  return game;
}

export function setActivePitcher(gameId: string, pitcherId: string) {
  const store = load();
  store.games = store.games.map((g) =>
    g.id === gameId ? { ...g, activePitcherId: pitcherId } : g
  );
  save(store);
}

export function setInning(gameId: string, inning: number) {
  const store = load();
  store.games = store.games.map((g) => (g.id === gameId ? { ...g, inning } : g));
  save(store);
}

export function setActiveBatter(gameId: string, batterSlot: number) {
  const store = load();
  store.games = store.games.map((g) =>
    g.id === gameId ? { ...g, activeBatterSlot: batterSlot } : g
  );
  save(store);
}

export function updateLineupName(gameId: string, slot: number, name: string) {
  const store = load();
  store.games = store.games.map((g) => {
    if (g.id !== gameId) return g;

    const existing =
      g.lineup ??
      Array.from({ length: 9 }, (_, i) => ({ slot: i + 1, name: "" }));

    const lineup = existing.map((b) => (b.slot === slot ? { ...b, name } : b));

    return { ...g, lineup };
  });

  save(store);
}

export function addPitch(params: {
  gameId: string;
  pitcherId: string;
  inning: number;
  result: PitchResult;
  pitchType: PitchType;
  batterSlot: number;
}) {
  const store = load();
  const pitch: PitchEvent = {
    id: uid("pe"),
    createdAt: Date.now(),
    ...params,
  };
  store.pitches.push(pitch);
  save(store);
  return pitch;
}

export function undoLastPitch(gameId: string) {
  const store = load();
  const idx = [...store.pitches].reverse().findIndex((p) => p.gameId === gameId);
  if (idx === -1) return null;

  const forwardIndex = store.pitches.length - 1 - idx;
  const removed = store.pitches.splice(forwardIndex, 1)[0];
  save(store);
  return removed;
}

/**
 * ✅ NEW: Add an at-bat event for a hitter.
 * - For out/hit/hr/so: automatically records pitches seen since last AB-ending for that hitter.
 * - For rbi: records pitches = 0 (just adds RBI to hitter total).
 */
export function addAtBat(params: {
  gameId: string;
  batterSlot: number;
  result: AtBatResult;
}) {
  const store = load();
  const now = Date.now();

  let pitchesSeen = 0;

  if (params.result !== "rbi") {
    // Find last AB-ending time for this hitter
    const lastEnd = [...store.atBats]
      .filter(
        (a) =>
          a.gameId === params.gameId &&
          a.batterSlot === params.batterSlot &&
          a.result !== "rbi"
      )
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    const since = lastEnd?.createdAt ?? 0;

    // Count pitch-like events since that time for this batter (exclude "out" as a pitch by your rule)
    pitchesSeen = store.pitches.filter(
      (p) =>
        p.gameId === params.gameId &&
        p.batterSlot === params.batterSlot &&
        p.createdAt > since &&
        p.result !== "out"
    ).length;
  }

  const ab: AtBatEvent = {
    id: uid("ab"),
    gameId: params.gameId,
    batterSlot: params.batterSlot,
    result: params.result,
    pitches: params.result === "rbi" ? 0 : pitchesSeen,
    createdAt: now,
  };

  store.atBats.push(ab);
  save(store);
  return ab;
}

export function undoLastAtBat(gameId: string) {
  const store = load();
  const idx = [...store.atBats].reverse().findIndex((a) => a.gameId === gameId);
  if (idx === -1) return null;

  const forwardIndex = store.atBats.length - 1 - idx;
  const removed = store.atBats.splice(forwardIndex, 1)[0];
  save(store);
  return removed;
}

export function getGameData(gameId: string) {
  const store = load();
  const game = store.games.find((g) => g.id === gameId) || null;
  const pitches = store.pitches.filter((p) => p.gameId === gameId);
  const atBats = store.atBats.filter((a) => a.gameId === gameId);
  return { ...store, game, pitches, atBats };
}
