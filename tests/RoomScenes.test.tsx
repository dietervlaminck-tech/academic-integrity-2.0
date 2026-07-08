import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App";
import { I18nProvider } from "../src/i18n/I18nProvider";
import { ProgressProvider } from "../src/state/useProgress";
import { STORAGE_KEY } from "../src/state/progress";
import { doorScene, libraryScene } from "../src/content/rooms";
import { en } from "../src/i18n/en";
import { fmt } from "../src/i18n";

function seed(current: string, clearedAt: Record<string, string>) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      furthest: current,
      current,
      clearedAt,
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

const plain = (num: number, title: string) => fmt(en.scene.hotspot, { num, title });

describe("Library scene", () => {
  it("walks bookcase, policy shelf, crossword and the APA gate linearly", async () => {
    seed("LIBRARY", { START: "x" });
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: en.scene.toggleExplore }));

    // Theory hotspots 1 and 2.
    for (const i of [0, 1]) {
      await user.click(
        screen.getByRole("button", { name: plain(i + 1, libraryScene[i]!.title) }),
      );
      const dialog = screen.getByRole("dialog", { name: libraryScene[i]!.title });
      await user.click(within(dialog).getByRole("button", { name: en.scene.close }));
    }
    // The policy shelf panel taught the house rules (spot check happened via render).

    // 3: the green book holds the crossword; solving clue 4 completes it.
    await user.click(screen.getByRole("button", { name: plain(3, libraryScene[2]!.title) }));
    const bookPanel = screen.getByRole("dialog", { name: libraryScene[2]!.title });
    expect(within(bookPanel).getByText(en.shell.yourTurn)).toBeVisible();
    const clue4 = within(bookPanel).getByLabelText(
      fmt(en.crossword.answerLabel, { num: 4, dir: en.crossword.down, len: 3 }),
    );
    await user.type(clue4, "APA");
    expect(
      within(bookPanel).getByText(fmt(en.crossword.gateCallout, { code: "APA" })),
    ).toBeVisible();
    await user.click(within(bookPanel).getByRole("button", { name: en.scene.close }));

    // 4: the bottom doors unlock now; APA clears the room.
    await user.click(screen.getByRole("button", { name: plain(4, libraryScene[3]!.title) }));
    const gatePanel = screen.getByRole("dialog", { name: libraryScene[3]!.title });
    await user.type(within(gatePanel).getByLabelText(en.gate.ariaInput), "APA");
    await user.click(within(gatePanel).getByRole("button", { name: en.gate.submit }));

    expect(
      screen.getByRole("heading", { level: 1, name: en.rooms.MACHINE_ROOM }),
    ).toBeInTheDocument();
  });
});

describe("Door scene", () => {
  it("reads the letter, writes the charter on the wall of fame, and opens the lock", async () => {
    seed("DOOR", { START: "x", LIBRARY: "x", MACHINE_ROOM: "x", STUDY: "x", WORKSHOP: "x" });
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: en.scene.toggleExplore }));

    // 1: the letter hands over the final word.
    await user.click(screen.getByRole("button", { name: plain(1, doorScene[0]!.title) }));
    const letterPanel = screen.getByRole("dialog", { name: doorScene[0]!.title });
    expect(
      within(letterPanel).getByText(/when nobody is checking: INTEGRITY/),
    ).toBeVisible();
    await user.click(within(letterPanel).getByRole("button", { name: en.scene.close }));

    // 2: the wall of fame holds the charter.
    await user.click(screen.getByRole("button", { name: plain(2, doorScene[1]!.title) }));
    const wallPanel = screen.getByRole("dialog", { name: doorScene[1]!.title });
    await user.type(
      within(wallPanel).getByLabelText(en.charter.heading),
      "I will verify every AI-assisted claim.",
    );
    await user.click(within(wallPanel).getByRole("button", { name: en.scene.close }));

    // 3: the lock takes INTEGRITY; the certificate shows the charter.
    await user.click(screen.getByRole("button", { name: plain(3, doorScene[2]!.title) }));
    const lockPanel = screen.getByRole("dialog", { name: doorScene[2]!.title });
    await user.type(within(lockPanel).getByLabelText(en.gate.ariaInput), "INTEGRITY");
    await user.click(within(lockPanel).getByRole("button", { name: en.gate.submit }));

    expect(
      screen.getByRole("heading", { level: 1, name: en.certificate.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("I will verify every AI-assisted claim.")).toBeInTheDocument();
  });
});
