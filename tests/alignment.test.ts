import { describe, expect, it } from "vitest";
import {
  activityCards,
  ALIGNMENT_GATE_CODE,
  alignmentChains,
  assessmentCards,
  chainComplete,
  correctCardId,
  distractorFeedback,
  evaluateAlignment,
  isCorrectPlacement,
  outcomeCards,
  type Placements,
} from "../src/game/alignment";

/** Placements for all three chains solved correctly. */
function allAligned(): Placements {
  const p: Placements = {};
  for (const c of alignmentChains) p[c.outcome] = { activity: c.activity, assessment: c.assessment };
  return p;
}

describe("alignment data", () => {
  it("has three chains, three outcomes and four of each other kind (incl. distractors)", () => {
    expect(alignmentChains).toHaveLength(3);
    expect(outcomeCards).toHaveLength(3);
    expect(activityCards).toHaveLength(4); // a1..a3 + da1 distractor
    expect(assessmentCards).toHaveLength(4); // x1..x3 + dx1 distractor
    expect(ALIGNMENT_GATE_CODE).toBe("ALIGNMENT");
  });

  it("exposes distractor feedback only for the distractors", () => {
    expect(distractorFeedback("da1")).toBeTruthy();
    expect(distractorFeedback("dx1")).toBeTruthy();
    expect(distractorFeedback("a1")).toBeUndefined();
  });
});

describe("placement checks", () => {
  const chain = alignmentChains[0]!;
  it("only accepts the aligned card for each slot", () => {
    expect(correctCardId(chain, "activity")).toBe(chain.activity);
    expect(isCorrectPlacement(chain, "activity", chain.activity)).toBe(true);
    expect(isCorrectPlacement(chain, "activity", "da1")).toBe(false);
    // A card that belongs to another chain is also misaligned here.
    const other = alignmentChains[1]!;
    expect(isCorrectPlacement(chain, "assessment", other.assessment)).toBe(false);
  });
});

describe("evaluateAlignment win condition", () => {
  it("reveals ALIGNMENT only when all three chains are complete", () => {
    expect(evaluateAlignment({})).toMatchObject({ completed: 0, passed: false, code: null });

    const partial: Placements = {
      [alignmentChains[0]!.outcome]: {
        activity: alignmentChains[0]!.activity,
        assessment: alignmentChains[0]!.assessment,
      },
    };
    expect(evaluateAlignment(partial)).toMatchObject({ completed: 1, passed: false, code: null });

    const all = evaluateAlignment(allAligned());
    expect(all.completed).toBe(3);
    expect(all.passed).toBe(true);
    expect(all.code).toBe("ALIGNMENT");
  });

  it("does not count a chain with only one slot filled", () => {
    const chain = alignmentChains[0]!;
    const half: Placements = { [chain.outcome]: { activity: chain.activity } };
    expect(chainComplete(chain, half)).toBe(false);
    expect(evaluateAlignment(half).completed).toBe(0);
  });
});
