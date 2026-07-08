import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App";
import { I18nProvider } from "../src/i18n/I18nProvider";
import { ProgressProvider } from "../src/state/useProgress";
import { en } from "../src/i18n/en";

function renderApp() {
  return render(
    <I18nProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </I18nProvider>,
  );
}

describe("App playthrough in the reading view (Start -> Library -> Machine Room)", () => {
  it("routes through the gate and resumes after a reload", async () => {
    const user = userEvent.setup();
    const view = renderApp();

    // Start screen: enter a name and begin.
    await user.type(screen.getByLabelText(en.start.namePrompt), "Dieter");
    await user.click(screen.getByRole("button", { name: en.start.begin }));

    // The Library opens as a scene by default; this test exercises the flat flow.
    expect(
      screen.getByRole("heading", { level: 1, name: en.rooms.LIBRARY }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: en.scene.toggleReading }));

    await user.type(screen.getByLabelText(en.gate.ariaInput), "APA");
    await user.click(screen.getByRole("button", { name: en.gate.submit }));

    // Machine Room is now current, with the TokenPredictor loaded.
    expect(
      screen.getByRole("heading", { level: 1, name: en.rooms.MACHINE_ROOM }),
    ).toBeInTheDocument();
    // The TokenPredictor puzzle is loaded (its prompt is unique to the puzzle).
    expect(screen.getByText(en.tp.question)).toBeInTheDocument();

    // Regression: the Machine Room gate must be a fresh, empty, enabled field and
    // must not inherit the Library gate's "unlocked" state.
    const machineGate = screen.getByLabelText(en.gate.ariaInput);
    expect(machineGate).toHaveValue("");
    expect(machineGate).toBeEnabled();
    expect(screen.queryByText(en.gate.success)).not.toBeInTheDocument();

    // Simulate a reload: unmount and remount from persisted localStorage.
    view.unmount();
    renderApp();
    expect(
      screen.getByRole("heading", { level: 1, name: en.rooms.MACHINE_ROOM }),
    ).toBeInTheDocument();
  });

  it("rejects a wrong gate code and stays in the Library", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: en.start.begin }));
    await user.click(screen.getByRole("button", { name: en.scene.toggleReading }));
    await user.type(screen.getByLabelText(en.gate.ariaInput), "WRONG");
    await user.click(screen.getByRole("button", { name: en.gate.submit }));

    expect(screen.getByText(en.gate.error)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: en.rooms.LIBRARY }),
    ).toBeInTheDocument();
  });
});
