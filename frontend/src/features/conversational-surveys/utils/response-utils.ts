/**
 * Response Utilities
 *
 * Pure functions for building the API submission payload from
 * collected conversational survey answers.
 */

import type { PublicQuestion, AnswerValue, SubmissionPayload } from "../types";

/**
 * Converts the local answers map into the API submission payload format.
 *
 * The backend expects:
 * {
 *   answers: [
 *     { question_id: number, value: unknown },
 *     ...
 *   ]
 * }
 */
export function buildConversationalPayload(
  questions: PublicQuestion[],
  answers: Record<string, AnswerValue>
): SubmissionPayload {
  return {
    answers: questions
      .map((q) => {
        const value = answers[String(q.id)] ?? null;
        return { question_id: String(q.id), value };
      })
      .filter((a) => a.value !== null && a.value !== undefined),
  };
}
