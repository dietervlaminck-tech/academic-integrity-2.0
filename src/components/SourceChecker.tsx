import { useEffect, useRef, useState } from "react";
import { fmt, useI18n } from "../i18n";
import {
  evaluateSources,
  isSourceCorrect,
  SOURCE_CATEGORIES,
  SOURCE_PASS_THRESHOLD,
  sourceItems,
  type SourceCategory,
} from "../game/sourceChecker";

// Room 3 puzzle. Classify each of five references. Picking a category locks that item and
// reveals whether it was correct plus a verbatim justification (the "no bypass" guardrail:
// the reasoning is always shown). Four or more correct reveals the gate code CONTEXT.
// Keyboard-operable via aria-disabled (answered buttons keep focus).

export function SourceChecker({ onSolved }: { onSolved?: (code: string) => void }) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<string, SourceCategory>>({});
  const solvedFired = useRef(false);

  const result = evaluateSources(answers);
  const allAnswered = Object.keys(answers).length === sourceItems.length;

  useEffect(() => {
    if (allAnswered && result.passed && result.code && !solvedFired.current) {
      solvedFired.current = true;
      onSolved?.(result.code);
    }
  }, [allAnswered, result.passed, result.code, onSolved]);

  function pick(id: string, category: SourceCategory) {
    setAnswers((prev) => (prev[id] !== undefined ? prev : { ...prev, [id]: category }));
  }

  function reset() {
    setAnswers({});
    solvedFired.current = false;
  }

  return (
    <section className="src" aria-labelledby="src-h">
      <h3 id="src-h">{t.source.heading}</h3>
      <p className="tp__question">{t.source.intro}</p>
      <p className="room__eyebrow" role="status" aria-live="polite">
        {fmt(t.source.progress, { correct: result.correct, total: result.total })}
      </p>

      {allAnswered && result.passed && result.code && (
        <p className="note cw__callout">
          {fmt(t.source.passCallout, { code: result.code })}
        </p>
      )}
      {allAnswered && !result.passed && (
        <div className="tp__actions">
          <p className="gate__msg gate__msg--error">
            {fmt(t.source.failNote, {
              threshold: SOURCE_PASS_THRESHOLD,
              total: result.total,
            })}
          </p>
          <button type="button" className="btn btn--primary" onClick={reset}>
            {t.source.retry}
          </button>
        </div>
      )}

      {sourceItems.map((item, i) => {
        const picked = answers[item.id];
        const answered = picked !== undefined;
        const gotIt = answered && isSourceCorrect(item, picked);
        const refLabel = fmt(t.source.referenceLabel, { num: i + 1 });
        return (
          <div className="src__item" key={item.id}>
            <p className="room__eyebrow">{refLabel}</p>
            <p className="src__ref">
              <code>{item.reference}</code>
            </p>
            <div className="tp__choices src__cats" role="group" aria-label={refLabel}>
              {SOURCE_CATEGORIES.map((cat) => {
                let cls = "tp__choice";
                if (answered) {
                  if (cat === item.category) cls += " tp__choice--correct";
                  else if (cat === picked) cls += " tp__choice--wrong";
                }
                return (
                  <button
                    key={cat}
                    type="button"
                    className={cls}
                    aria-pressed={cat === picked}
                    aria-disabled={answered}
                    onClick={() => pick(item.id, cat)}
                  >
                    <span>{t.source.categories[cat]}</span>
                  </button>
                );
              })}
            </div>
            <p
              className={
                answered
                  ? gotIt
                    ? "gate__msg gate__msg--ok"
                    : "gate__msg gate__msg--error"
                  : "gate__msg"
              }
              role="status"
              aria-live="polite"
            >
              {answered ? (gotIt ? t.source.correct : t.source.incorrect) : ""}
            </p>
            {answered && <div className="tp__explanation">{item.justification}</div>}
          </div>
        );
      })}
    </section>
  );
}
