import { useEffect, useId, useRef, useState } from "react";
import { fmt, useI18n } from "../i18n";
import {
  crosswordEntries,
  evaluateCrossword,
  isEntrySolved,
  type Direction,
} from "../game/crossword";

// Room 1's primary puzzle: the native crossword. Each clue has its own answer field
// (validated live, uppercased, capped at the answer length), fully keyboard-accessible.
// Solving clue 4 reveals the gate code APA. The identical Interacty version is only an
// optional external link in the room's extras aside.

const DIRECTIONS: Direction[] = ["across", "down"];

export function Crossword({ onSolved }: { onSolved?: (code: string) => void }) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const baseId = useId();
  const solvedFired = useRef(false);

  const result = evaluateCrossword(answers);

  useEffect(() => {
    if (result.gateSolved && result.code && !solvedFired.current) {
      solvedFired.current = true;
      onSolved?.(result.code);
    }
  }, [result.gateSolved, result.code, onSolved]);

  const dirLabel = (dir: Direction) => (dir === "across" ? t.crossword.across : t.crossword.down);

  return (
    <section className="cw" aria-labelledby={`${baseId}-h`}>
      <h3 id={`${baseId}-h`}>{t.crossword.heading}</h3>
      <p className="tp__question">{t.crossword.intro}</p>
      <p className="room__eyebrow" role="status" aria-live="polite">
        {fmt(t.crossword.progress, { solved: result.solved, total: result.total })}
      </p>

      {result.gateSolved && result.code && (
        <p className="note cw__callout">
          {fmt(t.crossword.gateCallout, { code: result.code })}
        </p>
      )}

      {DIRECTIONS.map((dir) => (
        <div className="cw__group" key={dir}>
          <h4>{dirLabel(dir)}</h4>
          <ol className="cw__list">
            {crosswordEntries
              .filter((e) => e.direction === dir)
              .map((entry) => {
                const value = answers[entry.num] ?? "";
                const solved = isEntrySolved(entry, value);
                const inputId = `${baseId}-${entry.num}`;
                return (
                  <li className="cw__clue" key={entry.num}>
                    <span className="cw__num" aria-hidden="true">
                      {entry.num}
                    </span>
                    <div className="cw__body">
                      <label htmlFor={inputId} className="cw__cluetext">
                        {entry.clue}
                      </label>
                      <div className="cw__row">
                        <input
                          id={inputId}
                          className={`cw__input${solved ? " cw__input--solved" : ""}`}
                          type="text"
                          autoCapitalize="characters"
                          autoCorrect="off"
                          spellCheck={false}
                          maxLength={entry.answer.length}
                          readOnly={solved}
                          aria-label={fmt(t.crossword.answerLabel, {
                            num: entry.num,
                            dir: dirLabel(dir),
                            len: entry.answer.length,
                          })}
                          value={value}
                          onChange={(e) =>
                            setAnswers((prev) => ({
                              ...prev,
                              [entry.num]: e.target.value.toUpperCase(),
                            }))
                          }
                        />
                        {solved && (
                          <span className="cw__solved">{t.crossword.solved}</span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
          </ol>
        </div>
      ))}
    </section>
  );
}
