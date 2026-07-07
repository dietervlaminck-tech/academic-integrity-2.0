import type { ReactNode } from "react";
import { useI18n } from "../i18n";
import type { RoomContent } from "../content/rooms";
import { NarrativeSections } from "./NarrativeSections";
import { RoomIllustration } from "./RoomIllustration";

// Narrative layout + Nyenrode chrome shared by every room: module eyebrow, room title,
// one decorative golden rule, optional under-construction banner, the narrative sections
// and external links, then the room-specific puzzle/gate passed as children.

export function RoomShell({
  content,
  children,
}: {
  content: RoomContent;
  children?: ReactNode;
}) {
  const { t } = useI18n();
  const title = t.rooms[content.room];

  return (
    <article className="card">
      <p className="room__eyebrow">{content.eyebrow}</p>
      <h1>{title}</h1>
      <div className="room__title-rule" aria-hidden="true" />

      <RoomIllustration room={content.room} />

      {content.wip && <p className="wip">{t.wip.banner}</p>}

      <NarrativeSections sections={content.intro} />

      {content.links && content.links.length > 0 && (
        <ul>
          {content.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
              {link.note ? ` ${link.note}` : ""}
            </li>
          ))}
        </ul>
      )}

      {children}
    </article>
  );
}
