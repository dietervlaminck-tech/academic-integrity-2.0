import { describe, expect, it } from "vitest";
import {
  candidatesByProbability,
  correctIndex,
  evaluateGame,
  isCorrectPick,
  RHYME_ROUND_ID,
  TOKEN_GATE_CODE,
  TOKEN_PASS_THRESHOLD,
  TOKEN_ROUND_COUNT,
  tokenRounds,
} from "../src/game/tokenGame";

/** All-correct answer map: each round -> the highest-probability candidate. */
function allCorrect(): Record<string, number> {
  const answers: Record<string, number> = {};
  for (const round of tokenRounds) answers[round.id] = correctIndex(round);
  return answers;
}

describe("token rounds data", () => {
  it("has six rounds and the gate code TOKEN", () => {
    expect(TOKEN_ROUND_COUNT).toBe(6);
    expect(tokenRounds).toHaveLength(6);
    expect(TOKEN_GATE_CODE).toBe("TOKEN");
    expect(TOKEN_PASS_THRESHOLD).toBe(5);
  });

  it("every round's correct answer is its most probable candidate", () => {
    for (const round of tokenRounds) {
      const idx = correctIndex(round);
      const best = round.candidates[idx];
      expect(best).toBeDefined();
      for (const cand of round.candidates) {
        expect(best!.probability).toBeGreaterThanOrEqual(cand.probability);
      }
    }
  });

  it("the rhyme-trap round's most probable answer is the pattern answer 'fork'", () => {
    const rhyme = tokenRounds.find((r) => r.id === RHYME_ROUND_ID);
    expect(rhyme).toBeDefined();
    const best = rhyme!.candidates[correctIndex(rhyme!)];
    expect(best!.text).toContain("fork");
    expect(best!.text).toContain("pattern answer");
  });
});

describe("candidatesByProbability", () => {
  it("sorts descending without losing candidates", () => {
    const round = tokenRounds[0]!;
    const ranked = candidatesByProbability(round);
    expect(ranked).toHaveLength(round.candidates.length);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1]!.probability).toBeGreaterThanOrEqual(ranked[i]!.probability);
    }
  });
});

describe("isCorrectPick", () => {
  it("is true only for the top candidate", () => {
    const round = tokenRounds[0]!;
    const idx = correctIndex(round);
    expect(isCorrectPick(round, idx)).toBe(true);
    expect(isCorrectPick(round, (idx + 1) % round.candidates.length)).toBe(false);
  });
});

describe("evaluateGame win condition", () => {
  it("passes and reveals TOKEN when all six are correct", () => {
    const result = evaluateGame(allCorrect());
    expect(result.correct).toBe(6);
    expect(result.total).toBe(6);
    expect(result.passed).toBe(true);
    expect(result.code).toBe("TOKEN");
  });

  it("passes at exactly five of six", () => {
    const answers = allCorrect();
    // Break exactly one round.
    const target = tokenRounds[0]!;
    answers[target.id] = (correctIndex(target) + 1) % target.candidates.length;
    const result = evaluateGame(answers);
    expect(result.correct).toBe(5);
    expect(result.passed).toBe(true);
    expect(result.code).toBe("TOKEN");
  });

  it("fails below the threshold and hides the code", () => {
    const answers = allCorrect();
    const wrong = [tokenRounds[0]!, tokenRounds[1]!];
    for (const r of wrong) answers[r.id] = (correctIndex(r) + 1) % r.candidates.length;
    const result = evaluateGame(answers);
    expect(result.correct).toBe(4);
    expect(result.passed).toBe(false);
    expect(result.code).toBeNull();
  });

  it("treats unanswered rounds as incorrect", () => {
    const result = evaluateGame({});
    expect(result.correct).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.code).toBeNull();
  });
});
