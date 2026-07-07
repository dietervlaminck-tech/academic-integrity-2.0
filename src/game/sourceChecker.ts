// Pure logic for the Room 3 SourceChecker puzzle.
//
// The player classifies each of five references as verifiable / fabricated /
// publisher-as-author / bare-domain. Four or more correct reveals the gate code CONTEXT.
// Reference text, the correct category and the justification tooltips all come verbatim
// from content/puzzles.ts.

import {
  gateCodes,
  sourceItems,
  type SourceCategory,
  type SourceItem,
} from "../content/puzzles";

export { sourceItems };
export type { SourceCategory, SourceItem };

export const SOURCE_CATEGORIES: SourceCategory[] = [
  "verifiable",
  "fabricated",
  "publisher-as-author",
  "bare-domain",
];

export const SOURCE_TOTAL = sourceItems.length;
export const SOURCE_PASS_THRESHOLD = 4;
export const SOURCE_GATE_CODE = gateCodes.study;

export function isSourceCorrect(item: SourceItem, category: SourceCategory): boolean {
  return item.category === category;
}

export type SourceResult = {
  correct: number;
  total: number;
  passed: boolean;
  /** The gate code, revealed only when passed; otherwise null. */
  code: string | null;
};

/** Evaluate classifications keyed by source id. Unanswered items count as incorrect. */
export function evaluateSources(
  answers: Record<string, SourceCategory>,
  items: SourceItem[] = sourceItems,
): SourceResult {
  let correct = 0;
  for (const item of items) {
    const picked = answers[item.id];
    if (picked !== undefined && isSourceCorrect(item, picked)) correct++;
  }
  const passed = correct >= SOURCE_PASS_THRESHOLD;
  return {
    correct,
    total: items.length,
    passed,
    code: passed ? SOURCE_GATE_CODE : null,
  };
}
