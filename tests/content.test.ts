import { describe, expect, it } from "vitest";
import {
  courseGoals,
  machineRoomCheck,
  rooms,
  roomScenes,
  startLetter,
  type RoomContent,
} from "../src/content/rooms";
import { tokenRounds } from "../src/content/puzzles";
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

  it("the token game is fully English and introduced on its own terms", () => {
    const intro = rooms.MACHINE_ROOM.puzzleIntro!.join(" ");
    expect(intro).toContain("Dieter");
    expect(intro).toContain("context");
    // Dieter (2026-07-08): the examples were translated; no Dutch may remain.
    const gameText = JSON.stringify(tokenRounds);
    expect(gameText).not.toMatch(/een |soep|vork|lepel|tosti|gazon/);
  });

  it("no copy references lectures or course moments outside the app (standalone)", () => {
    const userFacing = JSON.stringify({ rooms, startLetter, courseGoals, machineRoomCheck });
    expect(userFacing).not.toMatch(/lecture|Canvas course|in the original/i);
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

describe("explorable scenes", () => {
  it("every room's scene covers all intro sections, has unique ids, and ends at the gate", () => {
    for (const [room, scene] of Object.entries(roomScenes)) {
      const content = rooms[room as keyof typeof rooms];

      const ids = new Set(scene.map((h) => h.id));
      expect(ids.size, `${room} hotspot ids`).toBe(scene.length);

      for (const h of scene) {
        for (const i of h.sections ?? []) {
          expect(i, `${room}/${h.id} section index ${i}`).toBeLessThan(content.intro.length);
        }
      }

      expect(scene.filter((h) => h.kind === "gate"), `${room} gate count`).toHaveLength(1);
      expect(scene[scene.length - 1]!.kind, `${room} last hotspot`).toBe("gate");

      const covered = new Set(scene.flatMap((h) => h.sections ?? []));
      for (let i = 0; i < content.intro.length; i++) {
        expect(covered.has(i), `${room} intro[${i}] not shown by any hotspot`).toBe(true);
      }
    }
  });
});

describe("house style", () => {
  it("no em-dashes anywhere in user-facing content or UI strings", () => {
    const all = JSON.stringify({ rooms, startLetter, courseGoals, machineRoomCheck, en, nl });
    expect(all).not.toContain("—");
  });
});
