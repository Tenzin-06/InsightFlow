import { ANSWER_DISPLAY_MAX_CHARS } from "../constants";
import type {
  PublicQuestion,
  AnswerValue,
  QuestionMessage,
  AnswerMessage,
} from "../types";

// Re-export shared utilities from the public-surveys feature
export { isAnswered, buildAnswerPayload } from "@/features/public-surveys/utils";

// ---------------------------------------------------------------------------
// Message builders
// ---------------------------------------------------------------------------

/** Build a QuestionMessage for insertion into the conversation stream. */
export function buildQuestionMessage(question: PublicQuestion): QuestionMessage {
  return {
    type: "question",
    id: `q-${question.id}-${Date.now()}`,
    questionId: String(question.id),
    text: question.question_text,
    isRequired: question.is_required,
  };
}

/** Build an AnswerMessage for insertion into the conversation stream. */
export function buildAnswerMessage(
  question: PublicQuestion,
  value: AnswerValue
): AnswerMessage {
  return {
    type: "answer",
    id: `a-${question.id}-${Date.now()}`,
    questionId: String(question.id),
    displayValue: formatAnswerDisplay(question, value),
  };
}

// ---------------------------------------------------------------------------
// Answer display formatting
// ---------------------------------------------------------------------------

/**
 * Convert a raw AnswerValue into a human-readable string for the answer bubble.
 *
 * - short_text / long_text → the string, truncated if very long
 * - multiple_choice        → the selected choice
 * - checkbox               → comma-joined selections
 * - rating                 → "4 / 5"
 */
export function formatAnswerDisplay(
  question: PublicQuestion,
  value: AnswerValue
): string {
  if (value === null || value === undefined) return "—";

  const type = question.question_type;

  if (type === "rating") {
    const max: number = question.metadata?.max_rating ?? 5;
    return `${value} / ${max}`;
  }

  if (type === "checkbox") {
    if (!Array.isArray(value)) return String(value);
    return value.length === 0 ? "—" : value.join(", ");
  }

  // short_text, long_text, multiple_choice
  const str = String(value);
  if (str.length > ANSWER_DISPLAY_MAX_CHARS) {
    return str.slice(0, ANSWER_DISPLAY_MAX_CHARS) + "…";
  }
  return str;
}
