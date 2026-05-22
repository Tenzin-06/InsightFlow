import { isAnswered } from "../utils";
import type { PublicQuestion, AnswerValue } from "../types";

export type SurveyProgressResult = {
  /** Number of questions that have a non-empty answer */
  answeredCount: number;
  /** Total number of questions in the survey */
  totalCount: number;
  /** Completion percentage (0–100) */
  percentage: number;
};

/**
 * Compute progress metrics from the current form values.
 * Pure function — no side effects, safe to call on every render.
 */
export function useSurveyProgress(
  questions: PublicQuestion[],
  formValues: Record<string, AnswerValue>
): SurveyProgressResult {
  const totalCount = questions.length;
  const answeredCount = questions.filter((q) => isAnswered(formValues[q.id])).length;
  const percentage = totalCount === 0 ? 0 : Math.round((answeredCount / totalCount) * 100);

  return { answeredCount, totalCount, percentage };
}
