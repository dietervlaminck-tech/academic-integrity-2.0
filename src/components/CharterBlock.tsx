import { useI18n } from "../i18n";

// The Room 5 charter: one sentence, stored locally, shown on the certificate. Used by
// both the reading view (RoomScreen) and the Door scene's "wall of fame" panel.

export function CharterBlock({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="charter">
      <label htmlFor="charter" className="room__eyebrow">
        {t.charter.heading}
      </label>
      <p className="charter__prompt">{t.charter.prompt}</p>
      <textarea
        id="charter"
        className="charter__input"
        rows={3}
        value={value}
        placeholder={t.charter.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="video__caption">{t.charter.example}</p>
    </div>
  );
}
