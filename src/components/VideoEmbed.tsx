import { useI18n } from "../i18n";
import type { VideoRef } from "../content/rooms";

// Privacy-enhanced YouTube embed: youtube-nocookie.com only, no autoplay, no cookies
// set until the user plays. Keeps the escape room privacy-clean (no student data leaves
// the browser) and Canvas-iframe friendly.

export function VideoEmbed({ video }: { video: VideoRef }) {
  const { t } = useI18n();
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
    video.videoId,
  )}?rel=0&modestbranding=1`;
  const watchUrl = `https://www.youtube-nocookie.com/watch?v=${encodeURIComponent(
    video.videoId,
  )}`;

  return (
    <figure className="video">
      <div className="video__frame">
        <iframe
          src={src}
          title={video.title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <figcaption className="video__caption">
        {video.title}
        {video.note ? ` (${video.note})` : ""}. {t.video.captionNote}{" "}
        <a href={watchUrl} target="_blank" rel="noopener noreferrer">
          {t.video.openNewTab}
        </a>
      </figcaption>
    </figure>
  );
}
