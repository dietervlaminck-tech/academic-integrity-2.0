// Narrative content for The Ghostwriter of Nyenrode Castle.
//
// Copy is transcribed verbatim (word for word) from Canvas_ready_content.md. The only
// change is typographic: em-dashes from the source are normalised to house-style
// punctuation (commas / sentence breaks) per CLAUDE.md, without altering any wording.
// Markdown emphasis in the source is rendered as plain prose. Room display titles come
// from i18n (rooms.*); section headings below are the source page titles.

import type { Room } from "../state/progress";
import { hints as puzzleHints } from "./puzzles";

export type HintKey = keyof typeof puzzleHints;

export type VideoRef = { videoId: string; title: string; note?: string };

export type Section =
  | { kind: "prose"; heading?: string; body: string[] }
  | { kind: "note"; body: string[] }
  | { kind: "video"; body?: string[]; video: VideoRef };

export type ExternalLink = { label: string; url: string; note?: string };

export type RoomContent = {
  room: Room;
  /** Module label shown above the room title, e.g. "Module 2". */
  eyebrow: string;
  /** Which progressive-hints set backs this room's gate. */
  hintKey: HintKey | null;
  /** Narrative sections rendered before the puzzle. */
  intro: Section[];
  /** Optional external activity/policy links. */
  links?: ExternalLink[];
  /** Optional existing external activity embedded in an iframe (with a fallback link). */
  activityEmbed?: { src: string; title: string };
  /** Narrative revealed after the gate opens (may name the next key). */
  gateRevealText: string;
  /** True for rooms whose full puzzle is not built yet (placeholder banner). */
  wip?: boolean;
};

// ---------- Module 0: the opening letter ----------

export const startLetter: Section[] = [
  {
    kind: "prose",
    heading: "A letter under the door",
    body: [
      "You find yourself once again in a room in Nyenrode Castle. It looks familiar: the bookcase, the desk, the chest of drawers. But something has changed. On the desk hums a machine nobody remembers installing, and the room is littered with pages of flawless, elegant text. Nobody knows who wrote them.",
      "The residents of the castle call it the Ghostwriter.",
      "As you enter, the door locks behind you. A letter slides under the door:",
    ],
  },
  {
    kind: "note",
    body: [
      "\"To escape this room you must do three things: understand the machine, see through its words, and prove that your own judgement is still worth more. Only then will the door open.\"",
    ],
  },
  {
    kind: "prose",
    body: [
      "In this course you will (1) refresh what academic integrity means at Nyenrode, (2) learn how large language models actually work, what they can and cannot do, (3) practice recognising and verifying AI-generated work, and (4) design assessment that remains valid in an AI-rich world.",
      "Transparency note: in this course you are expected to use generative AI in several activities, and expected to disclose how you used it. That is the point: integrity is not abstinence, it is honesty about your methods.",
    ],
  },
];

// ---------- Rooms 1 to 5 ----------

export const rooms: Record<Exclude<Room, "START" | "ESCAPED">, RoomContent> = {
  LIBRARY: {
    room: "LIBRARY",
    eyebrow: "Module 1",
    hintKey: "library",
    intro: [
      {
        kind: "prose",
        heading: "The bookcase",
        body: [
          "The first thing you notice is the old bookcase. Between the leather volumes someone has wedged a shelf of crisp new documents: the policy shelf. You recognise the Academic Integrity and Plagiarism regulation, the Assessment Policy, and two newer arrivals: Nyenrode's Principes voor verantwoord gebruik AI in het onderwijs and the Guidelines for responsible use of Generative AI in business research.",
          "The doors at the bottom of the bookcase are locked. Maybe a key is hidden inside?",
        ],
      },
      {
        kind: "prose",
        heading: "The green book",
        body: [
          "A treatise about academic integrity: ethics, plagiarism, prevention, penalties. A crossword puzzle falls out. Solve the crossword. The answer to question 4 opens the bottom doors of the bookcase. All codes in CAPITALS.",
        ],
      },
    ],
    activityEmbed: {
      src: "https://interacty.me/projects/49e9a71ad40ac0f7",
      title: "Integrity crossword (Interacty)",
    },
    links: [
      {
        label: "Terms and regulations overview",
        url: "https://www.nyenrode.nl/en/about-us/about-nyenrode/terms-and-conditions",
      },
    ],
    gateRevealText:
      "Well done! Behind the doors you find a brass key shaped like the letter T, and a note: \"The machine on the desk runs on these.\" Take the key with you, submit, and click \"Next\".",
  },

  MACHINE_ROOM: {
    room: "MACHINE_ROOM",
    eyebrow: "Module 2",
    hintKey: "machineRoom",
    intro: [
      {
        kind: "prose",
        heading: "The machine on the desk",
        body: [
          "Up close, the Ghostwriter is disappointingly unmysterious: a box that takes text in and pushes text out. To see through its words you must first understand its trick.",
        ],
      },
      {
        kind: "video",
        video: {
          videoId: "LPZh9BOjkQs",
          title: "Large Language Models explained briefly",
          note: "3Blue1Brown, 8 min",
        },
      },
      {
        kind: "note",
        body: [
          "Remember one sentence: a language model does not know things; it predicts the most probable next token given the context it was given.",
        ],
      },
      {
        kind: "prose",
        heading: "Think like a transformer",
        body: [
          "Try the machine's job yourself.",
          "Dieter eet graag…? a tosti? a gazon? You know it is not \"gazon\". Why? Context.",
          "Dieter houdt van tomaten en kaas. Hij lust geen brood. Hij eet graag…? now \"salade Caprese\" beats \"tosti\". More context, better prediction.",
          "This is everything the Ghostwriter does, billions of times per answer. The more context you give it, the more precise its prediction, but there is always an element of chance. That is why the same question can produce different answers, and why an answer can be fluent and wrong at the same time.",
          "Ork, ork, ork, soep eet je met een…? A pure language-pattern machine says vork (it rhymes!). A reasoning model pauses: \"You don't eat soup with a fork. This is a joke, but the sensible answer is lepel.\"",
        ],
      },
      {
        kind: "video",
        body: [
          "Watch This Is How Reasoning LLMs Really Work to see what changed in 2025, and what did not.",
        ],
        video: {
          videoId: "ygRDcMWHDy0",
          title: "This Is How Reasoning LLMs Really Work",
        },
      },
    ],
    gateRevealText:
      "Behind the control panel you find the machine's fuel etched into a plate: TOKEN. You also spot a second key, shaped like the letter C. Take it with you and continue to the desk.",
  },

  STUDY: {
    room: "STUDY",
    eyebrow: "Module 3",
    hintKey: "study",
    intro: [
      {
        kind: "prose",
        heading: "The desk",
        body: [
          "The antique desk of Albert Plesman, 1946. His forgotten notebook is still here, but the pile of paperwork on top is new, and suspiciously well-written.",
          "Plesman's ponderings: How do we know what is real and what is fake, in a world suddenly dominated by generative AI?",
        ],
      },
      {
        kind: "prose",
        heading: "The top-left drawer",
        body: [
          "Inside you find the thesis of your student, Memphis. Turnitin similarity: 35%. Entire unreferenced sections, and a style you do not recognise. You suspect fraud. In real life you would report to the Exam Committee, but you are locked in a castle.",
        ],
      },
    ],
    links: [
      {
        label: "Confront Memphis (AI roleplay chatbot)",
        url: "https://app.gpt-trainer.com/widget/6979621805124a88bfdf04500cdba3e6",
        note: "This is an AI chatbot roleplay. Opens in a new tab.",
      },
      {
        label: "Anagram Avengers (Wordwall)",
        url: "https://wordwall.net/resource/76173600/anagram-avengers",
        note: "The answer to question 4 opens the next room.",
      },
    ],
    gateRevealText:
      "The C-shaped key fits. Inside lies an anagram puzzle. You also find a heavy iron key shaped like the letter A.",
  },

  WORKSHOP: {
    room: "WORKSHOP",
    eyebrow: "Module 4",
    hintKey: "workshop",
    intro: [
      {
        kind: "prose",
        heading: "The chest of drawers",
        body: [
          "The chest of drawers turns out to be an examiner's cabinet: every drawer a tool. Generative AI has not broken assessment; it has exposed assessment that was already weak. Tasks that ask for reproduction of available knowledge were poor measures before the Ghostwriter could do them in seconds. The answer is not surveillance but design.",
        ],
      },
      {
        kind: "prose",
        heading: "Drawer 1: Constructive alignment",
        body: [
          "Leerdoelen, leeractiviteiten en toetsing in een lijn (Biggs). Name the outcome as a verb-led performance; show the activity in which learners practise exactly that performance; show the assessment that checks it. If any of the three names a different performance, the design is misaligned, and misaligned designs are exactly where AI shortcuts thrive.",
        ],
      },
    ],
    links: [
      {
        label: "Riddle-match puzzle (Interacty)",
        url: "https://interacty.me/projects/80080830faefbcf9",
        note: "Solve it to receive the final word that opens the castle door.",
      },
    ],
    gateRevealText:
      "The A-shaped key opens the last drawer. Solve the riddle-match to receive the final word that opens the castle door.",
  },

  DOOR: {
    room: "DOOR",
    eyebrow: "Module 5",
    hintKey: "door",
    intro: [
      {
        kind: "prose",
        heading: "Open the door",
        body: [
          "You stand before the door with everything you need: you understand the machine, you can see through its words, and you can design assessment it cannot fake. The final word was never hidden: it is what you keep when nobody is checking.",
        ],
      },
    ],
    gateRevealText:
      "Congratulations, you have escaped the room in Nyenrode Castle!",
  },
};

export function roomContent(room: Room): RoomContent | null {
  if (room === "START" || room === "ESCAPED") return null;
  return rooms[room];
}

// ---------- Room 2: two-question check tied to the reasoning-LLMs video ----------
// Questions and options are transcribed verbatim from the "The control panel" quiz in
// Canvas_ready_content.md (Module 2, Q1 and Q4). Option order is varied so the correct
// answer is not in a fixed position; no wording is changed.

export type CheckOption = { text: string; correct: boolean };
export type CheckQuestion = { id: string; prompt: string; options: CheckOption[] };

export const machineRoomCheck: CheckQuestion[] = [
  {
    id: "q-what-llm-does",
    prompt: "What does a large language model fundamentally do?",
    options: [
      { text: "Look up answers in a database", correct: false },
      { text: "Predict the most probable next token given a context", correct: true },
      { text: "Copy sentences from the internet", correct: false },
      { text: "Reason logically about facts", correct: false },
    ],
  },
  {
    id: "q-reasoning-model",
    prompt: "What distinguishes a reasoning model from a classic LLM?",
    options: [
      { text: "It is always correct", correct: false },
      { text: "It refuses jokes", correct: false },
      { text: "It generates intermediate reasoning steps before answering", correct: true },
      { text: "It has feelings", correct: false },
    ],
  },
];
