export const QUESTION_TYPE_LABELS: Record<string, string> = {
  short_text: "Short Answer",
  long_text: "Long Answer",
  multiple_choice: "Multiple Choice",
  checkbox: "Multiple Select",
  rating: "Rating Scale",
};

export const DEFAULT_RATING_MIN = 1;
export const DEFAULT_RATING_MAX = 5;

/**
 * Average seconds a respondent takes per question — used for time estimates.
 */
export const SECONDS_PER_QUESTION = 30;
