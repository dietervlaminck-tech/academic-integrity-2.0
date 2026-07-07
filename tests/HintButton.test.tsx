import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithI18n } from "./util";
import { HintButton } from "../src/components/HintButton";
import { fmt } from "../src/i18n";
import { en } from "../src/i18n/en";

const HINTS: readonly [string, string, string] = [
  "First nudge toward the idea",
  "Second, more specific nudge",
  "The code is REVEALED",
];

const revealName = (n: number) => fmt(en.hint.reveal, { n, total: HINTS.length });
// The answer badge is rendered as "<badge>: "; anchor at the start so it does not match
// the word "answer" inside the intro sentence.
const answerBadge = new RegExp(`^${en.hint.answerBadge}`);

describe("HintButton (progressive hints, answer only at level 3)", () => {
  it("shows nothing until opened", () => {
    renderWithI18n(<HintButton hints={HINTS} />);
    expect(screen.queryByText(HINTS[0])).not.toBeInTheDocument();
    expect(screen.queryByText(HINTS[2])).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: en.hint.button })).toBeInTheDocument();
  });

  it("reveals one hint per click and only exposes the answer on the third reveal", async () => {
    const user = userEvent.setup();
    renderWithI18n(<HintButton hints={HINTS} />);

    await user.click(screen.getByRole("button", { name: en.hint.button }));
    // Opened but nothing revealed yet.
    expect(screen.queryByText(HINTS[0])).not.toBeInTheDocument();

    // Reveal 1: first hint only, answer still hidden.
    await user.click(screen.getByRole("button", { name: revealName(1) }));
    expect(screen.getByText(HINTS[0])).toBeInTheDocument();
    expect(screen.queryByText(HINTS[2])).not.toBeInTheDocument();

    // Reveal 2: second hint, answer still hidden. The answer cannot be reached in one action.
    await user.click(screen.getByRole("button", { name: revealName(2) }));
    expect(screen.getByText(HINTS[1])).toBeInTheDocument();
    expect(screen.queryByText(HINTS[2])).not.toBeInTheDocument();
    expect(screen.queryByText(answerBadge)).not.toBeInTheDocument();

    // Reveal 3: the answer and its badge appear, and no further reveal is offered.
    await user.click(screen.getByRole("button", { name: revealName(3) }));
    expect(screen.getByText(HINTS[2])).toBeInTheDocument();
    expect(screen.getByText(answerBadge)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Show hint/ })).not.toBeInTheDocument();
  });
});
