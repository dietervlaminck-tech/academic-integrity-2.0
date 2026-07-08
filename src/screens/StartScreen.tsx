import { useState } from "react";
import { useI18n } from "../i18n";
import { courseGoals, startLetter } from "../content/rooms";
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

      <section aria-labelledby="overview-learn">
        <h2 id="overview-learn" className="overview__heading">
          {t.overview.learnHeading}
        </h2>
        <ol className="goals">
          {courseGoals.map(({ room, goal }) => (
            <li key={room}>
              <strong>{t.rooms[room]}:</strong> {goal}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="overview-how">
        <h2 id="overview-how" className="overview__heading">
          {t.overview.howHeading}
        </h2>
        <ul className="content-list">
          {t.overview.how.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

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
