import { fmt, useI18n } from "../i18n";
import { workshopScene } from "../content/rooms";
import {
  RoomScene,
  SceneBackdrop,
  sectionsForPanel,
  type SceneHotspot,
  type ScenePanelProps,
} from "./RoomScene";
import { NarrativeSections } from "./NarrativeSections";
import { PuzzleIntro } from "./PuzzleIntro";
import { AlignmentBuilder } from "./AlignmentBuilder";
import { CodeGate } from "./CodeGate";
import { HintButton } from "./HintButton";

// The Workshop as an explorable scene: the examiner's cabinet (narrative), its three
// theory drawers, the workbench (AlignmentBuilder) and the locked drawer (gate).
// The alignment builder completes when all three chains are aligned.

const POS: Record<string, { x: number; y: number }> = {
  chest: { x: 29, y: 17 },
  drawer1: { x: 29, y: 34 },
  drawer2: { x: 29, y: 48 },
  drawer3: { x: 29, y: 62 },
  workbench: { x: 74, y: 56 },
  locked: { x: 29, y: 77 },
};

function SceneArt() {
  return (
    <svg viewBox="0 0 960 540" aria-hidden="true" focusable="false">
      <SceneBackdrop />
      {/* grounding shadows */}
      <ellipse cx="280" cy="456" rx="140" ry="11" fill="#b9c2cf" opacity="0.5" />
      <ellipse cx="710" cy="420" rx="180" ry="10" fill="#b9c2cf" opacity="0.5" />
      {/* the examiner's cabinet */}
      <rect x="160" y="70" width="240" height="380" rx="8" fill="#355071" />
      <rect x="172" y="60" width="216" height="18" rx="6" fill="#2c435f" />
      {/* drawer 1 */}
      <rect x="176" y="152" width="208" height="56" rx="4" fill="#5d7291" />
      <rect x="256" y="176" width="48" height="8" rx="4" fill="#f0f2f5" />
      {/* drawer 2 */}
      <rect x="176" y="228" width="208" height="56" rx="4" fill="#5d7291" />
      <rect x="256" y="252" width="48" height="8" rx="4" fill="#f0f2f5" />
      {/* drawer 3 */}
      <rect x="176" y="304" width="208" height="56" rx="4" fill="#5d7291" />
      <rect x="256" y="328" width="48" height="8" rx="4" fill="#f0f2f5" />
      {/* the locked drawer, with padlock */}
      <rect x="176" y="380" width="208" height="56" rx="4" fill="#2c435f" />
      <rect x="264" y="404" width="32" height="22" rx="4" fill="#c3ccd8" />
      <path d="M270 404 v-8 a10 10 0 0 1 20 0 v8" fill="none" stroke="#c3ccd8" strokeWidth="5" />
      {/* the workbench */}
      <rect x="540" y="300" width="340" height="18" rx="4" fill="#355071" />
      <rect x="556" y="318" width="16" height="96" fill="#2c435f" />
      <rect x="848" y="318" width="16" height="96" fill="#2c435f" />
      {/* cards laid out on the bench */}
      <rect x="566" y="258" width="64" height="38" rx="4" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      <rect x="574" y="268" width="48" height="5" rx="2.5" fill="#5d7291" />
      <rect x="574" y="278" width="34" height="5" rx="2.5" fill="#c3ccd8" />
      <rect x="646" y="252" width="64" height="38" rx="4" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" transform="rotate(4 646 252)" />
      <rect x="726" y="258" width="64" height="38" rx="4" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" transform="rotate(-3 726 258)" />
      <rect x="800" y="264" width="56" height="32" rx="4" fill="#f0f2f5" stroke="#c3ccd8" strokeWidth="2" />
      {/* chain links sketched above the bench: outcome -> activity -> assessment */}
      <circle cx="640" cy="180" r="18" fill="none" stroke="#5d7291" strokeWidth="6" />
      <rect x="658" y="176" width="40" height="8" fill="#5d7291" />
      <circle cx="716" cy="180" r="18" fill="none" stroke="#355071" strokeWidth="6" />
      <rect x="734" y="176" width="40" height="8" fill="#5d7291" />
      <circle cx="792" cy="180" r="18" fill="none" stroke="#5d7291" strokeWidth="6" />
      {/* rug */}
      <ellipse cx="700" cy="480" rx="200" ry="26" fill="#c9d2dd" />
    </svg>
  );
}

export function WorkshopScene({ content, onGateSubmit, hints }: ScenePanelProps) {
  const { t } = useI18n();

  const hotspots: SceneHotspot[] = workshopScene.map((h) => ({
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
              <AlignmentBuilder onSolved={complete} />
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
      label={fmt(t.scene.regionLabel, { room: t.rooms.WORKSHOP })}
      art={<SceneArt />}
      hotspots={hotspots}
    />
  );
}
