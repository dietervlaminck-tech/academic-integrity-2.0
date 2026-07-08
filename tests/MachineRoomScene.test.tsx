import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App";
import { I18nProvider } from "../src/i18n/I18nProvider";
import { ProgressProvider } from "../src/state/useProgress";
import { STORAGE_KEY } from "../src/state/progress";
import { machineRoomScene } from "../src/content/rooms";
import { correctIndex, tokenRounds } from "../src/game/tokenGame";
import { correctOptionIndex, machineRoomCheck } from "../src/game/questionCheck";
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

const plainName = (num: number, title: string) => fmt(en.scene.hotspot, { num, title });
const doneName = (num: number, title: string) =>
  fmt(en.scene.hotspotVisited, { num, title });
const lockedName = (num: number, title: string) =>
  fmt(en.scene.hotspotLocked, { num, title });

const title = (i: number) => machineRoomScene[i]!.title;

async function enterScene(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: en.scene.toggleExplore }));
}

describe("Machine Room explorable scene (linear prototype)", () => {
  it("starts with only the first hotspot unlocked; the rest are locked", async () => {
    seedMachineRoom();
    const user = userEvent.setup();
    renderApp();

    // Reading view by default: the token game is directly on the page.
    expect(screen.getByText(en.tp.question)).toBeVisible();

    await enterScene(user);

    expect(screen.getByRole("button", { name: plainName(1, title(0)) })).toBeInTheDocument();
    for (let i = 1; i < machineRoomScene.length; i++) {
      expect(
        screen.getByRole("button", { name: lockedName(i + 1, title(i)) }),
      ).toBeInTheDocument();
    }
  });

  it("a locked hotspot does not open its panel", async () => {
    seedMachineRoom();
    const user = userEvent.setup();
    renderApp();
    await enterScene(user);

    await user.click(screen.getByRole("button", { name: lockedName(5, title(4)) }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opening a theory panel completes it and unlocks the next hotspot", async () => {
    seedMachineRoom();
    const user = userEvent.setup();
    renderApp();
    await enterScene(user);

    await user.click(screen.getByRole("button", { name: plainName(1, title(0)) }));
    const dialog = screen.getByRole("dialog", { name: title(0) });
    expect(within(dialog).getByText(/disappointingly unmysterious/)).toBeVisible();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Hotspot 1 is done; hotspot 2 is now unlocked; hotspot 3 is still locked.
    expect(screen.getByRole("button", { name: doneName(1, title(0)) })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: plainName(2, title(1)) })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: lockedName(3, title(2)) }),
    ).toBeInTheDocument();
  });

  it("walks the full linear chain: theory, token game, check, then the gate", async () => {
    seedMachineRoom();
    const user = userEvent.setup();
    renderApp();
    await enterScene(user);

    // 1 + 2: theory panels complete on opening.
    for (const i of [0, 1]) {
      await user.click(screen.getByRole("button", { name: plainName(i + 1, title(i)) }));
      await user.click(
        within(screen.getByRole("dialog", { name: title(i) })).getByRole("button", {
          name: en.scene.close,
        }),
      );
    }

    // 3: the control panel unlocks only now; pass the token game inside it.
    await user.click(screen.getByRole("button", { name: plainName(3, title(2)) }));
    const puzzlePanel = screen.getByRole("dialog", { name: title(2) });
    for (let r = 0; r < tokenRounds.length; r++) {
      const round = tokenRounds[r]!;
      const pickText = round.candidates[correctIndex(round)]!.text;
      await user.click(within(puzzlePanel).getByRole("button", { name: pickText }));
      await user.click(
        within(puzzlePanel).getByRole("button", {
          name: r === tokenRounds.length - 1 ? en.tp.seeResult : en.tp.nextRound,
        }),
      );
    }
    expect(within(puzzlePanel).getByText("TOKEN")).toBeInTheDocument();
    await user.click(within(puzzlePanel).getByRole("button", { name: en.scene.close }));

    // 4: the terminal unlocks after the game is passed; answer both check questions.
    await user.click(screen.getByRole("button", { name: plainName(4, title(3)) }));
    const termPanel = screen.getByRole("dialog", { name: title(3) });
    for (const q of machineRoomCheck) {
      const group = within(termPanel).getByRole("group", { name: q.prompt });
      await user.click(
        within(group).getByRole("button", {
          name: q.options[correctOptionIndex(q)]!.text,
        }),
      );
    }
    await user.click(within(termPanel).getByRole("button", { name: en.scene.close }));

    // 5: the hatch unlocks last; the gate clears the room and moves on to the Study.
    await user.click(screen.getByRole("button", { name: plainName(5, title(4)) }));
    const gatePanel = screen.getByRole("dialog", { name: title(4) });
    await user.type(within(gatePanel).getByLabelText(en.gate.ariaInput), "TOKEN");
    await user.click(within(gatePanel).getByRole("button", { name: en.gate.submit }));

    expect(
      screen.getByRole("heading", { level: 1, name: en.rooms.STUDY }),
    ).toBeInTheDocument();
  });
});
