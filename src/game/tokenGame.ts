// Pure logic for the Room 2 TokenPredictor mini-game.
//
// Rule: the "correct" pick each round is the candidate with the highest hidden
// probability (this holds for the rhyme-trap round too, where the pattern-machine
// answer "vork" is deliberately the most probable). Win condition: at least 5 of the
// 6 rounds correct reveals the gate code TOKEN.

import {
  gateCodes,
  tokenRounds,
  type TokenCandidate,
  type TokenRound,
} from "../content/puzzles";

export { tokenRounds };
export type { TokenCandidate, TokenRound };

export const TOKEN_ROUND_COUNT = tokenRounds.length;
export const TOKEN_PASS_THRESHOLD = 5;
export const TOKEN_GATE_CODE = gateCodes.machineRoom;

/** Round id whose reveal shows the two "model voices" side by side. */
export const RHYME_ROUND_ID = "r6-rhyme-trap";

/** Index of the highest-probability candidate; on a tie the earliest one wins. */
export function correctIndex(round: TokenRound): number {
  let best = 0;
  for (let i = 1; i < round.candidates.length; i++) {
    const cand = round.candidates[i];
    const bestCand = round.candidates[best];
    if (cand && bestCand && cand.probability > bestCand.probability) best = i;
  }
  return best;
}

export function isCorrectPick(round: TokenRound, pickedIndex: number): boolean {
  return pickedIndex === correctIndex(round);
}

/** Candidates sorted by probability, descending, for the reveal bar chart. */
export function candidatesByProbability(round: TokenRound): TokenCandidate[] {
  return [...round.candidates].sort((a, b) => b.probability - a.probability);
}

export type TokenGameResult = {
  correct: number;
  total: number;
  passed: boolean;
  /** The gate code, revealed only when the game is passed; otherwise null. */
  code: string | null;
};

/**
 * Evaluate a set of answers keyed by round id. Unanswered rounds count as incorrect.
 * `passed` requires at least TOKEN_PASS_THRESHOLD correct across all rounds.
 */
export function evaluateGame(
  answers: Record<string, number>,
  rounds: TokenRound[] = tokenRounds,
): TokenGameResult {
  let correct = 0;
  for (const round of rounds) {
    const picked = answers[round.id];
    if (picked !== undefined && isCorrectPick(round, picked)) correct++;
  }
  const passed = correct >= TOKEN_PASS_THRESHOLD;
  return {
    correct,
    total: rounds.length,
    passed,
    code: passed ? TOKEN_GATE_CODE : null,
  };
}
