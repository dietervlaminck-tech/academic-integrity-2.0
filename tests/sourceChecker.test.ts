import { describe, expect, it } from "vitest";
import {
  evaluateSources,
  isSourceCorrect,
  SOURCE_CATEGORIES,
  SOURCE_GATE_CODE,
  SOURCE_PASS_THRESHOLD,
  SOURCE_TOTAL,
  sourceItems,
  type SourceCategory,
} from "../src/game/sourceChecker";

function correctAnswers(): Record<string, SourceCategory> {
  const a: Record<string, SourceCategory> = {};
  for (const item of sourceItems) a[item.id] = item.category;
  return a;
}

describe("source data", () => {
  it("has five references and four categories, and the gate code CONTEXT", () => {
    expect(sourceItems).toHaveLength(5);
    expect(SOURCE_TOTAL).toBe(5);
    expect(SOURCE_PASS_THRESHOLD).toBe(4);
    expect(SOURCE_GATE_CODE).toBe("CONTEXT");
    expect(SOURCE_CATEGORIES).toHaveLength(4);
    for (const item of sourceItems) {
      expect(SOURCE_CATEGORIES).toContain(item.category);
    }
  });
});

describe("evaluateSources win condition", () => {
  it("passes and reveals CONTEXT with all five correct", () => {
    const r = evaluateSources(correctAnswers());
    expect(r.correct).toBe(5);
    expect(r.passed).toBe(true);
    expect(r.code).toBe("CONTEXT");
  });

  it("passes at exactly four of five", () => {
    const a = correctAnswers();
    // Flip one item to a definitely-wrong category.
    const target = sourceItems[0]!;
    a[target.id] = SOURCE_CATEGORIES.find((c) => c !== target.category)!;
    const r = evaluateSources(a);
    expect(r.correct).toBe(4);
    expect(r.passed).toBe(true);
    expect(r.code).toBe("CONTEXT");
  });

  it("fails below the threshold and hides the code", () => {
    const a = correctAnswers();
    for (const item of sourceItems.slice(0, 2)) {
      a[item.id] = SOURCE_CATEGORIES.find((c) => c !== item.category)!;
    }
    const r = evaluateSources(a);
    expect(r.correct).toBe(3);
    expect(r.passed).toBe(false);
    expect(r.code).toBeNull();
  });

  it("treats unanswered references as incorrect", () => {
    const r = evaluateSources({});
    expect(r.correct).toBe(0);
    expect(r.passed).toBe(false);
  });

  it("isSourceCorrect only matches the true category", () => {
    const item = sourceItems[0]!;
    expect(isSourceCorrect(item, item.category)).toBe(true);
    const wrong = SOURCE_CATEGORIES.find((c) => c !== item.category)!;
    expect(isSourceCorrect(item, wrong)).toBe(false);
  });
});
