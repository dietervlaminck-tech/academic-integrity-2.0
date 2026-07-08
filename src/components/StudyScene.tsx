import { fmt, useI18n } from "../i18n";
import { studyScene } from "../content/rooms";
import {
  RoomScene,
  SceneBackdrop,
  sectionsForPanel,
  type SceneHotspot,
  type ScenePanelProps,
} from "./RoomScene";
import { NarrativeSections } from "./NarrativeSections";
import { PuzzleIntro } from "./PuzzleIntro";
import { SourceChecker } from "./SourceChecker";
import { CodeGate } from "./CodeGate";
import { HintButton } from "./HintButton";

// The Study as an explorable scene: Plesman's notebook (narrative + detection theory),
// the top-left drawer (Memphis and the integrity conversation), the bottom-right drawer
// (the flying game), the pile of paperwork (SourceChecker) and the desk drawer (gate).
// The reference check completes when it is passed (>= 4 of 5).

const POS: Record<string, { x: number; y: number }> = {
  notebook: { x: 38, y: 50 },
  topdrawer: { x: 27, y: 67 },
  bottomdrawer: { x: 70, y: 79 },
  paperwork: { x: 63, y: 46 },
  deskdrawer: { x: 49, y: 68 },
};

function SceneArt() {
  return (
    <svg viewBox="0 0 960 540" aria-hidden="true" focusable="false">
      <SceneBackdrop />
      {/* grounding shadow under the desk */}
      <ellipse cx="460" cy="492" rx="230" ry="12" fill="#b9c2cf" opacity="0.5" />
      {/* arched window, left */}
      <path d="M100 300 v-140 a70 70 0 0 1 140 0 v140 z" fill="#5d7291" />
      <path d="M110 292 v-132 a60 60 0 0 1 120 0 v132 z" fill="#f0f2f5" />
      <rect x="166" y="160" width="8" height="132" fill="#5d7291" />
      <rect x="110" y="222" width="120" height="8" fill="#5d7291" />
      {/* portrait frame, right wall */}
      <rect x="760" y="130" width="110" height="140" rx="6" fill="#ffffff" stroke="#5d7291" strokeWidth="4" />
      <circle cx="815" cy="180" r="26" fill="#c3ccd8" />
      <path d="M778 258 a38 30 0 0 1 74 0 z" fill="#c3ccd8" />
      {/* the antique desk */}
      <rect x="240" y="330" width="440" height="20" rx="4" fill="#355071" />
      {/* drawer stacks */}
      <rect x="252" y="350" width="130" height="80" fill="#2c435f" />
      <rect x="262" y="358" width="110" height="28" rx="3" fill="#5d7291" />
      <rect x="262" y="392" width="110" height="28" rx="3" fill="#5d7291" />
      <circle cx="317" cy="372" r="4" fill="#f0f2f5" />
      <circle cx="317" cy="406" r="4" fill="#f0f2f5" />
      <rect x="538" y="350" width="130" height="80" fill="#2c435f" />
      <rect x="548" y="358" width="110" height="28" rx="3" fill="#5d7291" />
      <rect x="548" y="392" width="110" height="28" rx="3" fill="#5d7291" />
      <circle cx="603" cy="372" r="4" fill="#f0f2f5" />
      <circle cx="603" cy="406" r="4" fill="#f0f2f5" />
      {/* centre drawer with keyhole */}
      <rect x="392" y="352" width="136" height="34" rx="4" fill="#5d7291" />
      <circle cx="460" cy="369" r="6" fill="#2c435f" />
      <rect x="457" y="369" width="6" height="10" fill="#2c435f" />
      {/* open notebook on the desk */}
      <path d="M300 310 l60 -14 l60 14 z" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      <path d="M300 310 l60 -14 v6 l-60 14 z" fill="#f0f2f5" />
      <rect x="316" y="300" width="34" height="3" rx="1.5" fill="#c3ccd8" transform="rotate(-12 316 300)" />
      {/* pile of suspiciously well-written paperwork */}
      <rect x="560" y="292" width="90" height="10" rx="2" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      <rect x="566" y="280" width="90" height="10" rx="2" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      <rect x="558" y="268" width="90" height="10" rx="2" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      <rect x="564" y="256" width="90" height="10" rx="2" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      {/* desk lamp */}
      <rect x="420" y="268" width="8" height="46" fill="#2c435f" />
      <path d="M400 268 h48 l-10 -18 h-28 z" fill="#355071" />
      {/* desk legs */}
      <rect x="260" y="430" width="16" height="60" fill="#2c435f" />
      <rect x="644" y="430" width="16" height="60" fill="#2c435f" />
      {/* rug */}
      <ellipse cx="460" cy="496" rx="220" ry="26" fill="#c9d2dd" />
    </svg>
  );
}

export function StudyScene({ content, onGateSubmit, hints }: ScenePanelProps) {
  const { t } = useI18n();

  const hotspots: SceneHotspot[] = studyScene.map((h) => ({
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
              <SourceChecker onSolved={complete} />
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
      label={fmt(t.scene.regionLabel, { room: t.rooms.STUDY })}
      art={<SceneArt />}
      hotspots={hotspots}
    />
  );
}
