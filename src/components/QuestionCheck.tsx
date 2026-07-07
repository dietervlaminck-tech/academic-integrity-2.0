import { useState } from "react";
import { fmt, useI18n } from "../i18n";
import {
  correctOptionIndex,
  evaluateCheck,
  isOptionCorrect,
  type CheckQuestion,
} from "../game/questionCheck";

// Room 2 two-question comprehension check tied to the reasoning-LLMs video (blueprint 4.2
// item 3). Formative: it gives feedback but does not gate progression. Keyboard-operable;
// answered options use aria-disabled (not the disabled attribute) so focus is never lost,
// and each question's feedback plus the summary live in persistent aria-live regions.

export function QuestionCheck({ questions }: { questions: CheckQuestion[] }) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const result = evaluateCheck(answers, questions);
  const allAnswered = Object.keys(answers).length === questions.length;

  function pick(qid: string, index: number) {
    setAnswers((prev) => (prev[qid] !== undefined ? prev : { ...prev, [qid]: index }));
  }

  return (
    <section className="qcheck" aria-labelledby="qcheck-heading">
      <h3 id="qcheck-heading">{t.check.heading}</h3>
      <p className="tp__question">{t.check.intro}</p>

      {questions.map((q, qi) => {
        const picked = answers[q.id];
        const answered = picked !== undefined;
        const correctIdx = correctOptionIndex(q);
        const gotIt = answered && isOptionCorrect(q, picked);
        return (
          <div className="qcheck__q" key={q.id}>
            <p className="room__eyebrow">
              {fmt(t.check.question, { n: qi + 1, total: questions.length })}
            </p>
            <p className="qcheck__prompt">{q.prompt}</p>
            <div className="tp__choices" role="group" aria-label={q.prompt}>
              {q.options.map((opt, oi) => {
                let cls = "tp__choice";
                if (answered) {
                  if (oi === correctIdx) cls += " tp__choice--correct";
                  else if (oi === picked) cls += " tp__choice--wrong";
                }
                return (
                  <button
                    key={opt.text}
                    type="button"
                    className={cls}
                    aria-pressed={oi === picked}
                    aria-disabled={answered}
                    onClick={() => pick(q.id, oi)}
                  >
                    <span>{opt.text}</span>
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
              {answered ? (gotIt ? t.check.correct : t.check.incorrect) : ""}
            </p>
          </div>
        );
      })}

      <p className="gate__msg gate__msg--ok" role="status" aria-live="polite">
        {allAnswered
          ? result.allCorrect
            ? t.check.allCorrect
            : fmt(t.check.summary, { correct: result.correct, total: result.total })
          : ""}
      </p>
    </section>
  );
}
