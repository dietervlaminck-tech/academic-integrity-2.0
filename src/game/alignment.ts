// Pure logic for the Room 4 AlignmentBuilder puzzle.
//
// The player assembles three constructive-alignment chains: each outcome needs the
// activity that rehearses it and the assessment that checks it. Misaligned cards snap
// back with an explanation (distractor feedback, or a generic Bloom-level mismatch in the
// UI). Completing all three chains reveals the gate code ALIGNMENT. All card text,
// rationales and distractor feedback come verbatim from content/puzzles.ts.

import {
  alignmentCards,
  alignmentChains,
  alignmentDistractorFeedback,
  gateCodes,
  type AlignmentCard,
  type AlignmentChain,
} from "../content/puzzles";

export { alignmentCards, alignmentChains, alignmentDistractorFeedback };
export type { AlignmentCard, AlignmentChain };

export type SlotKind = "activity" | "assessment";

export const outcomeCards = alignmentCards.filter((c) => c.kind === "outcome");
export const activityCards = alignmentCards.filter((c) => c.kind === "activity");
export const assessmentCards = alignmentCards.filter((c) => c.kind === "assessment");

export const ALIGNMENT_GATE_CODE = gateCodes.workshop;

export function cardById(id: string): AlignmentCard | undefined {
  return alignmentCards.find((c) => c.id === id);
}

export function chainByOutcome(outcomeId: string): AlignmentChain | undefined {
  return alignmentChains.find((c) => c.outcome === outcomeId);
}

export function correctCardId(chain: AlignmentChain, kind: SlotKind): string {
  return kind === "activity" ? chain.activity : chain.assessment;
}

export function isCorrectPlacement(
  chain: AlignmentChain,
  kind: SlotKind,
  cardId: string,
): boolean {
  return correctCardId(chain, kind) === cardId;
}

export function distractorFeedback(cardId: string): string | undefined {
  return alignmentDistractorFeedback[cardId];
}

/** Placed (correct) cards, keyed by outcome id. Only correct placements are ever stored. */
export type Placements = Record<string, { activity?: string; assessment?: string }>;

export function chainComplete(chain: AlignmentChain, placements: Placements): boolean {
  const p = placements[chain.outcome];
  return !!p && p.activity === chain.activity && p.assessment === chain.assessment;
}

export type AlignmentResult = {
  completed: number;
  total: number;
  passed: boolean;
  /** The gate code, revealed only when all chains are aligned; otherwise null. */
  code: string | null;
};

export function evaluateAlignment(
  placements: Placements,
  chains: AlignmentChain[] = alignmentChains,
): AlignmentResult {
  let completed = 0;
  for (const chain of chains) if (chainComplete(chain, placements)) completed++;
  const passed = completed === chains.length;
  return {
    completed,
    total: chains.length,
    passed,
    code: passed ? ALIGNMENT_GATE_CODE : null,
  };
}
