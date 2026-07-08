import type { Section } from "../content/rooms";
import { VideoEmbed } from "./VideoEmbed";

// Renders the typed narrative/theory sections from content/rooms.ts. No copy is authored here.

export function NarrativeSections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section, i) => {
        if (section.kind === "video") {
          return (
            <div key={i}>
              {section.body?.map((p, j) => <p key={j}>{p}</p>)}
              <VideoEmbed video={section.video} />
            </div>
          );
        }
        if (section.kind === "note") {
          return (
            <div key={i} className="note">
              {section.body.map((p, j) => <p key={j}>{p}</p>)}
            </div>
          );
        }
        if (section.kind === "list") {
          const items = section.items.map((item, j) => <li key={j}>{item}</li>);
          return (
            <section key={i} className="narrative">
              {section.heading && <h3>{section.heading}</h3>}
              {section.lead && <p>{section.lead}</p>}
              {/* A list is unordered unless it explicitly opts into numbering. */}
              {section.ordered === true ? (
                <ol className="content-list">{items}</ol>
              ) : (
                <ul className="content-list">{items}</ul>
              )}
            </section>
          );
        }
        return (
          <section key={i} className="narrative">
            {section.heading && <h3>{section.heading}</h3>}
            {section.body.map((p, j) => <p key={j}>{p}</p>)}
          </section>
        );
      })}
    </>
  );
}
