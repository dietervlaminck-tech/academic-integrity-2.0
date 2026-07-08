import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App";
import { I18nProvider } from "../src/i18n/I18nProvider";
import { ProgressProvider } from "../src/state/useProgress";
import { STORAGE_KEY } from "../src/state/progress";
import { machineRoomScene } from "../src/content/rooms";
import { en } from "../src/i18n/en";
import { fmt } from "../src/i18n";

function seedMachineRoom() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      furthest: "MACHINE_ROOM",
      current: "MACHINE_ROOM",
      clearedAt: { START: "x", LIBRARY: "x" },
      playerName: "Dieter",
      charter: "",
    }),
  );
}

function renderApp() {
  return render(
    <I18nProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </I18nProvider>,
  );
}

const hotspotName = (num: number, title: string) =>
  fmt(en.scene.hotspot, { num, title });

describe("Machine Room explorable scene (prototype)", () => {
  it("defaults to the reading view; the toggle reveals the five hotspots", async () => {
    seedMachineRoom();
    const user = userEvent.setup();
    renderApp();

    // Reading view by default: the token game is directly on the page.
    expect(screen.getByText(en.tp.question)).toBeVisible();

    await user.click(screen.getByRole("button", { name: en.scene.toggleExplore }));

    for (let i = 0; i < machineRoomScene.length; i++) {
      expect(
        screen.getByRole("button", { name: hotspotName(i + 1, machineRoomScene[i]!.title) }),
      ).toBeInTheDocument();
    }
    // The flat narrative is replaced by the scene.
    expect(screen.queryByText(en.tp.question)).not.toBeVisible();
  });

  it("opens a theory panel, marks it viewed, and closes with Escape", async () => {
    seedMachineRoom();
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: en.scene.toggleExplore }));

    await user.click(screen.getByRole("button", { name: hotspotName(1, "The machine on the desk") }));
    const dialog = screen.getByRole("dialog", { name: "The machine on the desk" });
    expect(dialog).toBeVisible();
    expect(within(dialog).getByText(/disappointingly unmysterious/)).toBeVisible();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // The hotspot is now labelled as viewed.
    expect(
      screen.getByRole("button", {
        name: fmt(en.scene.hotspotVisited, { num: 1, title: "The machine on the desk" }),
      }),
    ).toBeInTheDocument();
  });

  it("hosts the token game in the control panel and the working gate in the hatch", async () => {
    seedMachineRoom();
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: en.scene.toggleExplore }));

    // Control panel: the token game with its Your-turn intro.
    await user.click(screen.getByRole("button", { name: hotspotName(3, "The control panel") }));
    const puzzlePanel = screen.getByRole("dialog", { name: "The control panel" });
    expect(within(puzzlePanel).getByText(en.tp.question)).toBeVisible();
    expect(within(puzzlePanel).getByText(en.shell.yourTurn)).toBeVisible();
    await user.click(within(puzzlePanel).getByRole("button", { name: en.scene.close }));

    // Hatch: the real gate; TOKEN clears the room.
    await user.click(screen.getByRole("button", { name: hotspotName(5, "The maintenance hatch") }));
    const gatePanel = screen.getByRole("dialog", { name: "The maintenance hatch" });
    await user.type(within(gatePanel).getByLabelText(en.gate.ariaInput), "TOKEN");
    await user.click(within(gatePanel).getByRole("button", { name: en.gate.submit }));

    // The gate clears the room and moves the player on to the Study.
    expect(
      screen.getByRole("heading", { level: 1, name: en.rooms.STUDY }),
    ).toBeInTheDocument();
  });
});
