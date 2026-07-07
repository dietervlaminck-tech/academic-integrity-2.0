# CLAUDE.md — The Ghostwriter of Nyenrode Castle (web escape room)

## What this project is
A standalone, privacy-clean web escape room implementing the reimagined Nyenrode course
"Academic Integrity 2.0". Read these files before writing any code:
1. `Coding_agent_blueprint.md` — the build specification (stack, repo layout, state machine, acceptance criteria). Follow it.
2. `Canvas_ready_content.md` — all narrative texts, quiz items and gate codes. Copy verbatim; do not invent copy.
3. `Puzzle_data.ts` — complete, ready-to-use data for the three native puzzles. Import it; do not fabricate puzzle content.

## Commands
- `npm run dev` — Vite dev server
- `npm test` — vitest (run before every commit)
- `npm run build && npm run preview` — production check

## Conventions
- Vite + React + TypeScript, `strict: true`. No backend, no cookies, no analytics; state in `localStorage` only.
- ALL user-facing copy lives in `src/content/` (typed objects) and `src/i18n/` — never hard-code strings in components.
- English is the default language; keep the Dutch examples in the token game exactly as given (they are pedagogical).
- Styling: CSS variables from the blueprint (`--ny-dark: #355071`, `--ny-corporate: #5D7291`, `--ny-accent: #FBBA20`, `--ny-light-bg: #F0F2F5`). Headings ALL CAPS with letter-spacing. Bottom bar: "NYENRODE. A REWARD FOR LIFE". Max one golden accent element per screen.
- Typography and copy: never use em-dashes in user-facing text; use colons, semicolons or commas.
- Accessibility: every puzzle keyboard-operable; WCAG AA contrast; the accent yellow only for large text/decoration on white.
- Gate codes are uppercase and checked exactly: APA, TOKEN, CONTEXT, ALIGNMENT, INTEGRITY.
- Videos: embed via youtube-nocookie.com only.
- Placeholder art: generate simple SVG illustrations (castle, bookcase, machine, desk, cabinet, door) in the Nyenrode palette; no photos of real persons; mark `public/assets/README` that final art comes later.

## Git
- `git init` on start; conventional commits (`feat:`, `fix:`, `test:`, `docs:`); one branch per room, merge to `main` when its tests pass.
- Do not push until a remote is configured by Dieter; stop and ask when ready to push.
- Tag `v1.0.0` only when all acceptance criteria in the blueprint pass.

## Build order
1. Scaffold + progress state machine + `CodeGate` (with tests).
2. Room 2 (Machine Room, TokenPredictor) — the centrepiece; get this reviewed first.
3. Rooms 1, 3, 4, 5. Room 1 embeds the existing Interacty crossword via iframe with a native fallback using the clue data in `Puzzle_data.ts`.
4. Certificate screen + print CSS + README.

## Definition of done (per room)
Narrative copy matches `Canvas_ready_content.md`; puzzle win condition has a vitest test;
gate unlocks next room; progress survives reload; hints work (3 levels, answer only at level 3);
keyboard playthrough possible.
