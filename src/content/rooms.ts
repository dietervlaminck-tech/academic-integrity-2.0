// Narrative and theory content for The Ghostwriter of Nyenrode Castle.
//
// Narrative copy is transcribed verbatim (word for word) from Canvas_ready_content.md;
// the only change is typographic: em-dashes from the source are normalised to house-style
// punctuation (commas / colons / sentence breaks) without altering any wording. Markdown
// emphasis in the source is rendered as plain prose.
//
// Deviation (Dieter, 2026-07-08): the Machine Room's token examples were translated from
// Dutch to English so the e-learning stands alone; no copy may reference lectures or
// other course moments outside this app. Module 4's Dutch assessment terms stay, glossed.
//
// Scaffolding copy (learning goals, "your turn" puzzle introductions, the course overview
// and glosses for the Dutch examples) is instructional text added at Dieter's request; it
// derives from the module outcomes and puzzle rules in the course design and never
// replaces or paraphrases narrative. Room display titles come from i18n (rooms.*).

import type { Room } from "../state/progress";
import { hints as puzzleHints } from "./puzzles";

export type HintKey = keyof typeof puzzleHints;

export type VideoRef = { videoId: string; title: string; note?: string };

export type Section =
  | { kind: "prose"; heading?: string; body: string[] }
  | { kind: "note"; body: string[] }
  | { kind: "list"; heading?: string; lead?: string; ordered?: boolean; items: string[] }
  | { kind: "video"; body?: string[]; video: VideoRef };

export type ExternalLink = { label: string; url: string; note?: string };

export type RoomContent = {
  room: Room;
  /** Module label shown above the room title, e.g. "Module 2". */
  eyebrow: string;
  /** Which progressive-hints set backs this room's gate. */
  hintKey: HintKey | null;
  /** Verb-led module outcome, shown in the learning-goal callout under the title. */
  learningGoal: string;
  /** Narrative + theory sections rendered before the puzzle. */
  intro: Section[];
  /** "Your turn" paragraphs: what the puzzle tests and how to play it. */
  puzzleIntro?: string[];
  /** Extra theory rendered between two puzzle stages (used by the Machine Room). */
  postPuzzle?: Section[];
  /** Optional external activities; always open in a new tab and are clearly optional. */
  links?: ExternalLink[];
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
    learningGoal:
      "Define academic integrity and locate the Nyenrode rules that govern it, including the AI policy.",
    intro: [
      {
        kind: "prose",
        heading: "The bookcase",
        body: [
          "The first thing you notice is the old bookcase. Between the leather volumes someone has wedged a shelf of crisp new documents: the policy shelf. You recognise the Academic Integrity and Plagiarism regulation, the Assessment Policy, and two newer arrivals: Nyenrode's Principes voor verantwoord gebruik AI in het onderwijs and the Guidelines for responsible use of Generative AI in business research.",
          "The Dutch title translates as Principles for responsible use of AI in education. AVG, which appears in the rules below, is the Dutch name for the GDPR, the European privacy regulation.",
          "The doors at the bottom of the bookcase are locked. Maybe a key is hidden inside?",
        ],
      },
      {
        kind: "list",
        heading: "The house rules",
        lead: "Nyenrode's AI policy rests on three principles:",
        ordered: true,
        items: [
          "Academic Integrity: refrain from fraud in any form and stay open and transparent when working with AI. Presenting generative-AI output as your own work is fraud. You may use AI tools to improve readability, language and writing style, but not to replace the core tasks of writing, such as developing scholarly insights or conclusions. You remain responsible for the content.",
          "Informed Participation: have a basic understanding of AI so you can make deliberate decisions about its use: know the model, its training data and biases, how your input is used and stored, and the privacy (AVG), copyright and trusted-environment issues involved. Do not enter personal or confidential data into open models.",
          "Accountability: take full responsibility for every decision to use AI and for the content it generates. Be critical and transparent about all AI use.",
        ],
      },
      {
        kind: "prose",
        body: [
          "How to disclose: include your generative-AI use in an appendix or in footnotes on the page where the output is used, specifying the purpose, which parts were generated, and which tool you used (APA provides a citation format for AI tools).",
          "For your research (Guidelines responsible use GenAI in research, stoplight approach): language and style editing and integrity checks score high on desirability; literature search, figure generation, idea generation and summarisation are medium/low and require human validation and manual fact-checking; drafting text and data analysis are low and demand extra caution; AI peer review and AI-generated research data are not permitted (the only exception: synthetic data as a fully disclosed research methodology). Across all publishers and the European Commission guidelines one rule is universal: AI can never be an author or co-author, and the human researcher remains accountable.",
          "One practical note before the puzzle: written submissions at Nyenrode are checked with Turnitin, the text-similarity tool. Remember the name; you will meet it again in the Study.",
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
    puzzleIntro: [
      "Six clues test the vocabulary you just read on the policy shelf: what plagiarism is, which citation style Nyenrode follows, which tool checks submissions, and the values behind the rules. Everything you need is in this room.",
      "Type each answer in the boxes below; a correct answer locks in green. The answer to clue 4, in CAPITALS, is the code for the bottom doors.",
    ],
    links: [
      {
        label: "The same crossword on Interacty",
        url: "https://interacty.me/projects/49e9a71ad40ac0f7",
        note: "The original online version, identical clues.",
      },
      {
        label: "Terms and regulations overview",
        url: "https://www.nyenrode.nl/en/about-us/about-nyenrode/terms-and-conditions",
        note: "The full policy shelf.",
      },
    ],
    gateRevealText:
      "Well done! Behind the doors you find a brass key shaped like the letter T, and a note: \"The machine on the desk runs on these.\" Take the key with you, submit, and click \"Next\".",
  },

  MACHINE_ROOM: {
    room: "MACHINE_ROOM",
    eyebrow: "Module 2",
    hintKey: "machineRoom",
    learningGoal:
      "Explain how a large language model generates text: tokens, context, next-token prediction, reasoning models.",
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
          "Dieter likes to eat…? A toasted sandwich? A lawn? You know it is not \"a lawn\". Why? Context.",
          "Dieter loves tomatoes and cheese. He does not eat bread. He likes to eat…? Now \"a Caprese salad\" beats \"a toasted sandwich\". More context, better prediction.",
          "This is everything the Ghostwriter does, billions of times per answer. The more context you give it, the more precise its prediction, but there is always an element of chance. That is why the same question can produce different answers, and why an answer can be fluent and wrong at the same time.",
        ],
      },
    ],
    puzzleIntro: [
      "Now do the machine's job for real. Six rounds: each shows the text a model has received, and four candidates for the next token. Pick the candidate you think the model rates most probable; after every pick the hidden distribution is revealed, with a note on how the context shifted it.",
      "The first three rounds follow Dieter, a colleague deciding what to eat: watch how every added sentence of context reshuffles the distribution. Two rounds then show the same word ('server') changing meaning with its neighbourhood, and the finale is a nursery-style rhyme with a trap in it.",
      "Score at least five of six and the machine surrenders its code. One warning for the final round: it asks what the pattern machine would say, not what a sensible person would.",
    ],
    postPuzzle: [
      {
        kind: "prose",
        heading: "Reasoning models",
        body: [
          "You just felt the trap yourself: fluent pattern-completion is not judgement.",
          "Fork, fork, fork, you eat your soup with a…? A pure language-pattern machine says fork (it rhymes!). A reasoning model pauses: \"You don't eat soup with a fork. This is a joke, but the sensible answer is a spoon.\"",
          "Watch This Is How Reasoning LLMs Really Work to see what changed in 2025, and what did not.",
        ],
      },
      {
        kind: "video",
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
    learningGoal:
      "Evaluate AI output: verify sources, spot fabrication, and conduct an integrity conversation.",
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
        heading: "What gives the Ghostwriter away",
        body: [
          "Three signals raise suspicion: the style of language differs from the writer's own; the sources may be fabricated or refer to nonexistent works; and the text makes absurd or irrational claims. One popular signal is itself false: \"AI always makes untrue claims\" is wrong, and the word always is the giveaway.",
          "Suspicion is not proof. Without a confession you can rarely be sure: detection is weak; verification and assessment design are strong.",
          "So verify. One check that goes beyond style: trace every reference. A real source has an author, a date, a title and a traceable home. The Ghostwriter assembles references from probable fragments, and tracing them is the habit it cannot fake.",
        ],
      },
      {
        kind: "prose",
        heading: "The top-left drawer",
        body: [
          "Inside you find the thesis of your student, Memphis. Turnitin similarity: 35%. Entire unreferenced sections, and a style you do not recognise. You suspect fraud. In real life you would report to the Exam Committee, but you are locked in a castle.",
          "Verifying the work is one half of the module's goal; the other is the conversation that follows. Try different conversational techniques; he denies at first, but honesty grows under fair, firm confrontation. You can practise exactly this conversation in the Confront Memphis roleplay under the optional extras below, in Dutch or English, as you prefer.",
        ],
      },
      {
        kind: "prose",
        heading: "The bottom-right drawer",
        body: [
          "A flying game about motivating integrity rather than policing it. Play it, then consider: which of the statements you flew through would actually change a student's behaviour?",
        ],
      },
    ],
    puzzleIntro: [
      "The pile of paperwork ends in a reference list of five entries. Your task: classify each reference into one of four categories.",
      "Verifiable: author, year, title and a traceable home (verifiable means checkable, not correct; tracing it may still reveal errors). Fabricated: plausible-sounding, but a search finds it nowhere. Publisher as author: a publisher's name standing where an author should be. Bare domain: only a web address, with no author, date or title.",
      "Classify at least four of five correctly and the drawer opens. After every choice the reasoning appears; read it, because the patterns are the lesson.",
    ],
    links: [
      {
        label: "Confront Memphis (AI roleplay chatbot)",
        url: "https://app.gpt-trainer.com/widget/6979621805124a88bfdf04500cdba3e6",
        note: "An AI chatbot roleplay: practise the integrity conversation from the top-left drawer.",
      },
      {
        label: "Airplane game (Wordwall)",
        url: "https://wordwall.net/resource/75554794",
        note: "The flying game from the bottom-right drawer.",
      },
      {
        label: "Anagram Avengers (Wordwall)",
        url: "https://wordwall.net/resource/76173600/anagram-avengers",
        note: "An anagram game about the exam committee, the library and the code of conduct.",
      },
    ],
    gateRevealText:
      "The C-shaped key fits. Inside lies an anagram puzzle, yours to play whenever you like. You also find a heavy iron key shaped like the letter A.",
  },

  WORKSHOP: {
    room: "WORKSHOP",
    eyebrow: "Module 4",
    hintKey: "workshop",
    learningGoal:
      "Design an assessment that remains valid in an AI-rich environment, using constructive alignment, a toetsmatrijs and the four quality criteria.",
    intro: [
      {
        kind: "prose",
        heading: "The chest of drawers",
        body: [
          "The chest of drawers turns out to be an examiner's cabinet: every drawer a tool. Generative AI has not broken assessment; it has exposed assessment that was already weak. Tasks that ask for reproduction of available knowledge were poor measures before the Ghostwriter could do them in seconds. The answer is not surveillance but design.",
          "The examiner's tools carry their original Dutch labels, as they do at Nyenrode; the ideas beneath them are universal.",
        ],
      },
      {
        kind: "prose",
        heading: "Drawer 1: Constructive alignment",
        body: [
          "Leerdoelen, leeractiviteiten en toetsing in één lijn (Biggs): learning outcomes, learning activities and assessment in one line. Name the outcome as a verb-led performance; show the activity in which learners practise exactly that performance; show the assessment that checks it. If any of the three names a different performance, the design is misaligned, and misaligned designs are exactly where AI shortcuts thrive.",
          "The planning tool for this work is the toetsmatrijs, an assessment blueprint: a table mapping each outcome and its Bloom level to the exam items that test it. One of the cards on the workbench uses the word; now you know what it asks for.",
        ],
      },
      {
        kind: "prose",
        heading: "Drawer 2: The four quality criteria",
        body: [
          "Validiteit, betrouwbaarheid, transparantie, bruikbaarheid: validity, reliability, transparency, usability. An AI-resilient assessment that fails any of these is not yet fit for use. Note the governance route: changing an assessment form runs through the Alternative Assessment procedure (Assessment Committee advises, Exam Committee approves), never a unilateral act.",
        ],
      },
      {
        kind: "list",
        heading: "Drawer 3: Three moves that keep assessment valid",
        ordered: true,
        items: [
          "Assess process as well as product (drafts, reflections, oral defence).",
          "Make it authentic (messy, contextual problems that generic AI answers fail).",
          "Weight assessment for learning (frequent low-stakes checks; feedback and feedforward).",
        ],
      },
      {
        kind: "prose",
        body: [
          "Where the outcome includes skilled AI use, require and examine that use: let students critique, correct and improve AI output rather than pretending the tool does not exist.",
        ],
      },
    ],
    puzzleIntro: [
      "On the workbench lie three learning outcomes from this very course, next to a stack of activity and assessment cards. For each outcome, pick the activity in which learners practise exactly that performance, and the assessment that checks it.",
      "Misaligned cards snap back with an explanation of what went wrong, and two cards on the table belong to no chain at all. Align all three chains to open the locked drawer.",
    ],
    links: [
      {
        label: "Riddle-match puzzle (Interacty)",
        url: "https://interacty.me/projects/80080830faefbcf9",
        note: "A riddle-match on the themes of this course.",
      },
    ],
    gateRevealText:
      "The A-shaped key opens the last drawer. Inside: the riddle-match puzzle. Solve it to receive the final word that opens the castle door. The riddle-match is an optional extra; the Door itself will tell you everything you need.",
  },

  DOOR: {
    room: "DOOR",
    eyebrow: "Module 5",
    hintKey: "door",
    learningGoal:
      "Commit to how you will use, disclose and verify AI in your own teaching and research.",
    intro: [
      {
        kind: "prose",
        heading: "Open the door",
        body: [
          "You stand before the door with everything you need: you understand the machine, you can see through its words, and you can design assessment it cannot fake. The final word was never hidden: it is what you keep when nobody is checking: INTEGRITY.",
        ],
      },
    ],
    puzzleIntro: [
      "Two things remain, and neither is a trick. First, write your one-sentence AI-integrity charter below. It is not checked or graded; it is yours, and it will appear on your certificate.",
      "Then open the door. The final code is not hidden in a puzzle: the letter above has already told you what it is. Type it in CAPITALS, and the castle lets you go.",
    ],
    gateRevealText:
      "Congratulations, you have escaped the room in Nyenrode Castle!",
  },
};

// ---------- Course overview (Start screen journey map) ----------
// Derived from each room's learningGoal so the start screen can never drift from the
// goal callout shown inside the room itself.

const PLAY_ORDER = ["LIBRARY", "MACHINE_ROOM", "STUDY", "WORKSHOP", "DOOR"] as const;

export const courseGoals: { room: Room; goal: string }[] = PLAY_ORDER.map((room) => ({
  room,
  goal: rooms[room].learningGoal,
}));

export function roomContent(room: Room): RoomContent | null {
  if (room === "START" || room === "ESCAPED") return null;
  return rooms[room];
}

// ---------- Explorable scenes (one per room) ----------
// Each hotspot maps a clickable object in a room's scene to the content it opens. Panel
// titles are object names from the course pack where one exists (e.g. "The control
// panel", "The bottom doors", "The wall of fame"). `sections` indexes into the room's
// intro; the scenes never introduce copy of their own, they only re-frame the reading
// view. Hotspots unlock linearly, in array order.

export type SceneHotspotContent = {
  id: string;
  title: string;
  kind: "intro" | "puzzle" | "post" | "gate" | "charter";
  /** Which of the room's intro sections this panel shows (lead-in for puzzle panels). */
  sections?: number[];
};

export const libraryScene: SceneHotspotContent[] = [
  { id: "bookcase", title: "The bookcase", kind: "intro", sections: [0] },
  { id: "shelf", title: "The policy shelf", kind: "intro", sections: [1, 2] },
  { id: "greenbook", title: "The green book", kind: "puzzle", sections: [3] },
  { id: "doors", title: "The bottom doors", kind: "gate" },
];

export const machineRoomScene: SceneHotspotContent[] = [
  { id: "machine", title: "The machine on the desk", kind: "intro", sections: [0, 1, 2] },
  { id: "poster", title: "Think like a transformer", kind: "intro", sections: [3] },
  { id: "panel", title: "The control panel", kind: "puzzle" },
  { id: "terminal", title: "Reasoning models", kind: "post" },
  { id: "hatch", title: "The maintenance hatch", kind: "gate" },
];

export const studyScene: SceneHotspotContent[] = [
  { id: "notebook", title: "The notebook", kind: "intro", sections: [0, 1] },
  { id: "topdrawer", title: "The top-left drawer", kind: "intro", sections: [2] },
  { id: "bottomdrawer", title: "The bottom-right drawer", kind: "intro", sections: [3] },
  { id: "paperwork", title: "The pile of paperwork", kind: "puzzle" },
  { id: "deskdrawer", title: "The desk drawer", kind: "gate" },
];

export const workshopScene: SceneHotspotContent[] = [
  { id: "chest", title: "The chest of drawers", kind: "intro", sections: [0] },
  { id: "drawer1", title: "Drawer 1: Constructive alignment", kind: "intro", sections: [1] },
  { id: "drawer2", title: "Drawer 2: The four quality criteria", kind: "intro", sections: [2] },
  {
    id: "drawer3",
    title: "Drawer 3: Three moves that keep assessment valid",
    kind: "intro",
    sections: [3, 4],
  },
  { id: "workbench", title: "The workbench", kind: "puzzle" },
  { id: "locked", title: "The locked drawer", kind: "gate" },
];

export const doorScene: SceneHotspotContent[] = [
  { id: "letter", title: "Open the door", kind: "intro", sections: [0] },
  { id: "wall", title: "The wall of fame", kind: "charter" },
  { id: "lock", title: "The lock", kind: "gate" },
];

export const roomScenes: Record<Exclude<Room, "START" | "ESCAPED">, SceneHotspotContent[]> = {
  LIBRARY: libraryScene,
  MACHINE_ROOM: machineRoomScene,
  STUDY: studyScene,
  WORKSHOP: workshopScene,
  DOOR: doorScene,
};

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
