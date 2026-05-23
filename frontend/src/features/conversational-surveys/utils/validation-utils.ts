/**
 * Validation Utilities
 *
 * Pure validation functions for conversational survey answers.
 * Each function returns a human-readable error string or null (valid).
 */

import type { AnswerValue } from "../types";
import { DEFAULT_RATING_MIN, DEFAULT_RATING_MAX } from "../constants";

/**
 * Validates that a required question has been answered.
 * Returns an error message string or null.
 */
export function validateRequiredAnswer(value: AnswerValue): string | null {
  if (value === null || value === undefined) {
    return "Please answer before continuing.";
  }
  if (typeof value === "string" && value.trim() === "") {
    return "Please answer before continuing.";
  }
  if (Array.isArray(value) && value.length === 0) {
    return "Please select at least one option.";
  }
  return null;
}

/**
 * Validates that a rating value is within the allowed min/max bounds.
 * Returns an error message string or null.
 */
export function validateRatingBounds(
  value: AnswerValue,
  min: number = DEFAULT_RATING_MIN,
  max: number = DEFAULT_RATING_MAX
): string | null {
  if (value === null || value === undefined) return null; // covered by required check
  const num = Number(value);
  if (isNaN(num)) {
    return "Please select a valid rating.";
  }
  if (num < min || num > max) {
    return `Rating must be between ${min} and ${max}.`;
  }
  return null;
}

/**
 * Validates that a checkbox answer contains at least one selection.
 * Returns an error message string or null.
 */
export function validateCheckboxMinimum(value: AnswerValue): string | null {
  if (!Array.isArray(value) || value.length === 0) {
    return "Please select at least one option.";
  }
  return null;
}
