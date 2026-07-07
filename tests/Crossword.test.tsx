import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithI18n } from "./util";
import { Crossword } from "../src/components/Crossword";
import { entryByNum } from "../src/game/crossword";
import { en } from "../src/i18n/en";
import { fmt } from "../src/i18n";

const labelFor = (num: number) => {
  const e = entryByNum(num)!;
  const dir = e.direction === "across" ? en.crossword.across : en.crossword.down;
  return fmt(en.crossword.answerLabel, { num, dir, len: e.answer.length });
};

describe("Crossword (native fallback)", () => {
  it("solving clue 4 reveals the code APA and fires onSolved", async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    renderWithI18n(<Crossword onSolved={onSolved} />);

    const input = screen.getByLabelText(labelFor(4));
    await user.type(input, "apa"); // typed lowercase; component uppercases

    expect(screen.getByText(fmt(en.crossword.gateCallout, { code: "APA" }))).toBeInTheDocument();
    expect(screen.getByText(en.crossword.solved)).toBeInTheDocument();
    expect(onSolved).toHaveBeenCalledWith("APA");
  });

  it("does not reveal the code for a wrong answer", async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    renderWithI18n(<Crossword onSolved={onSolved} />);

    await user.type(screen.getByLabelText(labelFor(4)), "XYZ");

    expect(
      screen.queryByText(fmt(en.crossword.gateCallout, { code: "APA" })),
    ).not.toBeInTheDocument();
    expect(onSolved).not.toHaveBeenCalled();
  });

  it("caps input at the answer length", async () => {
    const user = userEvent.setup();
    renderWithI18n(<Crossword />);
    const input = screen.getByLabelText(labelFor(4)) as HTMLInputElement;
    await user.type(input, "APADEXTRA");
    expect(input.value).toHaveLength(entryByNum(4)!.answer.length);
  });
});
