import { useI18n } from "../i18n";
import { isCleared, isUnlocked, ROOMS, type Room } from "../state/progress";
import { useProgress } from "../state/useProgress";

// The gated rooms shown as a progress rail. Unlocked rooms are navigable; cleared rooms
// are marked done; the current room is highlighted.
const RAIL_ROOMS: Room[] = ROOMS.filter(
  (r) => r !== "START" && r !== "ESCAPED",
) as Room[];

export function ProgressRail() {
  const { t } = useI18n();
  const { state, goTo } = useProgress();

  return (
    <nav aria-label={t.rail.label}>
      <ol className="rail">
        {RAIL_ROOMS.map((room) => {
          const unlocked = isUnlocked(state, room);
          const done = isCleared(state, room);
          const current = state.current === room;
          const cls =
            "rail__item" +
            (done ? " rail__item--done" : "") +
            (current ? " rail__item--current" : "");
          return (
            <li key={room}>
              <button
                type="button"
                className={cls}
                disabled={!unlocked}
                aria-current={current ? "step" : undefined}
                onClick={() => goTo(room)}
              >
                {t.rooms[room]}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
