import { useI18n } from "../i18n";

// The "Your turn" transition block rendered between a room's theory and its puzzle. It
// signposts the switch from teaching to testing and explains, in the room's own words
// (from content/rooms.ts), what the puzzle tests and how to play it.

export function PuzzleIntro({ paragraphs }: { paragraphs: string[] }) {
  const { t } = useI18n();
  if (paragraphs.length === 0) return null;
  return (
    <div className="yourturn">
      <p className="room__eyebrow">{t.shell.yourTurn}</p>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
