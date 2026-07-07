// Progress state machine for The Ghostwriter of Nyenrode Castle.
//
// Rooms advance START -> LIBRARY -> MACHINE_ROOM -> STUDY -> WORKSHOP -> DOOR -> ESCAPED.
// A room's gate is cleared by entering the correct uppercase code (checked exactly,
// case-sensitively). Clearing a gate unlocks the next room. All state lives in
// localStorage; nothing leaves the browser (privacy by design).
//
// This module is intentionally pure and side-effect free apart from the clearly
// separated persistence helpers at the bottom, so the machine is easy to unit test.

import { gateCodes } from "../content/puzzles";

export const ROOMS = [
  "START",
  "LIBRARY",
  "MACHINE_ROOM",
  "STUDY",
  "WORKSHOP",
  "DOOR",
  "ESCAPED",
] as const;

export type Room = (typeof ROOMS)[number];

/** The gate code that clears a room and unlocks the next one. START and ESCAPED have none. */
export const GATE_CODE: Partial<Record<Room, string>> = {
  LIBRARY: gateCodes.library,
  MACHINE_ROOM: gateCodes.machineRoom,
  STUDY: gateCodes.study,
  WORKSHOP: gateCodes.workshop,
  DOOR: gateCodes.door,
};

export const STORAGE_KEY = "ghostwriter.progress.v1";
const STATE_VERSION = 1 as const;

export type ProgressState = {
  version: typeof STATE_VERSION;
  /** Highest room the player has unlocked (can navigate up to and including this). */
  furthest: Room;
  /** Room the player is currently viewing (for resume-on-reload). */
  current: Room;
  /** ISO timestamp for each room whose gate has been cleared. */
  clearedAt: Partial<Record<Room, string>>;
  /** Player-chosen display name (used only for the local certificate). */
  playerName: string;
  /** Room 5 one-sentence AI-integrity charter (shown on the certificate). */
  charter: string;
};

export function roomIndex(room: Room): number {
  return ROOMS.indexOf(room);
}

export function nextRoom(room: Room): Room | null {
  const i = roomIndex(room);
  return i >= 0 && i < ROOMS.length - 1 ? (ROOMS[i + 1] as Room) : null;
}

export function initialState(): ProgressState {
  return {
    version: STATE_VERSION,
    furthest: "START",
    current: "START",
    clearedAt: {},
    playerName: "",
    charter: "",
  };
}

/** A room is reachable when it is at or before the furthest unlocked room. */
export function isUnlocked(state: ProgressState, room: Room): boolean {
  return roomIndex(room) <= roomIndex(state.furthest);
}

export function isCleared(state: ProgressState, room: Room): boolean {
  return Boolean(state.clearedAt[room]);
}

export function gateCodeFor(room: Room): string | null {
  return GATE_CODE[room] ?? null;
}

/**
 * Strict, case-sensitive gate check. The stored codes are uppercase; only an exact
 * match opens the gate. Returns false for rooms that have no gate.
 */
export function checkGate(room: Room, input: string): boolean {
  const code = gateCodeFor(room);
  return code !== null && input === code;
}

function withUnlockedThrough(state: ProgressState, room: Room): Room {
  return roomIndex(room) > roomIndex(state.furthest) ? room : state.furthest;
}

/** Leave START and unlock the Library. Records the player's name for the certificate. */
export function startCourse(
  state: ProgressState,
  playerName: string,
  now: string = new Date().toISOString(),
): ProgressState {
  const unlocked = withUnlockedThrough(state, "LIBRARY");
  return {
    ...state,
    playerName: playerName.trim(),
    clearedAt: { ...state.clearedAt, START: state.clearedAt.START ?? now },
    furthest: unlocked,
    current: "LIBRARY",
  };
}

export type GateResult = { ok: boolean; state: ProgressState };

/**
 * Attempt to clear `room`'s gate with `input`. On success the room is marked cleared,
 * the next room is unlocked, and the player is moved into it. On failure the state is
 * returned unchanged with ok=false.
 */
export function submitGate(
  state: ProgressState,
  room: Room,
  input: string,
  now: string = new Date().toISOString(),
): GateResult {
  if (!isUnlocked(state, room)) return { ok: false, state };
  if (!checkGate(room, input)) return { ok: false, state };

  const next = nextRoom(room);
  const clearedAt = { ...state.clearedAt, [room]: state.clearedAt[room] ?? now };
  const furthest = next ? withUnlockedThrough(state, next) : state.furthest;
  return {
    ok: true,
    state: { ...state, clearedAt, furthest, current: next ?? room },
  };
}

/** Move the player to a room, but only if it is unlocked. */
export function navigateTo(state: ProgressState, room: Room): ProgressState {
  return isUnlocked(state, room) ? { ...state, current: room } : state;
}

export function setPlayerName(state: ProgressState, playerName: string): ProgressState {
  return { ...state, playerName };
}

export function setCharter(state: ProgressState, charter: string): ProgressState {
  return { ...state, charter };
}

/**
 * Reset a single room: clears its completion and every room after it, and rewinds the
 * furthest-unlocked marker back to that room. START cannot be reset below itself.
 */
export function resetRoom(state: ProgressState, room: Room): ProgressState {
  const from = Math.max(roomIndex(room), roomIndex("LIBRARY"));
  const clearedAt: Partial<Record<Room, string>> = {};
  for (const key of Object.keys(state.clearedAt) as Room[]) {
    if (roomIndex(key) < from) clearedAt[key] = state.clearedAt[key];
  }
  const rewound = ROOMS[from] as Room;
  const furthest = roomIndex(state.furthest) >= from ? rewound : state.furthest;
  const current = roomIndex(state.current) > roomIndex(furthest) ? furthest : state.current;
  return { ...state, clearedAt, furthest, current };
}

export function resetAll(): ProgressState {
  return initialState();
}

// ---------- Certificate completion code ----------

/** 32-bit FNV-1a hash; deterministic across runs and platforms. */
export function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // 32-bit FNV prime multiply, kept in unsigned range.
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Deterministic completion code for the Canvas wall-of-fame:
 * `NYC-{hash(playerName + date) mod 10000}`, zero-padded to four digits.
 */
export function completionCode(playerName: string, date: string): string {
  const n = fnv1a(`${playerName}|${date}`) % 10000;
  return `NYC-${String(n).padStart(4, "0")}`;
}

// ---------- Persistence (the only impure part) ----------

function getStorage(): Storage | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

function isRoom(value: unknown): value is Room {
  return typeof value === "string" && (ROOMS as readonly string[]).includes(value);
}

/** Validate and normalise a parsed blob into a safe ProgressState. */
export function coerceState(raw: unknown): ProgressState {
  const base = initialState();
  if (!raw || typeof raw !== "object") return base;
  const obj = raw as Record<string, unknown>;

  const furthest = isRoom(obj.furthest) ? obj.furthest : base.furthest;
  let current = isRoom(obj.current) ? obj.current : base.current;
  // Never resume into a locked room.
  if (roomIndex(current) > roomIndex(furthest)) current = furthest;

  const clearedAt: Partial<Record<Room, string>> = {};
  if (obj.clearedAt && typeof obj.clearedAt === "object") {
    for (const [key, val] of Object.entries(obj.clearedAt as Record<string, unknown>)) {
      if (isRoom(key) && typeof val === "string") clearedAt[key] = val;
    }
  }

  return {
    version: STATE_VERSION,
    furthest,
    current,
    clearedAt,
    playerName: typeof obj.playerName === "string" ? obj.playerName : base.playerName,
    charter: typeof obj.charter === "string" ? obj.charter : base.charter,
  };
}

export function loadProgress(): ProgressState {
  const storage = getStorage();
  if (!storage) return initialState();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    return coerceState(JSON.parse(raw));
  } catch {
    return initialState();
  }
}

export function saveProgress(state: ProgressState): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: fail silently, the game still works in-session.
  }
}

export function clearProgress(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
