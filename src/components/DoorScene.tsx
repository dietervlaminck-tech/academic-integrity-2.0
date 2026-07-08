import { fmt, useI18n } from "../i18n";
import { doorScene } from "../content/rooms";
import { RoomScene, sectionsForPanel, type SceneHotspot, type ScenePanelProps } from "./RoomScene";
import { NarrativeSections } from "./NarrativeSections";
import { PuzzleIntro } from "./PuzzleIntro";
import { CharterBlock } from "./CharterBlock";
import { CodeGate } from "./CodeGate";
import { HintButton } from "./HintButton";

// The Door as an explorable scene: the letter (the recap that hands over the final
// word), the wall of fame (the charter) and the lock (gate). The charter is deliberate
// reflection, not a test: its panel completes on opening.

type DoorSceneProps = ScenePanelProps & {
  charter: string;
  onCharterChange: (value: string) => void;
};

const POS: Record<string, { x: number; y: number }> = {
  letter: { x: 50, y: 84 },
  wall: { x: 81, y: 42 },
  lock: { x: 58, y: 55 },
};

function SceneArt() {
  return (
    <svg viewBox="0 0 960 540" aria-hidden="true" focusable="false">
      {/* wall and floor */}
      <rect width="960" height="540" fill="#e7ebf1" />
      <rect y="400" width="960" height="140" fill="#d6dce4" />
      <rect y="396" width="960" height="8" fill="#c3ccd8" />
      {/* the castle door */}
      <path d="M380 440 V180 a100 100 0 0 1 200 0 v260 z" fill="#355071" />
      <path d="M392 440 V184 a88 88 0 0 1 176 0 v256 z" fill="#5d7291" />
      <line x1="480" y1="98" x2="480" y2="440" stroke="#355071" strokeWidth="5" />
      {/* plank lines */}
      <line x1="424" y1="130" x2="424" y2="440" stroke="#355071" strokeWidth="3" opacity="0.6" />
      <line x1="452" y1="106" x2="452" y2="440" stroke="#355071" strokeWidth="3" opacity="0.6" />
      <line x1="508" y1="106" x2="508" y2="440" stroke="#355071" strokeWidth="3" opacity="0.6" />
      <line x1="536" y1="130" x2="536" y2="440" stroke="#355071" strokeWidth="3" opacity="0.6" />
      {/* hinges */}
      <rect x="392" y="220" width="40" height="12" rx="6" fill="#2c435f" />
      <rect x="392" y="340" width="40" height="12" rx="6" fill="#2c435f" />
      {/* the lock */}
      <rect x="522" y="278" width="44" height="52" rx="8" fill="#2c435f" />
      <circle cx="544" cy="298" r="8" fill="#f0f2f5" />
      <rect x="540" y="298" width="8" height="18" rx="4" fill="#f0f2f5" />
      {/* the letter on the floor */}
      <rect x="440" y="452" width="80" height="52" rx="4" fill="#ffffff" stroke="#c3ccd8" strokeWidth="3" transform="rotate(-6 440 452)" />
      <path d="M440 452 l40 24 l40 -24" fill="none" stroke="#c3ccd8" strokeWidth="3" transform="rotate(-6 440 452)" />
      {/* the wall of fame: name plaques */}
      <rect x="700" y="150" width="180" height="180" rx="8" fill="#5d7291" />
      <rect x="716" y="166" width="66" height="34" rx="4" fill="#f0f2f5" />
      <rect x="798" y="166" width="66" height="34" rx="4" fill="#ffffff" />
      <rect x="716" y="212" width="66" height="34" rx="4" fill="#ffffff" />
      <rect x="798" y="212" width="66" height="34" rx="4" fill="#f0f2f5" />
      <rect x="716" y="258" width="66" height="34" rx="4" fill="#ffffff" />
      <rect x="798" y="258" width="66" height="34" rx="4" fill="#f0f2f5" />
      <rect x="726" y="180" width="46" height="5" rx="2.5" fill="#5d7291" />
      <rect x="808" y="180" width="46" height="5" rx="2.5" fill="#c3ccd8" />
      <rect x="726" y="226" width="46" height="5" rx="2.5" fill="#c3ccd8" />
      <rect x="808" y="226" width="46" height="5" rx="2.5" fill="#5d7291" />
      {/* torch sconces */}
      <rect x="300" y="180" width="14" height="44" rx="6" fill="#2c435f" />
      <circle cx="307" cy="170" r="12" fill="#c3ccd8" />
      <rect x="646" y="180" width="14" height="44" rx="6" fill="#2c435f" />
      <circle cx="653" cy="170" r="12" fill="#c3ccd8" />
      {/* rug */}
      <ellipse cx="480" cy="500" rx="180" ry="24" fill="#c9d2dd" />
    </svg>
  );
}

export function DoorScene({
  content,
  onGateSubmit,
  hints,
  charter,
  onCharterChange,
}: DoorSceneProps) {
  const { t } = useI18n();

  const hotspots: SceneHotspot[] = doorScene.map((h) => ({
    id: h.id,
    title: h.title,
    pos: POS[h.id]!,
    completeOnOpen: h.kind === "intro" || h.kind === "charter",
    render: () => {
      switch (h.kind) {
        case "charter":
          return (
            <>
              {content.puzzleIntro && <PuzzleIntro paragraphs={content.puzzleIntro} />}
              <CharterBlock value={charter} onChange={onCharterChange} />
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
      label={fmt(t.scene.regionLabel, { room: t.rooms.DOOR })}
      art={<SceneArt />}
      hotspots={hotspots}
    />
  );
}
