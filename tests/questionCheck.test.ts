import { describe, expect, it } from "vitest";
import {
  correctOptionIndex,
  evaluateCheck,
  isOptionCorrect,
  machineRoomCheck,
} from "../src/game/questionCheck";

describe("machineRoomCheck data", () => {
  it("has two questions, each with exactly one correct option", () => {
    expect(machineRoomCheck).toHaveLength(2);
    for (const q of machineRoomCheck) {
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
      expect(q.options.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the correct answer out of a fixed position", () => {
    const positions = machineRoomCheck.map(correctOptionIndex);
    expect(new Set(positions).size).toBeGreaterThan(1);
  });
});

describe("evaluateCheck", () => {
  const allCorrect = (): Record<string, number> => {
    const a: Record<string, number> = {};
    for (const q of machineRoomCheck) a[q.id] = correctOptionIndex(q);
    return a;
  };

  it("scores both-correct as allCorrect", () => {
    const r = evaluateCheck(allCorrect());
    expect(r).toEqual({ correct: 2, total: 2, allCorrect: true });
  });

  it("counts a wrong answer and unanswered questions as incorrect", () => {
    const a = allCorrect();
    const q0 = machineRoomCheck[0]!;
    a[q0.id] = (correctOptionIndex(q0) + 1) % q0.options.length;
    const r = evaluateCheck(a);
    expect(r.correct).toBe(1);
    expect(r.allCorrect).toBe(false);

    expect(evaluateCheck({})).toEqual({ correct: 0, total: 2, allCorrect: false });
  });

  it("isOptionCorrect matches correctOptionIndex", () => {
    for (const q of machineRoomCheck) {
      const idx = correctOptionIndex(q);
      expect(isOptionCorrect(q, idx)).toBe(true);
      expect(isOptionCorrect(q, (idx + 1) % q.options.length)).toBe(false);
    }
  });
});
