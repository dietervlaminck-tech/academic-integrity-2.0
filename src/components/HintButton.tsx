import { useState } from "react";
import { fmt, useI18n } from "../i18n";

// Progressive hints: revealed one at a time. The final hint is the answer, so it is only
// reachable after stepping through the earlier hints (per the "no bypass" guardrail).

export function HintButton({ hints }: { hints: readonly [string, string, string] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(0);

  const total = hints.length;
  const canRevealMore = revealed < total;

  return (
    <div className="hint">
      <button
        type="button"
        className="btn btn--secondary"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? t.hint.hide : t.hint.button}
      </button>

      {open && (
        <div>
          <p className="hint__intro sr-only">{t.hint.intro}</p>
          <ol className="hint__list">
            {hints.slice(0, revealed).map((hint, i) => {
              const isAnswer = i === total - 1;
              return (
                <li
                  key={i}
                  className={`hint__item${isAnswer ? " hint__item--answer" : ""}`}
                >
                  {isAnswer && (
                    <strong>{t.hint.answerBadge}: </strong>
                  )}
                  {hint}
                </li>
              );
            })}
          </ol>
          {canRevealMore && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setRevealed((n) => Math.min(n + 1, total))}
            >
              {fmt(t.hint.reveal, { n: revealed + 1, total })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
