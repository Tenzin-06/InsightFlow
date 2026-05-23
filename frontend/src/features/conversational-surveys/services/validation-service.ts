/**
 * Validation Service
 *
 * Orchestrates all conversational answer validation for a given question.
 * Composes the pure validation-utils functions into a single call point.
 */

import type { PublicQuestion, AnswerValue } from "../types";
import {
  validateRequiredAnswer,
  validateRatingBounds,
} from "../utils/validation-utils";

/**
 * Validates a conversational answer for the given question.
 *
 * Returns a human-readable error string if invalid, or null if valid.
 *
 * Validation order:
 *  1. Required check (for required questions)
 *  2. Type-specific checks (rating bounds, etc.)
 */
export function validateConversationalAnswer(
  question: PublicQuestion,
  value: AnswerValue
): string | null {
  // 1. Required check
  if (question.is_required) {
    const requiredError = validateRequiredAnswer(value);
    if (requiredError) return requiredError;
  }

  // 2. Type-specific validation
  if (question.question_type === "rating") {
    const min: number = question.metadata?.min_rating ?? 1;
    const max: number = question.metadata?.max_rating ?? 5;
    const boundsError = validateRatingBounds(value, min, max);
    if (boundsError) return boundsError;
  }

  return null;
}
