import { fmt, useI18n } from "../i18n";
import { machineRoomCheck, machineRoomScene } from "../content/rooms";
import { RoomScene, sectionsForPanel, type SceneHotspot, type ScenePanelProps } from "./RoomScene";
import { NarrativeSections } from "./NarrativeSections";
import { PuzzleIntro } from "./PuzzleIntro";
import { TokenPredictor } from "./TokenPredictor";
import { QuestionCheck } from "./QuestionCheck";
import { CodeGate } from "./CodeGate";
import { HintButton } from "./HintButton";

// The Machine Room as an explorable scene: machine (theory + video), transformer poster,
// control panel (token game), terminal (reasoning theory + check), maintenance hatch
// (gate). Interaction model and linear unlocking live in RoomScene.

const POS: Record<string, { x: number; y: number }> = {
  machine: { x: 50, y: 47 },
  poster: { x: 20, y: 32 },
  panel: { x: 85, y: 37 },
  terminal: { x: 22, y: 62 },
  hatch: { x: 88, y: 71 },
};

function SceneArt() {
  // Decorative flat-perspective room in the Nyenrode palette. No text, no gold: the
  // single golden accent on this screen is the "next" hotspot badge.
  return (
    <svg viewBox="0 0 960 540" aria-hidden="true" focusable="false">
      {/* wall and floor */}
      <rect width="960" height="540" fill="#e7ebf1" />
      <rect y="400" width="960" height="140" fill="#d6dce4" />
      <rect y="396" width="960" height="8" fill="#c3ccd8" />
      {/* arched window with light */}
      <path d="M600 300 v-140 a70 70 0 0 1 140 0 v140 z" fill="#5d7291" />
      <path d="M610 292 v-132 a60 60 0 0 1 120 0 v132 z" fill="#f0f2f5" />
      <rect x="666" y="160" width="8" height="132" fill="#5d7291" />
      <rect x="610" y="222" width="120" height="8" fill="#5d7291" />
      {/* poster on the left wall: probability bars */}
      <rect x="120" y="118" width="150" height="118" rx="6" fill="#ffffff" stroke="#5d7291" strokeWidth="4" />
      <rect x="140" y="196" width="20" height="24" fill="#355071" />
      <rect x="168" y="176" width="20" height="44" fill="#5d7291" />
      <rect x="196" y="158" width="20" height="62" fill="#355071" />
      <rect x="224" y="188" width="20" height="32" fill="#5d7291" />
      <rect x="140" y="138" width="104" height="10" rx="5" fill="#c3ccd8" />
      {/* desk */}
      <rect x="330" y="330" width="300" height="18" rx="4" fill="#355071" />
      <rect x="346" y="348" width="16" height="66" fill="#2c435f" />
      <rect x="598" y="348" width="16" height="66" fill="#2c435f" />
      {/* the Ghostwriter machine */}
      <rect x="380" y="218" width="200" height="112" rx="10" fill="#355071" />
      <rect x="398" y="236" width="118" height="54" rx="4" fill="#5d7291" />
      <rect x="408" y="248" width="70" height="7" rx="3.5" fill="#f0f2f5" />
      <rect x="408" y="262" width="94" height="7" rx="3.5" fill="#f0f2f5" opacity="0.7" />
      <circle cx="545" cy="252" r="9" fill="#5d7291" />
      <circle cx="545" cy="282" r="9" fill="#5d7291" />
      <rect x="398" y="300" width="164" height="14" rx="4" fill="#2c435f" />
      {/* paper sliding out */}
      <path d="M562 306 h44 l10 14 h-44 z" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      {/* chimney puffs */}
      <rect x="540" y="188" width="12" height="30" fill="#2c435f" />
      <circle cx="548" cy="176" r="8" fill="#c3ccd8" />
      <circle cx="560" cy="162" r="6" fill="#d6dce4" />
      {/* control panel on the right wall */}
      <rect x="742" y="150" width="150" height="120" rx="8" fill="#355071" />
      <circle cx="772" cy="182" r="11" fill="#5d7291" />
      <circle cx="806" cy="182" r="11" fill="#5d7291" />
      <circle cx="840" cy="182" r="11" fill="#5d7291" />
      <rect x="762" y="212" width="110" height="8" rx="4" fill="#5d7291" />
      <rect x="762" y="230" width="110" height="8" rx="4" fill="#5d7291" />
      <circle cx="868" cy="250" r="6" fill="#f0f2f5" />
      {/* terminal on a side table */}
      <rect x="150" y="366" width="124" height="12" rx="3" fill="#355071" />
      <rect x="162" y="378" width="12" height="48" fill="#2c435f" />
      <rect x="250" y="378" width="12" height="48" fill="#2c435f" />
      <rect x="166" y="300" width="92" height="62" rx="6" fill="#2c435f" />
      <rect x="176" y="310" width="72" height="42" rx="3" fill="#5d7291" />
      <circle cx="196" cy="331" r="4" fill="#f0f2f5" />
      <circle cx="212" cy="331" r="4" fill="#f0f2f5" opacity="0.7" />
      <circle cx="228" cy="331" r="4" fill="#f0f2f5" opacity="0.4" />
      {/* maintenance hatch */}
      <rect x="792" y="330" width="112" height="96" rx="8" fill="#5d7291" stroke="#2c435f" strokeWidth="4" />
      <circle cx="848" cy="378" r="20" fill="none" stroke="#2c435f" strokeWidth="6" />
      <rect x="845" y="360" width="6" height="36" fill="#2c435f" />
      <rect x="830" y="375" width="36" height="6" fill="#2c435f" />
      <circle cx="802" cy="340" r="3" fill="#f0f2f5" />
      <circle cx="894" cy="340" r="3" fill="#f0f2f5" />
      <circle cx="802" cy="416" r="3" fill="#f0f2f5" />
      <circle cx="894" cy="416" r="3" fill="#f0f2f5" />
      {/* rug */}
      <ellipse cx="480" cy="472" rx="180" ry="32" fill="#c9d2dd" />
    </svg>
  );
}

export function MachineRoomScene({ content, onGateSubmit, hints }: ScenePanelProps) {
  const { t } = useI18n();

  const hotspots: SceneHotspot[] = machineRoomScene.map((h) => ({
    id: h.id,
    title: h.title,
    pos: POS[h.id]!,
    completeOnOpen: h.kind === "intro",
    render: (complete) => {
      switch (h.kind) {
        case "puzzle":
          return (
            <>
              {content.puzzleIntro && <PuzzleIntro paragraphs={content.puzzleIntro} />}
              <TokenPredictor onSolved={complete} />
            </>
          );
        case "post":
          return (
            <>
              {content.postPuzzle && (
                <NarrativeSections
                  sections={sectionsForPanel(
                    content.postPuzzle,
                    content.postPuzzle.map((_, i) => i),
                    h.title,
                  )}
                />
              )}
              <QuestionCheck questions={machineRoomCheck} onAllAnswered={complete} />
            </>
          );
        case "gate":
          return (
            <>
              <CodeGate onSubmit={onGateSubmit} />
              {hints && <HintButton hints={hints} />}
            </>
          );
        default:
          return (
            <NarrativeSections
              sections={sectionsForPanel(content.intro, h.sections, h.title)}
            />
          );
      }
    },
  }));

  return (
    <RoomScene
      label={fmt(t.scene.regionLabel, { room: t.rooms.MACHINE_ROOM })}
      art={<SceneArt />}
      hotspots={hotspots}
    />
  );
}
