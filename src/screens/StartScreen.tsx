import { useState } from "react";
import { useI18n } from "../i18n";
import { startLetter } from "../content/rooms";
import { NarrativeSections } from "../components/NarrativeSections";
import { RoomIllustration } from "../components/RoomIllustration";
import { useProgress } from "../state/useProgress";

export function StartScreen() {
  const { t } = useI18n();
  const { state, start } = useProgress();
  const [name, setName] = useState(state.playerName);

  return (
    <article className="card">
      <p className="room__eyebrow">{t.app.tagline}</p>
      <h1>{t.app.brand}</h1>
      <div className="room__title-rule" aria-hidden="true" />

      <RoomIllustration room="START" />

      <NarrativeSections sections={startLetter} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          start(name);
        }}
      >
        <label htmlFor="player-name" className="room__eyebrow">
          {t.start.namePrompt}
        </label>
        <div className="gate__row">
          <input
            id="player-name"
            className="gate__input"
            style={{ letterSpacing: "normal", textTransform: "none" }}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.start.namePlaceholder}
            autoComplete="off"
          />
          <button type="submit" className="btn btn--accent">
            {t.start.begin}
          </button>
        </div>
        <p className="video__caption">{t.start.nameHelp}</p>
      </form>
    </article>
  );
}
