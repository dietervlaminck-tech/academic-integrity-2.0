import { useI18n } from "../i18n";
import { machineRoomCheck, roomContent } from "../content/rooms";
import { hints as puzzleHints } from "../content/puzzles";
import { RoomShell } from "../components/RoomShell";
import { QuestionCheck } from "../components/QuestionCheck";
import { TokenPredictor } from "../components/TokenPredictor";
import { SourceChecker } from "../components/SourceChecker";
import { AlignmentBuilder } from "../components/AlignmentBuilder";
import { Crossword } from "../components/Crossword";
import { ExternalEmbed } from "../components/ExternalEmbed";
import { CodeGate } from "../components/CodeGate";
import { HintButton } from "../components/HintButton";
import { isCleared, nextRoom, type Room } from "../state/progress";
import { useProgress } from "../state/useProgress";

export function RoomScreen({ room }: { room: Room }) {
  const { t } = useI18n();
  const { state, submitCode, goTo, resetRoom, setCharter } = useProgress();
  const content = roomContent(room);
  if (!content) return null;

  const cleared = isCleared(state, room);
  const next = nextRoom(room);
  const hintTriple = content.hintKey ? puzzleHints[content.hintKey] : null;

  if (cleared) {
    return (
      <RoomShell content={content} cleared>
        <div className="note">
          <p>{content.gateRevealText}</p>
        </div>
        <div className="tp__actions">
          {next && (
            <button
              type="button"
              className="btn btn--accent"
              onClick={() => goTo(next)}
            >
              {t.nav.continue}
            </button>
          )}
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              if (window.confirm(t.reset.confirmRoom)) resetRoom(room);
            }}
          >
            {t.reset.room}
          </button>
        </div>
      </RoomShell>
    );
  }

  return (
    <RoomShell content={content}>
      {room === "LIBRARY" && (
        <>
          {content.activityEmbed && (
            <>
              <ExternalEmbed
                src={content.activityEmbed.src}
                title={content.activityEmbed.title}
              />
              <p className="tp__question">{t.crossword.orSolveHere}</p>
            </>
          )}
          <Crossword />
        </>
      )}

      {room === "MACHINE_ROOM" && (
        <>
          <QuestionCheck questions={machineRoomCheck} />
          <TokenPredictor />
        </>
      )}

      {room === "STUDY" && <SourceChecker />}

      {room === "WORKSHOP" && <AlignmentBuilder />}

      {room === "DOOR" && (
        <div>
          <label htmlFor="charter" className="room__eyebrow">
            {t.rooms.DOOR}
          </label>
          <textarea
            id="charter"
            className="gate__input"
            style={{ letterSpacing: "normal", textTransform: "none", width: "100%", minHeight: "4rem" }}
            value={state.charter}
            onChange={(e) => setCharter(e.target.value)}
          />
        </div>
      )}

      <CodeGate onSubmit={(code) => submitCode(room, code)} />
      {hintTriple && <HintButton hints={hintTriple} />}
    </RoomShell>
  );
}
