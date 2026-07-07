import { describe, expect, it } from "vitest";
import {
  checkGate,
  clearProgress,
  coerceState,
  completionCode,
  fnv1a,
  gateCodeFor,
  initialState,
  isCleared,
  isUnlocked,
  loadProgress,
  navigateTo,
  nextRoom,
  resetAll,
  resetRoom,
  ROOMS,
  roomIndex,
  saveProgress,
  startCourse,
  submitGate,
  type ProgressState,
  type Room,
} from "../src/state/progress";

const NOW = "2026-07-07T10:00:00.000Z";

/** Drive the machine from START through to ESCAPED with the real codes. */
function playThrough(): ProgressState {
  let s = initialState();
  s = startCourse(s, "Dieter", NOW);
  const steps: Array<[Room, string]> = [
    ["LIBRARY", "APA"],
    ["MACHINE_ROOM", "TOKEN"],
    ["STUDY", "CONTEXT"],
    ["WORKSHOP", "ALIGNMENT"],
    ["DOOR", "INTEGRITY"],
  ];
  for (const [room, code] of steps) {
    const r = submitGate(s, room, code, NOW);
    expect(r.ok).toBe(true);
    s = r.state;
  }
  return s;
}

describe("room ordering", () => {
  it("has the blueprint order", () => {
    expect(ROOMS).toEqual([
      "START",
      "LIBRARY",
      "MACHINE_ROOM",
      "STUDY",
      "WORKSHOP",
      "DOOR",
      "ESCAPED",
    ]);
  });

  it("computes next rooms and terminates at ESCAPED", () => {
    expect(nextRoom("START")).toBe("LIBRARY");
    expect(nextRoom("DOOR")).toBe("ESCAPED");
    expect(nextRoom("ESCAPED")).toBeNull();
    expect(roomIndex("MACHINE_ROOM")).toBe(2);
  });
});

describe("gate codes", () => {
  it("maps each room to its uppercase code", () => {
    expect(gateCodeFor("LIBRARY")).toBe("APA");
    expect(gateCodeFor("MACHINE_ROOM")).toBe("TOKEN");
    expect(gateCodeFor("STUDY")).toBe("CONTEXT");
    expect(gateCodeFor("WORKSHOP")).toBe("ALIGNMENT");
    expect(gateCodeFor("DOOR")).toBe("INTEGRITY");
    expect(gateCodeFor("START")).toBeNull();
    expect(gateCodeFor("ESCAPED")).toBeNull();
  });

  it("checks codes exactly and case-sensitively", () => {
    expect(checkGate("MACHINE_ROOM", "TOKEN")).toBe(true);
    expect(checkGate("MACHINE_ROOM", "token")).toBe(false);
    expect(checkGate("MACHINE_ROOM", "Token")).toBe(false);
    expect(checkGate("MACHINE_ROOM", "TOKEN ")).toBe(false);
    expect(checkGate("MACHINE_ROOM", "TOKENS")).toBe(false);
    expect(checkGate("LIBRARY", "APA")).toBe(true);
    expect(checkGate("START", "APA")).toBe(false);
  });
});

describe("startCourse", () => {
  it("unlocks the Library and records the name and start time", () => {
    const s = startCourse(initialState(), "  Dieter  ", NOW);
    expect(s.playerName).toBe("Dieter");
    expect(s.current).toBe("LIBRARY");
    expect(s.furthest).toBe("LIBRARY");
    expect(s.clearedAt.START).toBe(NOW);
    expect(isUnlocked(s, "LIBRARY")).toBe(true);
    expect(isUnlocked(s, "MACHINE_ROOM")).toBe(false);
  });
});

describe("submitGate", () => {
  it("rejects the wrong code and leaves state unchanged", () => {
    const s = startCourse(initialState(), "Dieter", NOW);
    const r = submitGate(s, "LIBRARY", "NOPE", NOW);
    expect(r.ok).toBe(false);
    expect(r.state).toBe(s);
    expect(isCleared(r.state, "LIBRARY")).toBe(false);
  });

  it("rejects a gate for a locked room", () => {
    const s = startCourse(initialState(), "Dieter", NOW);
    // MACHINE_ROOM is not yet unlocked.
    const r = submitGate(s, "MACHINE_ROOM", "TOKEN", NOW);
    expect(r.ok).toBe(false);
    expect(isUnlocked(r.state, "MACHINE_ROOM")).toBe(false);
  });

  it("clears the room, unlocks the next, and moves the player forward", () => {
    const s = startCourse(initialState(), "Dieter", NOW);
    const r = submitGate(s, "LIBRARY", "APA", NOW);
    expect(r.ok).toBe(true);
    expect(isCleared(r.state, "LIBRARY")).toBe(true);
    expect(r.state.clearedAt.LIBRARY).toBe(NOW);
    expect(r.state.furthest).toBe("MACHINE_ROOM");
    expect(r.state.current).toBe("MACHINE_ROOM");
  });

  it("reaches ESCAPED after all five gates", () => {
    const s = playThrough();
    expect(s.furthest).toBe("ESCAPED");
    expect(s.current).toBe("ESCAPED");
    for (const room of ["LIBRARY", "MACHINE_ROOM", "STUDY", "WORKSHOP", "DOOR"] as Room[]) {
      expect(isCleared(s, room)).toBe(true);
    }
  });
});

describe("navigateTo", () => {
  it("allows revisiting unlocked rooms and blocks locked ones", () => {
    const s = playThrough();
    const back = navigateTo(s, "MACHINE_ROOM");
    expect(back.current).toBe("MACHINE_ROOM");

    const fresh = startCourse(initialState(), "Dieter", NOW);
    const blocked = navigateTo(fresh, "DOOR");
    expect(blocked.current).toBe("LIBRARY"); // unchanged
  });
});

describe("resetRoom / resetAll", () => {
  it("rewinds a room and everything after it, clamping current to the reset room", () => {
    const s = playThrough();
    const r = resetRoom(s, "STUDY");
    expect(r.furthest).toBe("STUDY");
    expect(isCleared(r, "MACHINE_ROOM")).toBe(true);
    expect(isCleared(r, "STUDY")).toBe(false);
    expect(isCleared(r, "WORKSHOP")).toBe(false);
    expect(isCleared(r, "DOOR")).toBe(false);
    // current was ahead of the reset room (ESCAPED), so it is pulled back to exactly STUDY.
    expect(r.current).toBe("STUDY");
  });

  it("leaves current and furthest untouched when resetting a room ahead of the player", () => {
    // Player is mid-game at the Machine Room; resetting a later room must not move them
    // forward nor rewind their unlocked frontier below where they already are.
    let s = startCourse(initialState(), "Dieter", NOW);
    s = submitGate(s, "LIBRARY", "APA", NOW).state; // furthest=MACHINE_ROOM, current=MACHINE_ROOM
    const r = resetRoom(s, "WORKSHOP");
    expect(r.current).toBe("MACHINE_ROOM");
    expect(r.furthest).toBe("MACHINE_ROOM");
    expect(isCleared(r, "LIBRARY")).toBe(true);
  });

  it("resetAll returns a fresh state", () => {
    expect(resetAll()).toEqual(initialState());
  });
});

describe("completion code", () => {
  it("is deterministic and correctly formatted", () => {
    const a = completionCode("Dieter", "2026-07-07");
    const b = completionCode("Dieter", "2026-07-07");
    expect(a).toBe(b);
    expect(a).toMatch(/^NYC-\d{4}$/);
  });

  it("changes with the input", () => {
    expect(completionCode("Dieter", "2026-07-07")).not.toBe(
      completionCode("Ada", "2026-07-07"),
    );
    expect(fnv1a("abc")).toBe(fnv1a("abc"));
    expect(fnv1a("abc")).not.toBe(fnv1a("abd"));
  });
});

describe("persistence", () => {
  it("round-trips through localStorage", () => {
    const s = playThrough();
    saveProgress(s);
    const loaded = loadProgress();
    expect(loaded.furthest).toBe("ESCAPED");
    expect(loaded.clearedAt.MACHINE_ROOM).toBe(NOW);
  });

  it("returns a fresh state when storage is empty or corrupt", () => {
    clearProgress();
    expect(loadProgress()).toEqual(initialState());
    localStorage.setItem("ghostwriter.progress.v1", "{not json");
    expect(loadProgress()).toEqual(initialState());
  });

  it("coerces garbage and never resumes into a locked room", () => {
    expect(coerceState(null)).toEqual(initialState());
    expect(coerceState(42)).toEqual(initialState());
    const coerced = coerceState({
      furthest: "LIBRARY",
      current: "DOOR", // ahead of furthest: must be clamped
      clearedAt: { LIBRARY: NOW, BOGUS: NOW },
      playerName: "Dieter",
      charter: "x",
    });
    expect(coerced.current).toBe("LIBRARY");
    expect(coerced.clearedAt.LIBRARY).toBe(NOW);
    expect("BOGUS" in coerced.clearedAt).toBe(false);
  });
});
