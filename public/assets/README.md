# Room illustrations (placeholder art)

These SVGs are **placeholders**, generated in the Nyenrode palette (`--ny-dark #355071`,
`--ny-corporate #5D7291`, light background `#F0F2F5`). Final artwork comes later.

Guidelines they follow (keep these when the final art is commissioned):

- Castle style, no photos and no depictions of real persons (privacy by design).
- Palette-only: corporate blue and dark blue on the light background. No golden fill here,
  so each screen keeps at most one golden accent element (reserved for the primary button).
- Each file has a `role="img"` and an `aria-label`; they are rendered decoratively
  (`aria-hidden`) inside the app, so the label is a fallback only.

| File           | Room / screen        |
| -------------- | -------------------- |
| `castle.svg`   | Start                |
| `bookcase.svg` | Room 1 - Library     |
| `machine.svg`  | Room 2 - Machine Room|
| `desk.svg`     | Room 3 - Study       |
| `cabinet.svg`  | Room 4 - Workshop    |
| `door.svg`     | Room 5 - Door        |

To swap in final art, replace the file of the same name (keep the `viewBox` roughly
`0 0 240 160` for a drop-in fit) or update the mapping in
`src/components/RoomIllustration.tsx`.
