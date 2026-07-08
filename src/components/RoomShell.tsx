import type { ReactNode } from "react";
import { useI18n } from "../i18n";
import type { RoomContent } from "../content/rooms";
import { NarrativeSections } from "./NarrativeSections";
import { RoomIllustration } from "./RoomIllustration";

// Narrative layout + Nyenrode chrome shared by every room: module eyebrow, room title,
// learning-goal callout, optional under-construction banner, the narrative/theory
// sections, the room-specific puzzle/gate passed as children, and finally the
// clearly-labelled optional external activities.

export function RoomShell({
  content,
  cleared = false,
  toolbar,
  sceneMode = false,
  children,
}: {
  content: RoomContent;
  /** When the room is already cleared, hide the under-construction banner so the cleared
      screen keeps a single golden accent (the Continue button). */
  cleared?: boolean;
  /** Optional controls (e.g. the reading/scene view toggle) rendered under the goal. */
  toolbar?: ReactNode;
  /** In scene mode the explorable scene replaces the illustration and the flat
      narrative; the chrome (title, goal, extras) stays. */
  sceneMode?: boolean;
  children?: ReactNode;
}) {
  const { t } = useI18n();
  const title = t.rooms[content.room];

  return (
    <article className="card">
      <p className="room__eyebrow">{content.eyebrow}</p>
      <h1>{title}</h1>
      <div className="room__title-rule" aria-hidden="true" />

      <div className="goal">
        <p className="room__eyebrow">{t.shell.goalLabel}</p>
        <p className="goal__text">{content.learningGoal}</p>
      </div>

      {toolbar}

      {!sceneMode && <RoomIllustration room={content.room} />}

      {content.wip && !cleared && <p className="wip">{t.wip.banner}</p>}

      {!sceneMode && <NarrativeSections sections={content.intro} />}

      {children}

      {/* Optional external activities render after the puzzle and gate, so the required
          teach-then-test flow is never interrupted by an outbound link. */}
      {content.links && content.links.length > 0 && (
        <aside className="extras">
          <h3>{t.shell.extrasHeading}</h3>
          <ul className="extras__list">
            {content.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
                {link.note ? ` ${link.note}` : ""}
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
