// Pure logic for the Room 2 two-question comprehension check (blueprint 4.2 item 3).
// Formative, not a gate: it gives feedback but does not block progression (the gate code
// TOKEN comes from the TokenPredictor).

import { machineRoomCheck, type CheckQuestion } from "../content/rooms";

export { machineRoomCheck };
export type { CheckQuestion };

export function correctOptionIndex(question: CheckQuestion): number {
  return question.options.findIndex((o) => o.correct);
}

export function isOptionCorrect(question: CheckQuestion, index: number): boolean {
  return question.options[index]?.correct === true;
}

export type CheckResult = { correct: number; total: number; allCorrect: boolean };

/** Evaluate answers keyed by question id. Unanswered questions count as incorrect. */
export function evaluateCheck(
  answers: Record<string, number>,
  questions: CheckQuestion[] = machineRoomCheck,
): CheckResult {
  let correct = 0;
  for (const q of questions) {
    const picked = answers[q.id];
    if (picked !== undefined && isOptionCorrect(q, picked)) correct++;
  }
  return { correct, total: questions.length, allCorrect: correct === questions.length };
}
