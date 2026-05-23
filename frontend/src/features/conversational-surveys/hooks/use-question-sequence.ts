/**
 * useQuestionSequence
 *
 * Provides question progression helpers derived from the question list
 * and the current Zustand index. All predicates are computed from the
 * pure progression-utils functions.
 */

import { useConversationStore } from "../stores/conversation-store";
import {
  isAutoAdvanceType,
  isLastQuestion,
  getNextIndex,
} from "../utils/progression-utils";
import type { QuestionType, PublicQuestion } from "../types";

interface UseQuestionSequenceParams {
  questions: PublicQuestion[];
}

export interface QuestionSequenceResult {
  /** True if the given question type auto-advances on tap */
  checkIsAutoAdvance: (type: QuestionType) => boolean;

  /** True if the given index is the last question */
  checkIsLast: (index: number) => boolean;

  /** Returns the next sequential index (clamped) */
  nextIndex: (index: number) => number;

  /** Total number of questions */
  totalCount: number;
}

export function useQuestionSequence({
  questions,
}: UseQuestionSequenceParams): QuestionSequenceResult {
  const total = questions.length;

  // Expose the current index from the store (future branching support)
  useConversationStore((s) => s.currentQuestionIndex);

  return {
    checkIsAutoAdvance: isAutoAdvanceType,
    checkIsLast: (index: number) => isLastQuestion(index, total),
    nextIndex: (index: number) => getNextIndex(index, total),
    totalCount: total,
  };
}
