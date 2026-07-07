import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithI18n } from "./util";
import { AlignmentBuilder } from "../src/components/AlignmentBuilder";
import { alignmentChains, alignmentDistractorFeedback } from "../src/game/alignment";
import { en } from "../src/i18n/en";
import { fmt } from "../src/i18n";

const slotLabel = (kind: string, num: number) =>
  fmt(en.alignment.slotLabel, { kind, num });

describe("AlignmentBuilder", () => {
  it("aligns all three chains and reveals ALIGNMENT", async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    renderWithI18n(<AlignmentBuilder onSolved={onSolved} />);

    for (let i = 0; i < alignmentChains.length; i++) {
      const chain = alignmentChains[i]!;
      const num = i + 1;
      await user.selectOptions(
        screen.getByLabelText(slotLabel(en.alignment.activity, num)),
        chain.activity,
      );
      await user.selectOptions(
        screen.getByLabelText(slotLabel(en.alignment.assessment, num)),
        chain.assessment,
      );
    }

    expect(
      screen.getByText(fmt(en.alignment.passCallout, { code: "ALIGNMENT" })),
    ).toBeInTheDocument();
    expect(onSolved).toHaveBeenCalledWith("ALIGNMENT");
  });

  it("snaps back misaligned cards with an explanation and does not solve", async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    renderWithI18n(<AlignmentBuilder onSolved={onSolved} />);

    const activity1 = () => screen.getByLabelText(slotLabel(en.alignment.activity, 1));

    // A distractor snaps back with its own feedback.
    await user.selectOptions(activity1(), "da1");
    expect(screen.getByText(alignmentDistractorFeedback.da1!)).toBeInTheDocument();

    // Another chain's card is misaligned here: generic Bloom-level explanation.
    await user.selectOptions(activity1(), alignmentChains[1]!.activity);
    expect(screen.getByText(en.alignment.misaligned)).toBeInTheDocument();

    // Still solvable afterwards: the slot did not lock on a wrong pick.
    expect(activity1()).toBeInTheDocument();
    expect(onSolved).not.toHaveBeenCalled();
  });
});
