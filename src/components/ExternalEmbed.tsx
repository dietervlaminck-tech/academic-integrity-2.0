import { useI18n } from "../i18n";

// Generic embed for an existing external activity (e.g. the Interacty crossword). Some
// hosts refuse to be framed (X-Frame-Options) or are blocked inside a Canvas iframe, so a
// visible fallback link always accompanies the frame. No cookies are required by the app
// itself; the third-party activity governs its own.

export type ExternalEmbedProps = {
  src: string;
  title: string;
  /** Frame height in px; the frame scrolls internally if the activity is taller. */
  height?: number;
};

export function ExternalEmbed({ src, title, height = 460 }: ExternalEmbedProps) {
  const { t } = useI18n();
  return (
    <div className="embed">
      <div className="embed__frame" style={{ height }}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <p className="embed__fallback">
        {t.embed.fallback}{" "}
        <a href={src} target="_blank" rel="noopener noreferrer">
          {t.embed.openNewTab}
        </a>
      </p>
    </div>
  );
}
