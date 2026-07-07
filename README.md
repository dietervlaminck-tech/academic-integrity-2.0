# The Ghostwriter of Nyenrode Castle

A standalone, privacy-clean web escape room for the reimagined Nyenrode course
**Academic Integrity 2.0**. Five rooms and a final door teach academic integrity and AI
literacy: understand the machine, see through its words, and design assessment it cannot
fake. Built to be embedded in Canvas via a plain iframe.

- **No backend, no accounts, no cookies, no analytics.** All progress lives in the
  browser's `localStorage`; no student data ever leaves the browser (privacy by design).
- **Stack:** Vite + React + TypeScript (`strict`), Vitest for tests.

> Status: scaffold + progress state machine + **Room 2 (The Machine Room)** are complete
> and tested. Rooms 1, 3, 4 render their narrative and a working code gate behind an
> "under construction" banner; their full puzzles arrive in later builds (see the build
> order in `Coding_agent_blueprint.md`).

## Quick start

```bash
npm install
npm run dev      # Vite dev server
npm test         # Vitest (run before every commit)
npm run build    # typecheck + production build
npm run preview  # serve the production build locally
```

Requires Node 20+.

## How it plays

`START → LIBRARY → MACHINE_ROOM → STUDY → WORKSHOP → DOOR → ESCAPED`. Each room ends in a
gate that only opens for the correct uppercase code, and a cleared gate unlocks the next
room. The codes (each is the answer to that room's puzzle) are:

| Room         | Gate code   |
| ------------ | ----------- |
| Library      | `APA`       |
| Machine Room | `TOKEN`     |
| Study        | `CONTEXT`   |
| Workshop     | `ALIGNMENT` |
| Door         | `INTEGRITY` |

Codes are checked **exactly** and **case-sensitively**. Every code is reachable from
in-game information alone: each puzzle reveals it, and every gate has a 3-level
"I'm stuck" hint whose final hint gives the answer. Progress survives a reload, and
`Reset this room` / `Reset all progress` are always available.

### Room 2 — The Machine Room (the centrepiece)

Two privacy-enhanced videos (`youtube-nocookie.com`) frame the **TokenPredictor**
mini-game: six sentence stems, each with candidate next tokens whose probabilities are
hidden until you pick. Every pick reveals the probability distribution and a one-line
explanation of how context shifted it; the final round is the rhyme trap that shows the
pattern-machine and reasoning-model "voices" side by side. Five of six correct reveals the
code `TOKEN`. All distributions are hard-coded (no LLM calls, privacy-clean).

## Project layout

```
src/
  App.tsx                 router + progress guard
  main.tsx                app entry (mounts providers)
  state/
    progress.ts           pure room-unlock state machine (localStorage), fully tested
    useProgress.tsx       React provider/hook over the state machine
  game/tokenGame.ts       pure Room 2 win-condition logic, fully tested
  content/
    puzzles.ts            verbatim puzzle data (do not paraphrase)
    rooms.ts              narrative text as typed content objects
  i18n/{en,nl}.ts         UI strings, English default; I18nProvider.tsx / index.ts
  components/             RoomShell, CodeGate, TokenPredictor, VideoEmbed, HintButton, ...
  screens/                StartScreen, RoomScreen, CertificateScreen
  styles/theme.css        Nyenrode huisstijl (CSS variables)
public/assets/            placeholder room SVGs (final art comes later)
tests/                    Vitest: state machine + each puzzle's win condition
```

## Editing content (no component changes needed)

- **Narrative copy** lives in `src/content/rooms.ts` as typed objects. Faculty can edit the
  strings there without touching any component.
- **Puzzle data** (token rounds, source references, alignment cards, crossword clues, gate
  codes, hints) lives in `src/content/puzzles.ts`. Copy is final; do not paraphrase.
- **UI chrome strings** (buttons, labels, messages) live in `src/i18n/en.ts` and
  `src/i18n/nl.ts`. English is the default; both files share the same typed shape.

House style: headings ALL CAPS with letter-spacing; the palette comes from CSS variables in
`src/styles/theme.css`; at most one golden (`--ny-accent`) element per screen, reserved for
the primary call-to-action; never use em-dashes in user-facing text.

## Adding a room

1. The room already exists in the state machine order in `src/state/progress.ts` and its
   gate code in `src/content/puzzles.ts` (`gateCodes`).
2. Add or expand its entry in `src/content/rooms.ts` (narrative sections, links, gate
   reveal), and remove `wip: true` once the full puzzle is in.
3. Build the puzzle component in `src/components/`, keep its win condition in a pure module
   under `src/game/`, and render it from `src/screens/RoomScreen.tsx` for that room.
4. Add a Vitest test for the puzzle's win condition (see `tests/tokenGame.test.ts`).

## Deploy

Pushing to `main` runs typecheck + tests + build and deploys the built bundle to GitHub
Pages (`.github/workflows/deploy.yml`). The workflow sets Vite's `base` to the repository
subpath automatically. To build for a custom base locally:

```bash
VITE_BASE=/my-subpath/ npm run build
```

The build is a static bundle in `dist/`; host it anywhere static.

## Embedding in Canvas

Add the deployed URL as an iframe (or an External URL / LTI-lite link) in a Canvas page.
The app makes no top-navigation assumptions and needs no cookies, so it runs inside the
Canvas iframe. Canvas stays the system of record: on completion the certificate screen
shows a deterministic code `NYC-####` that the participant pastes into the Canvas
wall-of-fame thread.

## Privacy

No backend, no analytics, no accounts, no cookies. Videos use `youtube-nocookie.com`. The
only stored data is local game progress and the optional display name used on the local
certificate; both live in `localStorage` and never leave the browser.
