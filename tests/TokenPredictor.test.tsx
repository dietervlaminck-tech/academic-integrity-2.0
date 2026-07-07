import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithI18n } from "./util";
import { TokenPredictor } from "../src/components/TokenPredictor";
import { en } from "../src/i18n/en";
import { correctIndex, tokenRounds } from "../src/game/tokenGame";

function candidateName(roundIndex: number, candidateIndex: number): string {
  const round = tokenRounds[roundIndex]!;
  return round.candidates[candidateIndex]!.text;
}

async function pick(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(screen.getByRole("button", { name }));
}

async function advance(user: ReturnType<typeof userEvent.setup>, isLast: boolean) {
  const label = isLast ? en.tp.seeResult : en.tp.nextRound;
  await user.click(screen.getByRole("button", { name: label }));
}

describe("TokenPredictor", () => {
  it("reveals the distribution and explanation after a pick", async () => {
    const user = userEvent.setup();
    renderWithI18n(<TokenPredictor />);

    await pick(user, candidateName(0, correctIndex(tokenRounds[0]!)));

    // "Correct" appears both visibly and in the persistent sr-only live region.
    expect(screen.getAllByText(en.tp.correct).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(en.tp.probabilityHeading)).toBeInTheDocument();
    // The round's own explanation copy is shown.
    expect(screen.getByText(/With almost no context/)).toBeInTheDocument();
  });

  it("shows both model voices on the rhyme-trap round", async () => {
    const user = userEvent.setup();
    renderWithI18n(<TokenPredictor />);

    // Answer rounds 1-5 correctly to reach the rhyme trap (round 6).
    for (let i = 0; i < tokenRounds.length; i++) {
      await pick(user, candidateName(i, correctIndex(tokenRounds[i]!)));
      if (i === tokenRounds.length - 1) {
        // On the last round, assert the two voices before finishing.
        expect(screen.getByText(en.tp.voicePattern)).toBeInTheDocument();
        expect(screen.getByText(en.tp.voiceReasoning)).toBeInTheDocument();
      } else {
        await advance(user, false);
      }
    }
  });

  it("passes with all correct and reveals the code TOKEN", async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    renderWithI18n(<TokenPredictor onSolved={onSolved} />);

    for (let i = 0; i < tokenRounds.length; i++) {
      await pick(user, candidateName(i, correctIndex(tokenRounds[i]!)));
      await advance(user, i === tokenRounds.length - 1);
    }

    expect(screen.getAllByText(en.tp.resultPassTitle).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("TOKEN")).toBeInTheDocument();
    expect(onSolved).toHaveBeenCalledWith("TOKEN");
  });

  it("fails below the threshold, offers a retry, and never reveals the code", async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    renderWithI18n(<TokenPredictor onSolved={onSolved} />);

    for (let i = 0; i < tokenRounds.length; i++) {
      const round = tokenRounds[i]!;
      const correct = correctIndex(round);
      // Get the first two rounds wrong; the rest right -> 4/6, a fail.
      const chosen = i < 2 ? (correct + 1) % round.candidates.length : correct;
      await pick(user, candidateName(i, chosen));
      await advance(user, i === tokenRounds.length - 1);
    }

    expect(screen.getAllByText(en.tp.resultFailTitle).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: en.tp.retry })).toBeInTheDocument();
    expect(screen.queryByText("TOKEN")).not.toBeInTheDocument();
    expect(onSolved).not.toHaveBeenCalled();
  });
});
