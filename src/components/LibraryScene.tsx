import { fmt, useI18n } from "../i18n";
import { libraryScene } from "../content/rooms";
import {
  RoomScene,
  SceneBackdrop,
  sectionsForPanel,
  type SceneHotspot,
  type ScenePanelProps,
} from "./RoomScene";
import { NarrativeSections } from "./NarrativeSections";
import { PuzzleIntro } from "./PuzzleIntro";
import { Crossword } from "./Crossword";
import { CodeGate } from "./CodeGate";
import { HintButton } from "./HintButton";

// The Library as an explorable scene: the bookcase (narrative), the policy shelf
// (house rules + disclosure + stoplight theory), the green book (crossword), and the
// bottom doors (gate). The crossword completes when clue 4 reveals APA.

const POS: Record<string, { x: number; y: number }> = {
  bookcase: { x: 40, y: 22 },
  shelf: { x: 40, y: 46 },
  greenbook: { x: 76, y: 60 },
  doors: { x: 40, y: 77 },
};

function SceneArt() {
  return (
    <svg viewBox="0 0 960 540" aria-hidden="true" focusable="false">
      <SceneBackdrop />
      {/* grounding shadows */}
      <ellipse cx="380" cy="466" rx="220" ry="12" fill="#b9c2cf" opacity="0.5" />
      <ellipse cx="750" cy="438" rx="70" ry="9" fill="#b9c2cf" opacity="0.5" />
      {/* bookcase frame */}
      <rect x="180" y="60" width="400" height="400" rx="8" fill="#355071" />
      {/* top shelf: leather volumes */}
      <rect x="200" y="84" width="360" height="76" fill="#5d7291" />
      <rect x="212" y="94" width="22" height="58" fill="#2c435f" />
      <rect x="240" y="100" width="22" height="52" fill="#355071" />
      <rect x="268" y="90" width="22" height="62" fill="#2c435f" />
      <rect x="296" y="98" width="22" height="54" fill="#355071" />
      <rect x="324" y="92" width="22" height="60" fill="#2c435f" />
      <rect x="352" y="100" width="22" height="52" fill="#355071" />
      <rect x="380" y="94" width="22" height="58" fill="#2c435f" />
      <rect x="408" y="98" width="22" height="54" fill="#355071" />
      <rect x="436" y="92" width="22" height="60" fill="#2c435f" />
      <rect x="464" y="100" width="22" height="52" fill="#355071" />
      <rect x="492" y="94" width="22" height="58" fill="#2c435f" />
      <rect x="520" y="98" width="26" height="54" fill="#355071" />
      {/* the policy shelf: crisp white documents */}
      <rect x="200" y="184" width="360" height="76" fill="#5d7291" />
      <rect x="214" y="196" width="30" height="58" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      <rect x="252" y="200" width="30" height="54" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      <rect x="290" y="196" width="30" height="58" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      <rect x="328" y="200" width="30" height="54" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      <rect x="366" y="196" width="30" height="58" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" />
      <rect x="410" y="206" width="60" height="48" fill="#f0f2f5" stroke="#c3ccd8" strokeWidth="2" />
      <rect x="420" y="216" width="40" height="5" rx="2.5" fill="#5d7291" />
      <rect x="420" y="228" width="40" height="5" rx="2.5" fill="#c3ccd8" />
      <rect x="484" y="196" width="62" height="58" fill="#5d7291" />
      {/* middle shelf: more volumes */}
      <rect x="200" y="284" width="360" height="76" fill="#5d7291" />
      <rect x="214" y="296" width="22" height="56" fill="#2c435f" />
      <rect x="242" y="302" width="22" height="50" fill="#355071" />
      <rect x="270" y="294" width="22" height="58" fill="#2c435f" />
      <rect x="298" y="300" width="22" height="52" fill="#355071" />
      <rect x="326" y="296" width="22" height="56" fill="#2c435f" />
      <rect x="360" y="304" width="80" height="48" fill="#355071" />
      <rect x="448" y="296" width="22" height="56" fill="#2c435f" />
      <rect x="476" y="302" width="22" height="50" fill="#355071" />
      <rect x="504" y="296" width="42" height="56" fill="#2c435f" />
      {/* bottom doors, locked */}
      <rect x="200" y="384" width="360" height="60" fill="#2c435f" />
      <rect x="208" y="392" width="168" height="44" rx="4" fill="#5d7291" />
      <rect x="384" y="392" width="168" height="44" rx="4" fill="#5d7291" />
      <circle cx="366" cy="414" r="5" fill="#f0f2f5" />
      <circle cx="394" cy="414" r="5" fill="#f0f2f5" />
      <rect x="377" y="410" width="6" height="14" rx="3" fill="#2c435f" />
      {/* reading stand with the green book */}
      <rect x="690" y="330" width="120" height="14" rx="4" fill="#355071" />
      <rect x="738" y="344" width="20" height="80" fill="#2c435f" />
      <rect x="712" y="424" width="76" height="10" rx="4" fill="#355071" />
      <path d="M700 330 l50 -26 l50 26 z" fill="#2f7d4f" />
      <path d="M700 330 l50 -26 v10 l-50 26 z" fill="#256540" />
      <rect x="742" y="300" width="16" height="6" fill="#f0f2f5" />
      {/* a fallen crossword page */}
      <rect x="640" y="440" width="56" height="40" rx="3" fill="#ffffff" stroke="#c3ccd8" strokeWidth="2" transform="rotate(-8 640 440)" />
      <rect x="650" y="450" width="10" height="10" fill="#c3ccd8" transform="rotate(-8 640 440)" />
      <rect x="662" y="450" width="10" height="10" fill="#5d7291" transform="rotate(-8 640 440)" />
      <rect x="650" y="462" width="10" height="10" fill="#5d7291" transform="rotate(-8 640 440)" />
      {/* rug */}
      <ellipse cx="480" cy="486" rx="200" ry="28" fill="#c9d2dd" />
    </svg>
  );
}

export function LibraryScene({ content, onGateSubmit, hints }: ScenePanelProps) {
  const { t } = useI18n();

  const hotspots: SceneHotspot[] = libraryScene.map((h) => ({
    id: h.id,
    title: h.title,
    pos: POS[h.id]!,
    completeOnOpen: h.kind === "intro",
    render: (complete) => {
      switch (h.kind) {
        case "puzzle":
          return (
            <>
              <NarrativeSections
                sections={sectionsForPanel(content.intro, h.sections, h.title)}
              />
              {content.puzzleIntro && <PuzzleIntro paragraphs={content.puzzleIntro} />}
              <Crossword onSolved={complete} />
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
      label={fmt(t.scene.regionLabel, { room: t.rooms.LIBRARY })}
      art={<SceneArt />}
      hotspots={hotspots}
    />
  );
}
