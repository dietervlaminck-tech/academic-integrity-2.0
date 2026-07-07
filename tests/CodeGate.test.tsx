import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithI18n } from "./util";
import { CodeGate } from "../src/components/CodeGate";
import { en } from "../src/i18n/en";

describe("CodeGate", () => {
  it("uppercases and trims the input before submitting", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(() => true);
    renderWithI18n(<CodeGate onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(en.gate.ariaInput), "  token  ");
    await user.click(screen.getByRole("button", { name: en.gate.submit }));

    expect(onSubmit).toHaveBeenCalledWith("TOKEN");
    expect(screen.getByText(en.gate.success)).toBeInTheDocument();
  });

  it("shows an error and stays open when the code is wrong", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(() => false);
    renderWithI18n(<CodeGate onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(en.gate.ariaInput), "NOPE");
    await user.click(screen.getByRole("button", { name: en.gate.submit }));

    expect(onSubmit).toHaveBeenCalledWith("NOPE");
    expect(screen.getByText(en.gate.error)).toBeInTheDocument();
    expect(screen.getByLabelText(en.gate.ariaInput)).not.toBeDisabled();
  });

  it("disables submit until something is typed", () => {
    renderWithI18n(<CodeGate onSubmit={() => true} />);
    expect(screen.getByRole("button", { name: en.gate.submit })).toBeDisabled();
  });
});
