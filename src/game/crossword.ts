// Pure logic for the Room 1 crossword.
//
// The native crossword is the Library's primary (and only in-app) puzzle; the identical
// Interacty version is offered solely as an optional external link in the room's
// "Optional extras" aside (Interacty refuses framing, so it is never embedded). This
// solver uses the six clues from content/puzzles.ts and is fully keyboard-accessible.
// The answer to clue 4 is the gate code APA.

import { crosswordClues, gateCodes } from "../content/puzzles";

export type Direction = "across" | "down";

export type CrosswordEntry = {
  num: number;
  clue: string;
  answer: string; // uppercase
  direction: Direction;
};

// Horizontal clues run across, vertical clues run down. Sort by clue number so the list
// reads 1..6 regardless of source order.
export const crosswordEntries: CrosswordEntry[] = [
  ...crosswordClues.horizontal.map((c) => ({ ...c, direction: "across" as const })),
  ...crosswordClues.vertical.map((c) => ({ ...c, direction: "down" as const })),
].sort((a, b) => a.num - b.num);

/** Clue whose answer is the Library gate code (APA). */
export const GATE_CLUE_NUM = 4;

export function normalizeAnswer(input: string): string {
  return input.trim().toUpperCase();
}

export function isEntrySolved(entry: CrosswordEntry, input: string): boolean {
  return normalizeAnswer(input) === entry.answer;
}

export function entryByNum(num: number): CrosswordEntry | undefined {
  return crosswordEntries.find((e) => e.num === num);
}

export type CrosswordResult = {
  solved: number;
  total: number;
  /** True once the gate clue (4 -> APA) is solved. */
  gateSolved: boolean;
  /** The gate code, revealed only once the gate clue is solved. */
  code: string | null;
};

/** Evaluate answers keyed by clue number. Unanswered/incorrect clues do not count. */
export function evaluateCrossword(
  answers: Record<number, string>,
  entries: CrosswordEntry[] = crosswordEntries,
): CrosswordResult {
  let solved = 0;
  let gateSolved = false;
  for (const entry of entries) {
    const input = answers[entry.num];
    if (input !== undefined && isEntrySolved(entry, input)) {
      solved++;
      if (entry.num === GATE_CLUE_NUM) gateSolved = true;
    }
  }
  return {
    solved,
    total: entries.length,
    gateSolved,
    code: gateSolved ? gateCodes.library : null,
  };
}
