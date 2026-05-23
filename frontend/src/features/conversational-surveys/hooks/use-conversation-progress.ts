/**
 * useConversationProgress
 *
 * Derives progress metrics from the Zustand store's completedQuestions list
 * and the total question count.
 *
 * Uses completedQuestions (the authoritative answered set) rather than
 * currentQuestionIndex for accurate percentage tracking — they diverge
 * when optional questions are skipped.
 */

import { useConversationStore } from "../stores/conversation-store";
import { calculateProgressPercentage } from "../utils/progression-utils";

interface UseConversationProgressParams {
  totalQuestions: number;
}

export interface ConversationProgressResult {
  /** Number of questions answered so far */
  answeredCount: number;

  /** Total number of questions in the survey */
  totalCount: number;

  /** 1-based display number for "Question N of M" */
  displayNumber: number;

  /** 0–100 completion percentage */
  percentage: number;
}

export function useConversationProgress({
  totalQuestions,
}: UseConversationProgressParams): ConversationProgressResult {
  const completedQuestions = useConversationStore((s) => s.completedQuestions);
  const currentQuestionIndex = useConversationStore(
    (s) => s.currentQuestionIndex
  );

  const answeredCount = completedQuestions.length;
  const displayNumber = currentQuestionIndex + 1;
  const percentage = calculateProgressPercentage(answeredCount, totalQuestions);

  return {
    answeredCount,
    totalCount: totalQuestions,
    displayNumber,
    percentage,
  };
}
