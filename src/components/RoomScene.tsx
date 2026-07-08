import { useEffect, useRef, useState, type ReactNode } from "react";
import { fmt, useI18n } from "../i18n";
import type { RoomContent, Section } from "../content/rooms";

// Generic explorable-room renderer shared by all five scenes. A room supplies its SVG
// art and a list of hotspots; this component owns the interaction model:
//
// - Linear design: a hotspot unlocks only when every hotspot before it is completed.
//   Theory panels complete on opening (completeOnOpen); puzzle panels call `complete`
//   from their own win callbacks. Locked hotspots stay visible (grey, aria-disabled,
//   no-op) so the path is legible; completed ones show a checkmark; the current step
//   carries the single golden accent.
// - Panels stay mounted while hidden so puzzle state survives closing and reopening.
// - Escape closes the panel and focus returns to the hotspot that opened it.

export type SceneHotspot = {
  id: string;
  title: string;
  /** Position as percentages of the scene box (matches the art's viewBox). */
  pos: { x: number; y: number };
  /** Theory/narrative panels: completing them means opening them. */
  completeOnOpen?: boolean;
  /** Panel content; call `complete` when this hotspot's task is done. */
  render: (complete: () => void) => ReactNode;
};

/** Props shared by every per-room scene component. */
export type ScenePanelProps = {
  content: RoomContent;
  /** Returns true when the code opens the gate (wired to the progress machine). */
  onGateSubmit: (code: string) => boolean;
  hints: readonly [string, string, string] | null;
};

/** The room's intro sections for a panel, minus a heading that would repeat its title. */
export function sectionsForPanel(
  intro: Section[],
  indices: number[] | undefined,
  title: string,
): Section[] {
  return (indices ?? [])
    .map((i) => intro[i])
    .filter((s): s is Section => Boolean(s))
    .map((s) => ("heading" in s && s.heading === title ? { ...s, heading: undefined } : s));
}

/**
 * Shared scene backdrop: castle wall with stone coursing, a soft light glow, and a
 * floor with boards. Every room's art starts with this so the castle feels like one
 * building. Rendered inside the scene's <svg viewBox="0 0 960 540">.
 */
export function SceneBackdrop() {
  return (
    <>
      <defs>
        <radialGradient id="scene-glow" cx="50%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="65%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="scene-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdd4de" />
          <stop offset="100%" stopColor="#dfe4ea" />
        </linearGradient>
      </defs>
      <rect width="960" height="540" fill="#e7ebf1" />
      {/* stone coursing on the wall */}
      <g stroke="#dde2ea" strokeWidth="2">
        <line x1="0" y1="120" x2="960" y2="120" />
        <line x1="0" y1="220" x2="960" y2="220" />
        <line x1="0" y1="320" x2="960" y2="320" />
        <line x1="240" y1="120" x2="240" y2="220" />
        <line x1="720" y1="120" x2="720" y2="220" />
        <line x1="480" y1="220" x2="480" y2="320" />
      </g>
      <rect width="960" height="540" fill="url(#scene-glow)" />
      <rect y="400" width="960" height="140" fill="url(#scene-floor)" />
      <rect y="396" width="960" height="8" fill="#c3ccd8" />
      {/* floor boards */}
      <g stroke="#c9d0da" strokeWidth="2">
        <line x1="0" y1="448" x2="960" y2="448" />
        <line x1="0" y1="498" x2="960" y2="498" />
      </g>
    </>
  );
}

export function RoomScene({
  label,
  art,
  hotspots,
}: {
  label: string;
  art: ReactNode;
  hotspots: SceneHotspot[];
}) {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const hotspotRefs = useRef(new Map<string, HTMLButtonElement>());
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const firstIncomplete = hotspots.findIndex((h) => !completed.has(h.id));
  const nextIndex = firstIncomplete === -1 ? null : firstIncomplete;
  const isUnlocked = (index: number) => nextIndex === null || index <= nextIndex;

  function complete(id: string) {
    setCompleted((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }

  function open(hotspot: SceneHotspot, index: number) {
    if (!isUnlocked(index)) return;
    lastActive.current = hotspot.id;
    if (hotspot.completeOnOpen) complete(hotspot.id);
    setActive(hotspot.id);
  }

  function close() {
    setActive(null);
    const id = lastActive.current;
    if (id) hotspotRefs.current.get(id)?.focus();
  }

  useEffect(() => {
    if (active) dialogRef.current?.focus();
  }, [active]);

  // Subtle depth: the stage tilts a few degrees toward the pointer. The transform is
  // applied only under (hover: hover) and (prefers-reduced-motion: no-preference), so
  // touch and reduced-motion users get a static scene.
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--tilt-x", String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty("--tilt-y", String((e.clientY - r.top) / r.height - 0.5));
  }

  function resetTilt() {
    const el = stageRef.current;
    el?.style.setProperty("--tilt-x", "0");
    el?.style.setProperty("--tilt-y", "0");
  }

  return (
    <section className="scene-wrap" aria-label={label}>
      <p className="tp__question">{t.scene.hint}</p>

      <div className="scene">
        <div
          className="scene__stage"
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
        >
          {art}
        {hotspots.map((hotspot, i) => {
          const done = completed.has(hotspot.id);
          const unlocked = isUnlocked(i);
          const isNext = i === nextIndex;
          const ariaLabel = fmt(
            !unlocked
              ? t.scene.hotspotLocked
              : done
                ? t.scene.hotspotVisited
                : t.scene.hotspot,
            { num: i + 1, title: hotspot.title },
          );
          return (
            <button
              key={hotspot.id}
              ref={(el) => {
                if (el) hotspotRefs.current.set(hotspot.id, el);
              }}
              type="button"
              className={
                "hotspot" +
                (isNext ? " hotspot--next" : "") +
                (done ? " hotspot--visited" : "") +
                (!unlocked ? " hotspot--locked" : "")
              }
              style={{ left: `${hotspot.pos.x}%`, top: `${hotspot.pos.y}%` }}
              aria-label={ariaLabel}
              aria-haspopup="dialog"
              aria-disabled={!unlocked}
              onClick={() => open(hotspot, i)}
            >
              <span className="hotspot__badge" aria-hidden="true">
                {done ? "✓" : i + 1}
              </span>
              <span className="hotspot__label" aria-hidden="true">
                {hotspot.title}
              </span>
            </button>
          );
        })}
        </div>
      </div>

      {/* Panels stay mounted so puzzle progress survives closing a panel. */}
      {hotspots.map((hotspot) => {
        const isActive = active === hotspot.id;
        return (
          <div
            key={hotspot.id}
            className="scenepanel__backdrop"
            hidden={!isActive}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div
              ref={isActive ? dialogRef : undefined}
              role="dialog"
              aria-modal="true"
              aria-label={hotspot.title}
              className="scenepanel"
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") close();
              }}
            >
              <header className="scenepanel__header">
                <h3>{hotspot.title}</h3>
                <button type="button" className="btn btn--secondary" onClick={close}>
                  {t.scene.close}
                </button>
              </header>
              <div className="scenepanel__body">{hotspot.render(() => complete(hotspot.id))}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
