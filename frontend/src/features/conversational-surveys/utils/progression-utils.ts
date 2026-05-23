/**
 * Progression Utilities
 *
 * Pure functions for question sequence progression logic.
 * No React, no side-effects — fully testable in isolation.
 */

import type { QuestionType } from "../types";

/**
 * Question types that auto-advance without a "Continue" button.
 * The user's tap / click is the commit action itself.
 */
const AUTO_ADVANCE_TYPES: ReadonlySet<QuestionType> = new Set([
  "multiple_choice",
  "rating",
]);

/**
 * Returns true if the given question type should auto-advance
 * (i.e. no explicit Continue button required).
 */
export function isAutoAdvanceType(type: QuestionType): boolean {
  return AUTO_ADVANCE_TYPES.has(type);
}

/**
 * Returns true if the given index is the last question in the sequence.
 */
export function isLastQuestion(index: number, total: number): boolean {
  if (total === 0) return false;
  return index >= total - 1;
}

/**
 * Returns the next sequential question index.
 * Clamps to total - 1 as a safety guard.
 */
export function getNextIndex(currentIndex: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(currentIndex + 1, total - 1);
}

/**
 * Derives the 0–100 completion percentage from the number of completed
 * questions out of the total.
 */
export function calculateProgressPercentage(
  completedCount: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((completedCount / total) * 100);
}
