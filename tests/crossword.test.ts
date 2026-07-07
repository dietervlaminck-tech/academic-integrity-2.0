import { describe, expect, it } from "vitest";
import {
  crosswordEntries,
  entryByNum,
  evaluateCrossword,
  GATE_CLUE_NUM,
  isEntrySolved,
  normalizeAnswer,
} from "../src/game/crossword";

/** Solve every clue correctly. */
function allAnswers(): Record<number, string> {
  const a: Record<number, string> = {};
  for (const e of crosswordEntries) a[e.num] = e.answer;
  return a;
}

describe("crossword entries", () => {
  it("has six clues sorted by number, across and down", () => {
    expect(crosswordEntries).toHaveLength(6);
    const nums = crosswordEntries.map((e) => e.num);
    expect(nums).toEqual([1, 2, 3, 4, 5, 6]);
    expect(entryByNum(1)?.direction).toBe("down");
    expect(entryByNum(2)?.direction).toBe("across");
  });

  it("clue 4 is the gate code APA", () => {
    expect(GATE_CLUE_NUM).toBe(4);
    expect(entryByNum(GATE_CLUE_NUM)?.answer).toBe("APA");
  });
});

describe("isEntrySolved", () => {
  const apa = entryByNum(4)!;
  it("accepts the answer case-insensitively and trimmed", () => {
    expect(isEntrySolved(apa, "APA")).toBe(true);
    expect(isEntrySolved(apa, "apa")).toBe(true);
    expect(isEntrySolved(apa, "  ApA  ")).toBe(true);
    expect(isEntrySolved(apa, "AP")).toBe(false);
    expect(normalizeAnswer(" apa ")).toBe("APA");
  });
});

describe("evaluateCrossword", () => {
  it("reveals the code only once clue 4 is solved", () => {
    expect(evaluateCrossword({})).toEqual({
      solved: 0,
      total: 6,
      gateSolved: false,
      code: null,
    });

    const onlyGate = evaluateCrossword({ 4: "APA" });
    expect(onlyGate.gateSolved).toBe(true);
    expect(onlyGate.code).toBe("APA");
    expect(onlyGate.solved).toBe(1);

    const all = evaluateCrossword(allAnswers());
    expect(all.solved).toBe(6);
    expect(all.gateSolved).toBe(true);
    expect(all.code).toBe("APA");
  });

  it("counts other solved clues without revealing the code", () => {
    const r = evaluateCrossword({ 1: entryByNum(1)!.answer, 2: entryByNum(2)!.answer });
    expect(r.solved).toBe(2);
    expect(r.gateSolved).toBe(false);
    expect(r.code).toBeNull();
  });
});
