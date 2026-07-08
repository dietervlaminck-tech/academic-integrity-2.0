import { useState } from "react";
import { useI18n } from "../i18n";
import { machineRoomCheck, roomContent } from "../content/rooms";
import { hints as puzzleHints } from "../content/puzzles";
import { RoomShell } from "../components/RoomShell";
import { PuzzleIntro } from "../components/PuzzleIntro";
import { NarrativeSections } from "../components/NarrativeSections";
import { QuestionCheck } from "../components/QuestionCheck";
import { TokenPredictor } from "../components/TokenPredictor";
import { SourceChecker } from "../components/SourceChecker";
import { AlignmentBuilder } from "../components/AlignmentBuilder";
import { Crossword } from "../components/Crossword";
import { CodeGate } from "../components/CodeGate";
import { HintButton } from "../components/HintButton";
import { MachineRoomScene } from "../components/MachineRoomScene";
import { isCleared, nextRoom, type Room } from "../state/progress";
import { useProgress } from "../state/useProgress";
import { loadViewMode, saveViewMode, type ViewMode } from "../state/viewMode";

export function RoomScreen({ room }: { room: Room }) {
  const { t } = useI18n();
  const { state, submitCode, goTo, resetRoom, setCharter } = useProgress();
  const [view, setView] = useState<ViewMode>(() => loadViewMode());
  const content = roomContent(room);
  if (!content) return null;

  const cleared = isCleared(state, room);
  const next = nextRoom(room);
  const hintTriple = (content.hintKey ? puzzleHints[content.hintKey] : null) ?? null;

  // The explorable-scene prototype exists for the Machine Room only. Reading view is
  // the default and the accessibility baseline.
  const sceneCapable = room === "MACHINE_ROOM";
  const sceneOn = sceneCapable && view === "scene" && !cleared;

  function switchView(mode: ViewMode) {
    setView(mode);
    saveViewMode(mode);
  }

  const toolbar =
    sceneCapable && !cleared ? (
      <div className="viewtoggle" role="group" aria-label={t.scene.viewLabel}>
        <button
          type="button"
          className={`btn btn--secondary${view === "scene" ? " viewtoggle--active" : ""}`}
          aria-pressed={view === "scene"}
          onClick={() => switchView("scene")}
        >
          {t.scene.toggleExplore}
        </button>
        <button
          type="button"
          className={`btn btn--secondary${view === "reading" ? " viewtoggle--active" : ""}`}
          aria-pressed={view === "reading"}
          onClick={() => switchView("reading")}
        >
          {t.scene.toggleReading}
        </button>
      </div>
    ) : undefined;

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

  if (sceneOn) {
    return (
      <RoomShell content={content} toolbar={toolbar} sceneMode>
        <MachineRoomScene
          content={content}
          onGateSubmit={(code) => submitCode(room, code)}
          hints={hintTriple}
        />
      </RoomShell>
    );
  }

  return (
    <RoomShell content={content} toolbar={toolbar}>
      {content.puzzleIntro && <PuzzleIntro paragraphs={content.puzzleIntro} />}

      {room === "LIBRARY" && <Crossword />}

      {room === "MACHINE_ROOM" && (
        <>
          <TokenPredictor />
          {content.postPuzzle && <NarrativeSections sections={content.postPuzzle} />}
          <QuestionCheck questions={machineRoomCheck} />
        </>
      )}

      {room === "STUDY" && <SourceChecker />}

      {room === "WORKSHOP" && <AlignmentBuilder />}

      {room === "DOOR" && (
        <div className="charter">
          <label htmlFor="charter" className="room__eyebrow">
            {t.charter.heading}
          </label>
          <p className="charter__prompt">{t.charter.prompt}</p>
          <textarea
            id="charter"
            className="charter__input"
            rows={3}
            value={state.charter}
            placeholder={t.charter.placeholder}
            onChange={(e) => setCharter(e.target.value)}
          />
          <p className="video__caption">{t.charter.example}</p>
        </div>
      )}

      <CodeGate onSubmit={(code) => submitCode(room, code)} />
      {hintTriple && <HintButton hints={hintTriple} />}
    </RoomShell>
  );
}
