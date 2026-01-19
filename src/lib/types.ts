export type PitchType = "fastball" | "curveball" | "slider" | "changeup";

export type PitchResult =
  | "ball"
  | "strike"
  | "whiff"
  | "in_play"
  | "hit"
  | "out";

export type AtBatResult = "out" | "hit" | "hr" | "so" | "rbi";

export type PitchEvent = {
  id: string;
  gameId: string;
  pitcherId: string;
  inning: number;
  result: PitchResult;

  pitchType: PitchType;
  batterSlot: number; // 1–9

  createdAt: number;
};

export type AtBatEvent = {
  id: string;
  gameId: string;
  batterSlot: number; // 1–9
  result: AtBatResult; // out | hit | hr | so | rbi
  pitches: number;     // pitches seen in the AB (0 for rbi-only)
  createdAt: number;
};

export type Pitcher = {
  id: string;
  name: string;
  throws?: "R" | "L";
  number?: string;
};

export type OpponentBatter = {
  slot: number; // 1–9
  name?: string; // optional
};

export type Game = {
  id: string;
  opponent: string;
  dateISO: string;
  createdAt: number;
  activePitcherId?: string;
  inning: number;

  lineup?: OpponentBatter[];
  activeBatterSlot?: number;
};
