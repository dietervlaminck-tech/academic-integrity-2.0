import { fmt, useI18n } from "../i18n";
import { completionCode } from "../state/progress";
import { useProgress } from "../state/useProgress";

// Terminal screen (ESCAPED). Renders a non-personalised certificate with a deterministic
// completion code the player pastes into Canvas. Print-friendly (see @media print).

function completionDate(iso: string | undefined): string {
  const d = iso ? new Date(iso) : new Date();
  const valid = Number.isNaN(d.getTime()) ? new Date() : d;
  return valid.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function CertificateScreen() {
  const { t } = useI18n();
  const { state, resetAll } = useProgress();

  const name = state.playerName.trim() || t.certificate.anonymous;
  const date = completionDate(state.clearedAt.DOOR);
  const code = completionCode(state.playerName.trim(), date);

  return (
    <article className="card certificate">
      <p className="room__eyebrow">{t.certificate.eyebrow}</p>
      <h1>{t.certificate.title}</h1>
      <div className="room__title-rule" aria-hidden="true" />

      <p>{fmt(t.certificate.body, { name })}</p>

      {state.charter.trim() && (
        <blockquote className="note">
          <p className="room__eyebrow">{t.certificate.charterLabel}</p>
          <p>{state.charter.trim()}</p>
        </blockquote>
      )}

      <div className="tp__stem">
        <span className="room__eyebrow">{t.certificate.codeLabel}</span>
        <div className="tp__result-score">{code}</div>
        <p className="video__caption">{t.certificate.codeHelp}</p>
      </div>

      <p className="video__caption">{date}</p>
      <p className="note">{t.certificate.disclaimer}</p>

      <div className="tp__actions no-print">
        <button type="button" className="btn btn--accent" onClick={() => window.print()}>
          {t.certificate.print}
        </button>
        <button type="button" className="btn btn--secondary" onClick={resetAll}>
          {t.certificate.replay}
        </button>
      </div>
    </article>
  );
}
