import type { PublicQuestion } from "../types";

interface UseQuestionNavigationParams {
  questions: PublicQuestion[];
  currentIndex: number;
}

/**
 * useQuestionNavigation
 *
 * Derives navigation-related values from the current question index.
 * Pure computation — no internal state. Used by the page and progress
 * indicator to display contextual information.
 */
export function useQuestionNavigation({
  questions,
  currentIndex,
}: UseQuestionNavigationParams) {
  const totalCount = questions.length;
  const currentQuestion = questions[currentIndex] ?? null;

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalCount - 1;

  /** 1-based number for display ("Question 3 of 7") */
  const displayNumber = currentIndex + 1;

  /** 0–100 completion percentage based on answered count */
  const percentage =
    totalCount === 0 ? 0 : Math.round((currentIndex / totalCount) * 100);

  return {
    currentQuestion,
    currentIndex,
    totalCount,
    displayNumber,
    isFirstQuestion,
    isLastQuestion,
    percentage,
  };
}
