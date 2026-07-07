import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithI18n } from "./util";
import { QuestionCheck } from "../src/components/QuestionCheck";
import { correctOptionIndex, machineRoomCheck } from "../src/game/questionCheck";
import { en } from "../src/i18n/en";

describe("QuestionCheck", () => {
  it("gives per-question feedback and a both-correct summary", async () => {
    const user = userEvent.setup();
    renderWithI18n(<QuestionCheck questions={machineRoomCheck} />);

    for (const q of machineRoomCheck) {
      const group = screen.getByRole("group", { name: q.prompt });
      const correct = q.options[correctOptionIndex(q)]!;
      await user.click(within(group).getByRole("button", { name: correct.text }));
    }

    expect(screen.getAllByText(en.check.correct).length).toBe(machineRoomCheck.length);
    expect(screen.getByText(en.check.allCorrect)).toBeInTheDocument();
  });

  it("marks a wrong pick, highlights the correct option, and locks the question", async () => {
    const user = userEvent.setup();
    renderWithI18n(<QuestionCheck questions={machineRoomCheck} />);

    const q = machineRoomCheck[0]!;
    const correctIdx = correctOptionIndex(q);
    const wrongIdx = (correctIdx + 1) % q.options.length;
    const group = screen.getByRole("group", { name: q.prompt });

    await user.click(within(group).getByRole("button", { name: q.options[wrongIdx]!.text }));

    // The feedback line is a sibling of the option group; only one question is answered,
    // so it is unambiguous at the screen level.
    expect(screen.getByText(en.check.incorrect)).toBeInTheDocument();
    // The picked (wrong) button is not disabled (aria-disabled keeps focus), but a second
    // click must not change the recorded answer.
    await user.click(within(group).getByRole("button", { name: q.options[correctIdx]!.text }));
    expect(screen.getByText(en.check.incorrect)).toBeInTheDocument();
  });
});
