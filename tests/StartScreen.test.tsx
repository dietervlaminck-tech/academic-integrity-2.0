import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithI18n } from "./util";
import { StartScreen } from "../src/screens/StartScreen";
import { ProgressProvider } from "../src/state/useProgress";
import { courseGoals } from "../src/content/rooms";
import { en } from "../src/i18n/en";

describe("StartScreen overview", () => {
  it("shows the journey map with all five learning goals and how-it-works", () => {
    renderWithI18n(
      <ProgressProvider>
        <StartScreen />
      </ProgressProvider>,
    );

    expect(
      screen.getByRole("heading", { name: en.overview.learnHeading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: en.overview.howHeading }),
    ).toBeInTheDocument();

    // All five room goals are listed, labelled with the room title.
    for (const { room, goal } of courseGoals) {
      expect(screen.getByText(goal, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(`${en.rooms[room]}:`)).toBeInTheDocument();
    }

    // Every how-it-works line renders.
    for (const line of en.overview.how) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });
});
