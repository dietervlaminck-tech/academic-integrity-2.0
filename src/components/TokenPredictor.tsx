import { useMemo, useRef, useState } from "react";
import { fmt, useI18n } from "../i18n";
import {
  RHYME_ROUND_ID,
  TOKEN_PASS_THRESHOLD,
  candidatesByProbability,
  correctIndex,
  evaluateGame,
  isCorrectPick,
  tokenRounds,
  type TokenRound,
} from "../game/tokenGame";

// Room 2 centrepiece. The player predicts the most probable next token for six sentence
// stems. Each pick reveals the hidden probability distribution and a one-line explanation
// of how context shifted it. The rhyme-trap round additionally shows the pattern-machine
// and reasoning-model "voices" side by side. Five of six correct reveals the code TOKEN.

type TokenPredictorProps = {
  /** Fired once, when the player reaches at least the pass threshold. */
  onSolved?: (code: string) => void;
};

function ProbabilityBars({ round }: { round: TokenRound }) {
  const { t } = useI18n();
  const ranked = candidatesByProbability(round);
  const top = ranked[0];
  return (
    <div className="tp__bars" aria-label={t.tp.probabilityHeading}>
      <p className="room__eyebrow">{t.tp.probabilityHeading}</p>
      {ranked.map((cand) => {
        const isTop = top ? cand.text === top.text : false;
        return (
          <div className="tp__bar-row" key={cand.text}>
            <span className="tp__bar-label">{cand.text}</span>
            <span className="tp__bar-track">
              <span
                className={`tp__bar-fill${isTop ? " tp__bar-fill--top" : ""}`}
                style={{ width: `${cand.probability}%` }}
              />
            </span>
            <span className="tp__bar-pct">{cand.probability}%</span>
          </div>
        );
      })}
    </div>
  );
}

function ModelVoices({ round }: { round: TokenRound }) {
  const { t } = useI18n();
  const pattern = round.candidates.find((c) => /pattern/i.test(c.text));
  const reasoning = round.candidates.find((c) => /sensible/i.test(c.text));
  if (!pattern || !reasoning) return null;
  return (
    <div>
      <p className="room__eyebrow">{t.tp.voiceIntro}</p>
      <div className="tp__voices">
        <div className="tp__voice">
          <h4>{t.tp.voicePattern}</h4>
          <p>{pattern.text}</p>
        </div>
        <div className="tp__voice">
          <h4>{t.tp.voiceReasoning}</h4>
          <p>{reasoning.text}</p>
        </div>
      </div>
    </div>
  );
}

export function TokenPredictor({ onSolved }: TokenPredictorProps) {
  const { t } = useI18n();
  const rounds = tokenRounds;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const solvedFired = useRef(false);

  const round = rounds[index];
  const isLast = index === rounds.length - 1;

  const correctSoFar = useMemo(() => {
    let n = 0;
    for (const r of rounds) {
      const pick = answers[r.id];
      if (pick !== undefined && isCorrectPick(r, pick)) n++;
    }
    return n;
  }, [answers, rounds]);

  if (!round) return null;

  const pickedIndex = answers[round.id];
  const answeredCorrectly =
    pickedIndex !== undefined && isCorrectPick(round, pickedIndex);

  function handlePick(choice: number) {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [round!.id]: choice }));
    setRevealed(true);
  }

  function handleNext() {
    if (isLast) {
      const result = evaluateGame(answers, rounds);
      setFinished(true);
      if (result.passed && result.code && !solvedFired.current) {
        solvedFired.current = true;
        onSolved?.(result.code);
      }
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
  }

  function handleRetry() {
    setAnswers({});
    setIndex(0);
    setRevealed(false);
    setFinished(false);
    solvedFired.current = false;
  }

  if (finished) {
    const result = evaluateGame(answers, rounds);
    return (
      <div className="tp__result" role="status">
        <h3>{result.passed ? t.tp.resultPassTitle : t.tp.resultFailTitle}</h3>
        <p className="tp__result-score">
          {fmt(t.tp.resultScore, { correct: result.correct, total: result.total })}
        </p>
        {result.passed ? (
          <>
            <p>{t.tp.resultPass}</p>
            <p className="tp__stem">
              {t.tp.gateReveal} <strong>{result.code}</strong>
            </p>
          </>
        ) : (
          <>
            <p>
              {fmt(t.tp.resultFail, {
                threshold: TOKEN_PASS_THRESHOLD,
                total: result.total,
              })}
            </p>
            <button type="button" className="btn btn--primary" onClick={handleRetry}>
              {t.tp.retry}
            </button>
          </>
        )}
      </div>
    );
  }

  const isRhyme = round.id === RHYME_ROUND_ID;
  const correctIdx = correctIndex(round);

  return (
    <div className="tp">
      <div className="tp__progress">
        <span>{fmt(t.tp.progress, { n: index + 1, total: rounds.length })}</span>
        <span>{fmt(t.tp.scoreSoFar, { correct: correctSoFar })}</span>
      </div>

      <p className="tp__stem">{round.stem}</p>
      <p className="tp__question">{revealed ? t.tp.picked : t.tp.question}</p>

      <div className="tp__choices" role="group" aria-label={t.tp.question}>
        {round.candidates.map((cand, i) => {
          let cls = "tp__choice";
          if (revealed) {
            if (i === correctIdx) cls += " tp__choice--correct";
            else if (i === pickedIndex) cls += " tp__choice--wrong";
          } else if (i === pickedIndex) {
            cls += " tp__choice--picked";
          }
          return (
            <button
              key={cand.text}
              type="button"
              className={cls}
              disabled={revealed}
              aria-pressed={i === pickedIndex}
              onClick={() => handlePick(i)}
            >
              <span>{cand.text}</span>
              {revealed && <span className="tp__bar-pct">{cand.probability}%</span>}
            </button>
          );
        })}
      </div>

      {revealed && (
        <>
          <p
            className={
              answeredCorrectly ? "gate__msg gate__msg--ok" : "gate__msg gate__msg--error"
            }
            role="status"
            aria-live="polite"
          >
            {answeredCorrectly ? t.tp.correct : t.tp.incorrect}
          </p>
          <ProbabilityBars round={round} />
          {isRhyme && <ModelVoices round={round} />}
          <div className="tp__explanation">{round.explanation}</div>
          <div className="tp__actions">
            <button type="button" className="btn btn--accent" onClick={handleNext}>
              {isLast ? t.tp.seeResult : t.tp.nextRound}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
