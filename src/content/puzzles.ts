// Puzzle_data.ts — complete puzzle content for "The Ghostwriter of Nyenrode Castle"
// Drop into src/content/. All copy is final; do not paraphrase.
// Sources: GenAI lecture deck (token/transformer examples), the live Canvas course
// (crossword, papers exercise) and the verified Nyenrode AI policy documents.

export type TokenCandidate = { text: string; probability: number };
export type TokenRound = {
  id: string;
  stem: string;
  candidates: TokenCandidate[];   // "correct" = highest probability
  explanation: string;            // shown after answering, with the probability bars
};

// ---------- ROOM 2: TokenPredictor (win: >= 5 of 6 correct -> code TOKEN) ----------
export const tokenRounds: TokenRound[] = [
  {
    id: "r1-no-context",
    stem: "Dieter eet graag …",
    candidates: [
      { text: "een tosti", probability: 40 },
      { text: "een pizza", probability: 30 },
      { text: "een salade", probability: 25 },
      { text: "een gazon", probability: 5 },
    ],
    explanation:
      "With almost no context, the model falls back on frequency: common foods score high. " +
      "Note that 'gazon' is not impossible, only improbable; the word 'eet' pulls food-tokens forward. " +
      "The model is guessing exactly as you just did.",
  },
  {
    id: "r2-some-context",
    stem: "Dieter houdt van tomaten en kaas. Hij eet graag …",
    candidates: [
      { text: "een tosti", probability: 38 },
      { text: "een pizza", probability: 36 },
      { text: "een salade Caprese", probability: 20 },
      { text: "een gazon", probability: 1 },
    ],
    explanation:
      "One sentence of context reshuffles the distribution: tomato-and-cheese dishes rise together. " +
      "The model has no taste; it has correlations.",
  },
  {
    id: "r3-rich-context",
    stem: "Dieter houdt van tomaten en kaas. Hij lust geen brood. Hij eet graag …",
    candidates: [
      { text: "een salade Caprese", probability: 48 },
      { text: "een pizza", probability: 34 },
      { text: "een tosti", probability: 12 },
      { text: "een gazon", probability: 1 },
    ],
    explanation:
      "'Geen brood' suppresses bread-based tokens (tosti crashes), and the tomato-cheese-no-bread " +
      "pattern points to Caprese. The rule of the whole course: the better the context, the more " +
      "precise the prediction. This is also why prompt quality matters.",
  },
  {
    id: "r4-restaurant-server",
    stem: "The waiter brings dessert. \"Server, can I have the …\"",
    candidates: [
      { text: "check", probability: 55 },
      { text: "menu", probability: 30 },
      { text: "recipe", probability: 10 },
      { text: "keyboard", probability: 2 },
    ],
    explanation:
      "In a restaurant context, 'server' means a person and 'check' means the bill. " +
      "Tokens define each other's meaning; no dictionary is consulted.",
  },
  {
    id: "r5-it-server",
    stem: "The sysadmin sighs: \"Looks like I just crashed the …\"",
    candidates: [
      { text: "server", probability: 60 },
      { text: "computer", probability: 25 },
      { text: "meeting", probability: 8 },
      { text: "restaurant", probability: 1 },
    ],
    explanation:
      "Same word, different neighbourhood, different meaning. 'Crashed' plus 'sysadmin' moves " +
      "'server' from the dining room to the data centre. Meaning is positional, not stored.",
  },
  {
    id: "r6-rhyme-trap",
    stem: "Ork, ork, ork, soep eet je met een …",
    candidates: [
      { text: "vork (the pattern answer)", probability: 78 },
      { text: "lepel (the sensible answer)", probability: 18 },
      { text: "mes", probability: 3 },
      { text: "rietje", probability: 1 },
    ],
    explanation:
      "The trap round: the question asks what the PATTERN machine says, and the pattern says 'vork', " +
      "because rhyme is a strong pattern. A reasoning model pauses: 'You do not eat soup with a fork; " +
      "this is a joke; the sensible answer is lepel.' Show both model voices side by side here. " +
      "Lesson: fluency is not judgement, and reasoning steps are still generated text.",
  },
];
// UI note for r6: the correct pick is "vork" (the player predicts the pattern machine),
// after which the reasoning-model voice appears and explains "lepel".

// ---------- ROOM 3: SourceChecker (win: >= 4 of 5 correct -> code CONTEXT) ----------
export type SourceCategory = "verifiable" | "fabricated" | "publisher-as-author" | "bare-domain";
export type SourceItem = {
  id: string;
  reference: string;
  category: SourceCategory;
  justification: string; // tooltip after classification
};

export const sourceItems: SourceItem[] = [
  {
    id: "s1",
    reference: "5. markets.businessinsider.com",
    category: "bare-domain",
    justification:
      "A bare domain is not a source: no author, no date, no title, no retrievable page. " +
      "Typical of AI tools with web access that cite where they browsed, not what they read.",
  },
  {
    id: "s2",
    reference: "Springer. (n.d.). Global Sustainability: Trends, Challenges, and Case Studies (pp. 3-17).",
    category: "publisher-as-author",
    justification:
      "Springer is a publisher, not an author, and '(n.d.)' plus page numbers without a book or " +
      "editor makes the work untraceable. A classic AI-garbled reference.",
  },
  {
    id: "s3",
    reference:
      "Khan, H. A. (2017). Globalization and Sustainability. In Globalization and the Challenges of Public Administration (pp. 161–191). Springer.",
    category: "verifiable",
    justification:
      "This one is traceable: author, chapter, book, publisher. Trace it and you will find the " +
      "details are slightly off (the volume appeared in 2018). Verifiable does not mean correct; " +
      "it means checkable. Always check.",
  },
  {
    id: "s4",
    reference: "One Planet Network. (n.d.). Globalization and Sustainability: Recent Advances and New Perspectives.",
    category: "fabricated",
    justification:
      "An organisation name, no date, a plausible-sounding title that a search cannot locate. " +
      "LLMs assemble references from probable fragments; this one exists nowhere.",
  },
  {
    id: "s5",
    reference:
      "Renkema, M., & Tursunbayeva, A. (2024). The future of work of academics in the age of Artificial Intelligence. [journal article]",
    category: "verifiable",
    justification:
      "Real authors, real year, locatable work; this source is cited in Nyenrode's own GenAI research " +
      "guidelines. Verifying took one search. That is the habit the Ghostwriter cannot fake.",
  },
];

// ---------- ROOM 4: AlignmentBuilder (win: all 3 chains assembled -> code ALIGNMENT) ----------
export type AlignmentCard = { id: string; kind: "outcome" | "activity" | "assessment"; text: string };
export type AlignmentChain = { outcome: string; activity: string; assessment: string; rationale: string };

export const alignmentCards: AlignmentCard[] = [
  { id: "o1", kind: "outcome", text: "Evaluate an AI-generated literature review against the underlying sources (Evaluate)" },
  { id: "o2", kind: "outcome", text: "Design an exam question that stays valid when students use AI (Create)" },
  { id: "o3", kind: "outcome", text: "Explain how a large language model generates text (Understand)" },
  { id: "a1", kind: "activity", text: "Annotate an AI-written review: verify every claim and reference, correct the errors" },
  { id: "a2", kind: "activity", text: "Draft questions with a toetsmatrijs, exchange peer feedback, revise" },
  { id: "a3", kind: "activity", text: "Token-prediction exercises plus two short explainer videos" },
  { id: "x1", kind: "assessment", text: "Annotated review submitted with an oral defence of three corrections" },
  { id: "x2", kind: "assessment", text: "Portfolio of redesigned questions with a rationale against the four quality criteria" },
  { id: "x3", kind: "assessment", text: "Auto-marked quiz, minimum score 8/10" },
  // distractors: snap back with an explanation when used
  { id: "dx1", kind: "assessment", text: "Closed-book multiple-choice exam on definitions" },
  { id: "da1", kind: "activity", text: "Watch a recorded lecture about AI and integrity" },
];

export const alignmentChains: AlignmentChain[] = [
  {
    outcome: "o1", activity: "a1", assessment: "x1",
    rationale: "Evaluation is practised by evaluating and checked by defending the evaluation. The oral defence makes the process visible.",
  },
  {
    outcome: "o2", activity: "a2", assessment: "x2",
    rationale: "A create-level outcome needs a create-level activity and a portfolio that shows design decisions, tested against validity, reliability, transparency and usability.",
  },
  {
    outcome: "o3", activity: "a3", assessment: "x3",
    rationale: "Well-structured knowledge: first exposure by video, practice by prediction, checked by a mastery quiz (the Toetsing convention: minimum 8/10).",
  },
];

export const alignmentDistractorFeedback: Record<string, string> = {
  dx1: "A definitions exam measures recall, not the create- or evaluate-level performance named in the outcome. This is exactly the misalignment where AI shortcuts thrive.",
  da1: "Watching is not practising. No outcome here is 'describe a lecture'; the activity must rehearse the performance the assessment will check.",
};

// ---------- ROOM 1: Crossword (native fallback; primary = Interacty embed) ----------
// Answers uppercase. Q4 vertical yields the gate code APA.
export const crosswordClues = {
  vertical: [
    { num: 1, clue: "Directly lifting text or ideas from another source without acknowledgment", answer: "PLAGIARISM" },
    { num: 3, clue: "The software used by Nyenrode to detect copied content", answer: "TURNITIN" },
    { num: 4, clue: "The style that Nyenrode follows for citing sources in academic writing", answer: "APA" },
  ],
  horizontal: [
    { num: 2, clue: "Commitment to honesty, fairness, and respect is known as", answer: "INTEGRITY" },
    { num: 5, clue: "A key aspect of academic ethics", answer: "ORIGINALITY" },
    { num: 6, clue: "Referring to an original work", answer: "CITATION" },
  ],
};

// ---------- Gates and hints ----------
export const gateCodes = {
  library: "APA",
  machineRoom: "TOKEN",
  study: "CONTEXT",
  workshop: "ALIGNMENT",
  door: "INTEGRITY",
} as const;

export const hints: Record<string, [string, string, string]> = {
  library: [
    "The crossword's fourth question is about citing sources.",
    "Three letters, and every reference list at Nyenrode follows it.",
    "The code is APA.",
  ],
  machineRoom: [
    "What does the machine eat? Look at the plate behind the control panel.",
    "Five letters: the unit a language model predicts, one at a time.",
    "The code is TOKEN.",
  ],
  study: [
    "What made your predictions sharper in the Machine Room?",
    "Seven letters: the better it is, the more precise the output.",
    "The code is CONTEXT.",
  ],
  workshop: [
    "Outcome, activity, assessment: what property do the three chains share?",
    "Biggs' word for keeping the three in one line.",
    "The code is ALIGNMENT.",
  ],
  door: [
    "The final word was never hidden in the room.",
    "It is what you keep when nobody is checking.",
    "The code is INTEGRITY.",
  ],
};
