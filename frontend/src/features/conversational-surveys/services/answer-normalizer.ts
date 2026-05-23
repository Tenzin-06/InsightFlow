/**
 * Answer Normalizer
 *
 * Prepares raw in-memory answers for API submission by stripping
 * UI-only metadata and coercing types to match the backend contract.
 */

import type { PublicQuestion, AnswerValue } from "../types";

/**
 * Normalizes the answers map for a given set of questions:
 *
 * - Strings: trimmed of leading/trailing whitespace
 * - Ratings: coerced to integer (guards against float inputs)
 * - Checkbox arrays: duplicate-free, string-only items
 * - null / undefined → excluded from output
 *
 * Returns a new Record — the input is not mutated.
 */
export function normalizeConversationalAnswers(
  questions: PublicQuestion[],
  answers: Record<string, AnswerValue>
): Record<string, AnswerValue> {
  const normalized: Record<string, AnswerValue> = {};

  for (const question of questions) {
    const key = String(question.id);
    const raw = answers[key];

    if (raw === null || raw === undefined) continue;

    switch (question.question_type) {
      case "short_text":
      case "long_text":
      case "multiple_choice": {
        const str = typeof raw === "string" ? raw.trim() : String(raw);
        if (str !== "") normalized[key] = str;
        break;
      }

      case "rating": {
        const num = Number(raw);
        if (!isNaN(num)) normalized[key] = Math.round(num);
        break;
      }

      case "checkbox": {
        if (Array.isArray(raw)) {
          const unique = [...new Set(raw.map(String))].filter(Boolean);
          if (unique.length > 0) normalized[key] = unique;
        }
        break;
      }

      default: {
        normalized[key] = raw;
      }
    }
  }

  return normalized;
}
