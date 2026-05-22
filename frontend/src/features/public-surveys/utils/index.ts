import { SECONDS_PER_QUESTION } from "../constants";
import type { PublicQuestion, AnswerValue, AnswerPayload } from "../types";

/**
 * Build the answers array payload from form values and question list.
 * Questions with no answer are submitted with value = null.
 */
export function buildAnswerPayload(
  questions: PublicQuestion[],
  formValues: Record<string, AnswerValue>
): AnswerPayload[] {
  return questions.map((q) => ({
    question_id: q.id,
    value: formValues[q.id] ?? null,
  }));
}

/**
 * Estimate how long the survey will take given a question count.
 * Returns a human-readable string like "~2 min".
 */
export function estimateCompletionTime(questionCount: number): string {
  const totalSeconds = questionCount * SECONDS_PER_QUESTION;
  const minutes = Math.max(1, Math.ceil(totalSeconds / 60));
  return `~${minutes} min`;
}

/**
 * Determine whether an answer value counts as "answered" (non-empty).
 */
export function isAnswered(value: AnswerValue): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return true;
  if (Array.isArray(value)) return value.length > 0;
  return false;
}
