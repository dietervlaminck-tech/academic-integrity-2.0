import { useEffect, useId, useRef, useState } from "react";
import { fmt, useI18n } from "../i18n";
import {
  activityCards,
  alignmentChains,
  assessmentCards,
  cardById,
  distractorFeedback,
  evaluateAlignment,
  isCorrectPlacement,
  type Placements,
  type SlotKind,
} from "../game/alignment";

// Room 4 puzzle. For each outcome the player assigns the aligned activity and assessment
// via a select (keyboard-accessible; no drag-and-drop needed). A correct card locks into
// place; a misaligned card is never stored, so the controlled select snaps back to the
// placeholder and an explanation appears. Aligning all three chains reveals ALIGNMENT.

export function AlignmentBuilder({ onSolved }: { onSolved?: (code: string) => void }) {
  const { t } = useI18n();
  const [placements, setPlacements] = useState<Placements>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const baseId = useId();
  const solvedFired = useRef(false);

  const result = evaluateAlignment(placements);

  useEffect(() => {
    if (result.passed && result.code && !solvedFired.current) {
      solvedFired.current = true;
      onSolved?.(result.code);
    }
  }, [result.passed, result.code, onSolved]);

  const usedIds = (kind: SlotKind): Set<string> =>
    new Set(
      Object.values(placements)
        .map((p) => p[kind])
        .filter((id): id is string => Boolean(id)),
    );

  function place(outcomeId: string, kind: SlotKind, cardId: string) {
    if (!cardId) return;
    const chain = alignmentChains.find((c) => c.outcome === outcomeId);
    if (!chain) return;
    const slotKey = `${outcomeId}:${kind}`;
    if (isCorrectPlacement(chain, kind, cardId)) {
      setPlacements((prev) => ({
        ...prev,
        [outcomeId]: { ...prev[outcomeId], [kind]: cardId },
      }));
      setFeedback((prev) => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });
    } else {
      // Misaligned: leave placements untouched (the controlled select snaps back) and
      // explain why.
      setFeedback((prev) => ({
        ...prev,
        [slotKey]: distractorFeedback(cardId) ?? t.alignment.misaligned,
      }));
    }
  }

  const kindLabel = (kind: SlotKind) =>
    kind === "activity" ? t.alignment.activity : t.alignment.assessment;

  function renderSlot(outcomeId: string, num: number, kind: SlotKind) {
    const placedId = placements[outcomeId]?.[kind];
    const slotKey = `${outcomeId}:${kind}`;
    if (placedId) {
      return (
        <div className="al__slot">
          <span className="room__eyebrow">{kindLabel(kind)}</span>
          <p className="al__card al__card--aligned">
            {cardById(placedId)?.text}{" "}
            <span className="cw__solved">{t.alignment.aligned}</span>
          </p>
        </div>
      );
    }
    const cards = kind === "activity" ? activityCards : assessmentCards;
    const used = usedIds(kind);
    const options = cards.filter((c) => !used.has(c.id));
    const selectId = `${baseId}-${outcomeId}-${kind}`;
    return (
      <div className="al__slot">
        <label className="room__eyebrow" htmlFor={selectId}>
          {kindLabel(kind)}
        </label>
        <select
          id={selectId}
          className="al__select"
          value=""
          aria-label={fmt(t.alignment.slotLabel, { kind: kindLabel(kind), num })}
          onChange={(e) => place(outcomeId, kind, e.target.value)}
        >
          <option value="">{t.alignment.choose}</option>
          {options.map((c) => (
            <option key={c.id} value={c.id}>
              {c.text}
            </option>
          ))}
        </select>
        {feedback[slotKey] && (
          <p className="gate__msg gate__msg--error" role="status" aria-live="polite">
            {feedback[slotKey]}
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="al" aria-labelledby={`${baseId}-h`}>
      <h3 id={`${baseId}-h`}>{t.alignment.heading}</h3>
      <p className="tp__question">{t.alignment.intro}</p>
      <p className="room__eyebrow" role="status" aria-live="polite">
        {fmt(t.alignment.progress, { completed: result.completed, total: result.total })}
      </p>

      {result.passed && result.code && (
        <p className="note cw__callout">
          {fmt(t.alignment.passCallout, { code: result.code })}
        </p>
      )}

      {alignmentChains.map((chain, i) => {
        const outcome = cardById(chain.outcome);
        const complete =
          placements[chain.outcome]?.activity === chain.activity &&
          placements[chain.outcome]?.assessment === chain.assessment;
        return (
          <div className="al__chain" key={chain.outcome}>
            <div className="al__outcome">
              <span className="room__eyebrow">
                {t.alignment.outcome} {i + 1}
              </span>
              <p>{outcome?.text}</p>
            </div>
            <div className="al__slots">
              {renderSlot(chain.outcome, i + 1, "activity")}
              {renderSlot(chain.outcome, i + 1, "assessment")}
            </div>
            {complete && <div className="tp__explanation">{chain.rationale}</div>}
          </div>
        );
      })}
    </section>
  );
}
