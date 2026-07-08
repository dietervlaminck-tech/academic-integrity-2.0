import { useI18n, type Lang } from "./i18n";
import { useProgress } from "./state/useProgress";
import { ProgressRail } from "./components/ProgressRail";
import { StartScreen } from "./screens/StartScreen";
import { RoomScreen } from "./screens/RoomScreen";
import { CertificateScreen } from "./screens/CertificateScreen";
import type { Room } from "./state/progress";

// Router + progress guard. The screen shown is driven entirely by progress.current, which
// is persisted, so a reload resumes exactly where the player left off.

function Screen({ room }: { room: Room }) {
  if (room === "START") return <StartScreen />;
  if (room === "ESCAPED") return <CertificateScreen />;
  return <RoomScreen room={room} />;
}

function LangSwitch() {
  const { t, lang, setLang } = useI18n();
  const langs: Lang[] = ["en", "nl"];
  return (
    <div role="group" aria-label={t.lang.label} className="app__topbar-actions">
      {langs.map((code) => (
        <button
          key={code}
          type="button"
          className="btn btn--ghost"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {t.lang[code]}
        </button>
      ))}
    </div>
  );
}

export function App() {
  const { t } = useI18n();
  const { state, resetAll } = useProgress();
  const inRoom = state.current !== "START" && state.current !== "ESCAPED";

  return (
    <div className="app">
      <header className="app__topbar">
        <span className="app__brand">{t.app.brand}</span>
        <div className="app__topbar-actions">
          <LangSwitch />
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              if (window.confirm(t.reset.confirmAll)) resetAll();
            }}
          >
            {t.reset.all}
          </button>
        </div>
      </header>

      <main className="app__main">
        {inRoom && <ProgressRail />}
        {/* Key by room so navigating remounts the screen and no per-room UI state
            (a gate's typed code, the puzzle's progress) leaks across rooms. The keyed
            wrapper also plays the doorway transition on every room change. */}
        <div key={state.current} className="room-enter">
          <Screen room={state.current} />
        </div>
      </main>

      <footer className="app__footer">{t.app.footerPayoff}</footer>
    </div>
  );
}
