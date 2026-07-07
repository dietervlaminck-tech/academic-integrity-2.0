# Coding-Agent Blueprint — "The Ghostwriter of Nyenrode Castle" (web escape room)

A build specification for a coding agent. Goal: a standalone, code-based version of the reimagined
Academic Integrity + AI-literacy course, playable in the browser, embeddable in Canvas via iframe/LTI-lite links,
version-controlled in git.

## 1. Mission

Build a single-page web escape room with five rooms and a final door. Each room = narrative screen +
one or more interactive puzzles + a code gate. Completing a gate unlocks the next room. The final screen
issues a completion code the player pastes into Canvas (so Canvas remains the system of record).

## 2. Stack and repository

- **Stack:** Vite + React + TypeScript. No backend (privacy by design: no student data leaves the browser). State in `localStorage`.
- **Styling:** CSS variables per Nyenrode huisstijl:
  ```css
  :root {
    --ny-corporate: #5D7291; --ny-dark: #355071; --ny-accent: #FBBA20;
    --ny-light-bg: #F0F2F5; --ny-white: #FFFFFF; --ny-text: #1a1a1a;
  }
  ```
  Headings ALL CAPS, letter-spacing 0.05–0.1em, Segoe UI/Calibri stack. Bottom bar with pay-off
  "NYENRODE. A REWARD FOR LIFE". Max one golden accent element per screen.
- **Repo layout:**
  ```
  ghostwriter-escaperoom/
  ├── src/
  │   ├── App.tsx                 # router + progress guard
  │   ├── state/progress.ts       # room unlock state machine (localStorage)
  │   ├── content/rooms.ts        # ALL narrative text + puzzle data as typed content objects
  │   ├── components/
  │   │   ├── RoomShell.tsx       # narrative layout, Nyenrode chrome
  │   │   ├── CodeGate.tsx        # capital-letters access-code input
  │   │   ├── TokenPredictor.tsx  # Room 2 mini-game (see §4.2)
  │   │   ├── SourceChecker.tsx   # Room 3 puzzle (see §4.3)
  │   │   ├── AlignmentBuilder.tsx# Room 4 puzzle (see §4.4)
  │   │   ├── Crossword.tsx       # Room 1 (or embed existing interacty link)
  │   │   └── VideoEmbed.tsx      # privacy-enhanced YouTube embeds (youtube-nocookie.com)
  │   └── i18n/{en,nl}.ts         # bilingual content, EN default
  ├── public/assets/              # room illustrations (AI-generated, castle style, no persons)
  ├── tests/                      # vitest: state machine + each puzzle's win condition
  ├── README.md                   # how to run, build, deploy, edit content
  └── .github/workflows/deploy.yml # build + deploy to GitHub Pages on push to main
  ```
- **Git workflow:** conventional commits; one feature branch per room; PR to `main` triggers CI (typecheck, tests, build) and deploy to GitHub Pages. Tag `v1.0.0` when all acceptance criteria pass.

## 3. Progress state machine

Rooms: `START → LIBRARY → MACHINE_ROOM → STUDY → WORKSHOP → DOOR → ESCAPED`.
A room unlocks only when the previous gate code is entered correctly (codes checked case-sensitively, uppercase):
`APA`, `TOKEN`, `CONTEXT`, `ALIGNMENT`, `INTEGRITY`. Store per-room completion + timestamps.
On `ESCAPED`, render certificate screen with a deterministic completion code
`NYC-{hash(playerName + date) mod 10000}` for pasting into the Canvas wall-of-fame thread.

## 4. Rooms and puzzles

### 4.1 Room 1 — The Library
Narrative (see Canvas_ready_content.md, Module 1). Puzzle: crossword. v1: embed existing
interacty crossword in an iframe with a fallback link; v2 (nice-to-have): native `Crossword.tsx`
with the same six clues. Gate: `APA`.

### 4.2 Room 2 — The Machine Room (the centrepiece, build this best)
1. Embed 3Blue1Brown video (nocookie).
2. **TokenPredictor** mini-game: show a sentence stem and 3–5 candidate next tokens with hidden
   probabilities, e.g.
   - "Dieter houdt van tomaten en kaas. Hij lust geen brood. Hij eet graag …"
     → `een tosti (34%)`, `een salade Caprese (48%)`, `een pizza (17%)`, `een gazon (1%)`
   - Player picks the *most probable* token; after each pick, reveal the probability bar chart and
     a one-line explanation of how added context shifted the distribution.
   - Include the rhyme trap: "Ork, ork, ork, soep eet je met een …" → pattern-machine says `vork`,
     reasoning model says `lepel`; show both "model voices" side by side.
   - 6 rounds; ≥5 correct reveals the gate code `TOKEN`.
3. Embed reasoning-LLMs video with a two-question check.
Content lives in `content/rooms.ts`; no LLM API calls needed (all distributions hard-coded).

### 4.3 Room 3 — The Study
**SourceChecker** puzzle: show a short AI-flavoured paragraph with 5 numbered references.
Player must classify each reference: `verifiable / fabricated / publisher-as-author / bare-domain`.
Use the patterns from the real course papers (markets.businessinsider.com as a bare domain;
"Springer. (n.d.)" as publisher-as-author; one real, traceable article). ≥4 correct reveals a
letter key "A" and the gate code `CONTEXT`.
Also: external link card to the "Confront Memphis" GPT-trainer bot (opens in new tab; mark
clearly as an AI roleplay, per transparency guardrail).

### 4.4 Room 4 — The Examiner's Workshop
**AlignmentBuilder**: drag-and-drop triads. Given cards for outcomes, activities and assessments
(e.g. outcome "evaluate an AI-generated literature review", activity "annotate and correct an AI
review", assessment "annotated review + oral defence"), the player assembles three aligned chains;
misaligned combinations snap back with an explanation (e.g. reproduction-level exam next to a
"create"-level outcome). Completing all three chains reveals gate code `ALIGNMENT`.

### 4.5 Room 5 — The Door
Recap screen: the player types their one-sentence AI-integrity charter (stored locally, shown on
certificate). Gate `INTEGRITY` unlocks the certificate screen (print-friendly CSS, Nyenrode chrome,
non-personalised disclaimer + completion code).

## 5. Guardrails (from the TLC Ground Design Principles — treat as constraints)

- No student data leaves the browser; no analytics; no accounts. (Privacy/AVG.)
- Every AI element is labelled as AI (the Memphis bot card states it is a chatbot). (Transparency.)
- Puzzles deepen the cognitive work, never do it for the learner: the TokenPredictor explains
  *why* after each answer; the SourceChecker requires justification tooltips. (No bypass.)
- Accessibility: keyboard-operable puzzles, captions note on videos, WCAG AA contrast with the
  Nyenrode palette (test `--ny-accent` on white for large text only).
- An "I'm stuck" hint button per puzzle (progressive hints, never the raw answer until 3rd hint).

## 6. Acceptance criteria

1. `npm ci && npm test && npm run build` green in CI.
2. Full playthrough possible in < 45 minutes; every gate code reachable from in-game information alone.
3. Refresh-safe: progress survives reload; "reset room" and "reset all" available.
4. Lighthouse: a11y ≥ 90, performance ≥ 85 on the built bundle.
5. Works embedded in Canvas as an iframe (no top-navigation assumptions, no cookies required).
6. All copy sourced from `content/rooms.ts` / `i18n`, so faculty can edit text without touching components.
7. README documents: local dev, content editing, adding a room, deploy, and how Canvas consumes the completion code.

## 7. Out of scope (v1)

- LTI 1.3 grade passback (document as v2 option).
- Live LLM API integration for the TokenPredictor (hard-coded distributions are pedagogically sufficient and privacy-clean).
- Replacing the GPT-trainer Memphis bot (keep external; v2 could rebuild it in Copilot Studio per LACK/TRACI in-tenant).
