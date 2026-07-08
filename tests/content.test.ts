import { describe, expect, it } from "vitest";
import {
  courseGoals,
  machineRoomCheck,
  rooms,
  startLetter,
  type RoomContent,
} from "../src/content/rooms";
import { en } from "../src/i18n/en";
import { nl } from "../src/i18n/nl";

const GATED: RoomContent[] = Object.values(rooms);

describe("didactic scaffolding", () => {
  it("every room states a learning goal", () => {
    for (const room of GATED) {
      expect(room.learningGoal.length, `${room.room} learningGoal`).toBeGreaterThan(20);
    }
  });

  it("every gated room has a 'your turn' introduction", () => {
    for (const room of GATED) {
      expect(room.puzzleIntro, `${room.room} puzzleIntro`).toBeDefined();
      expect(room.puzzleIntro!.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("courseGoals mirrors each room's own learning-goal callout", () => {
    for (const { room, goal } of courseGoals) {
      expect(goal).toBe(rooms[room as keyof typeof rooms].learningGoal);
    }
  });

  it("the Machine Room teaches reasoning models between the two puzzles", () => {
    const post = rooms.MACHINE_ROOM.postPuzzle;
    expect(post).toBeDefined();
    expect(post!.some((s) => s.kind === "video")).toBe(true);
    expect(JSON.stringify(post)).toContain("Reasoning models");
  });

  it("the token game's Dutch examples are introduced with a gloss", () => {
    const intro = rooms.MACHINE_ROOM.puzzleIntro!.join(" ");
    expect(intro).toContain("Dutch");
    expect(intro).toContain("tosti");
    expect(intro).toContain("gazon");
  });

  it("the Library teaches the three AI-policy principles before testing", () => {
    const listSection = rooms.LIBRARY.intro.find((s) => s.kind === "list");
    expect(listSection).toBeDefined();
    expect(listSection!.kind === "list" && listSection!.items).toHaveLength(3);
    const text = JSON.stringify(rooms.LIBRARY.intro);
    expect(text).toContain("Informed Participation");
    expect(text).toContain("Accountability");
    expect(text).toContain("How to disclose");
  });

  it("the Workshop teaches all three drawers", () => {
    const text = JSON.stringify(rooms.WORKSHOP.intro);
    expect(text).toContain("Constructive alignment");
    expect(text).toContain("four quality criteria");
    expect(text).toContain("Three moves");
  });

  it("courseGoals covers the five gated rooms in play order", () => {
    expect(courseGoals.map((g) => g.room)).toEqual([
      "LIBRARY",
      "MACHINE_ROOM",
      "STUDY",
      "WORKSHOP",
      "DOOR",
    ]);
  });
});

describe("house style", () => {
  it("no em-dashes anywhere in user-facing content or UI strings", () => {
    const all = JSON.stringify({ rooms, startLetter, courseGoals, machineRoomCheck, en, nl });
    expect(all).not.toContain("—");
  });
});
