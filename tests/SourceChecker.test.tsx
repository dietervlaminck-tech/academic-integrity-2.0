import { describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithI18n } from "./util";
import { SourceChecker } from "../src/components/SourceChecker";
import { SOURCE_CATEGORIES, sourceItems } from "../src/game/sourceChecker";
import { en } from "../src/i18n/en";
import { fmt } from "../src/i18n";

const refLabel = (i: number) => fmt(en.source.referenceLabel, { num: i + 1 });
const catLabel = (item: (typeof sourceItems)[number]) => en.source.categories[item.category];

async function classify(
  user: ReturnType<typeof userEvent.setup>,
  i: number,
  categoryLabel: string,
) {
  const group = screen.getByRole("group", { name: refLabel(i) });
  await user.click(within(group).getByRole("button", { name: categoryLabel }));
}

describe("SourceChecker", () => {
  it("shows the justification after classifying and reveals CONTEXT when all correct", async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    renderWithI18n(<SourceChecker onSolved={onSolved} />);

    // Classify the first correctly, its justification should appear.
    await classify(user, 0, catLabel(sourceItems[0]!));
    expect(screen.getByText(sourceItems[0]!.justification)).toBeInTheDocument();

    // Classify the rest correctly.
    for (let i = 1; i < sourceItems.length; i++) {
      await classify(user, i, catLabel(sourceItems[i]!));
    }

    expect(
      screen.getByText(fmt(en.source.passCallout, { code: "CONTEXT" })),
    ).toBeInTheDocument();
    expect(onSolved).toHaveBeenCalledWith("CONTEXT");
  });

  it("fails and offers a retry when too many are wrong", async () => {
    const user = userEvent.setup();
    const onSolved = vi.fn();
    renderWithI18n(<SourceChecker onSolved={onSolved} />);

    // Get the first three right, the last two wrong -> 3/5, a fail.
    for (let i = 0; i < sourceItems.length; i++) {
      const item = sourceItems[i]!;
      const label =
        i < 3
          ? catLabel(item)
          : en.source.categories[SOURCE_CATEGORIES.find((c) => c !== item.category)!];
      await classify(user, i, label);
    }

    expect(screen.getByText(/at least 4 of 5/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: en.source.retry })).toBeInTheDocument();
    expect(
      screen.queryByText(fmt(en.source.passCallout, { code: "CONTEXT" })),
    ).not.toBeInTheDocument();
    expect(onSolved).not.toHaveBeenCalled();
  });
});
