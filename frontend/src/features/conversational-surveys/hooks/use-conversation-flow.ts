/**
 * useConversationFlow
 *
 * The core orchestrator for the conversational one-question-at-a-time experience.
 *
 * Delegates to specialized hooks and the Zustand store for all state:
 *   - useConversationState     → reads store state
 *   - useConversationValidation → validates each answer
 *   - useConversationTransitions → manages timing / typing indicator
 *   - useQuestionSequence      → progression predicates
 *
 * The public interface (ConversationFlowResult) is unchanged so that
 * ConversationalSurveyPage requires no updates.
 *
 * State machine:
 *   active          → user answering questions sequentially
 *   submitting      → all answers in, API call in flight
 *   complete        → submission succeeded
 *   submission_error → submission failed, retry available
 *
 * Flow per answer:
 *   submitAnswer(value)
 *     → validate
 *     → record answer + completed question
 *     → append answer bubble
 *     → scheduleTransition:
 *         → setIsTyping(true)
 *         → after TYPING_DELAY_MS:
 *             if last → setPhase('submitting')
 *             else    → append next question bubble, advanceTo(next)
 */

import { useEffect, useCallback } from "react";

import { buildQuestionMessage, buildAnswerMessage } from "../utils";
import { useConversationStore } from "../stores/conversation-store";
import { useConversationState } from "./use-conversation-state";
import { useConversationValidation } from "./use-conversation-validation";
import { useConversationTransitions } from "./use-conversation-transitions";
import { useQuestionSequence } from "./use-question-sequence";

import type {
  PublicSurvey,
  PublicQuestion,
  AnswerValue,
  ConversationFlowResult,
} from "../types";

export function useConversationFlow(
  survey: PublicSurvey | undefined
): ConversationFlowResult {
  const questions: PublicQuestion[] = survey?.questions ?? [];

  // Store actions
  const initialize = useConversationStore((s) => s.initialize);
  const recordAnswer = useConversationStore((s) => s.recordAnswer);
  const addCompletedQuestion = useConversationStore((s) => s.addCompletedQuestion);
  const addMessage = useConversationStore((s) => s.addMessage);
  const storeSetPhase = useConversationStore((s) => s.setPhase);

  // Store state (read-only slice)
  const state = useConversationState();

  // Specialized hooks
  const { validate, clearValidationError } = useConversationValidation();
  const { scheduleTransition } = useConversationTransitions();
  const { checkIsLast, nextIndex } = useQuestionSequence({ questions });

  // Initialize the store when the survey first loads
  useEffect(() => {
    if (!survey || questions.length === 0) return;
    initialize(String(survey.id), buildQuestionMessage(questions[0]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey?.id]);

  const currentQuestion = questions[state.currentQuestionIndex] ?? null;
  const totalCount = questions.length;

  const setPhase = useCallback(
    (phase: Parameters<typeof storeSetPhase>[0]) => {
      storeSetPhase(phase);
    },
    [storeSetPhase]
  );

  const submitAnswer = useCallback(
    (value: AnswerValue) => {
      if (!currentQuestion) return;

      // Validate — side-effect: sets validationError in store
      if (!validate(currentQuestion, value)) return;

      // Read the current index fresh before scheduling the async transition
      const currentIdx = useConversationStore.getState().currentQuestionIndex;
      const isLast = checkIsLast(currentIdx);

      // Persist the answer and mark question completed
      const questionId = String(currentQuestion.id);
      recordAnswer(questionId, value);
      addCompletedQuestion(questionId);

      // Append the user's answer bubble to the conversation history
      addMessage(buildAnswerMessage(currentQuestion, value));

      // Schedule the typing delay, then advance or submit
      scheduleTransition(() => {
        // Re-read fresh state inside the callback to avoid stale closures
        const freshState = useConversationStore.getState();

        if (isLast) {
          freshState.setPhase("submitting");
        } else {
          const next = nextIndex(freshState.currentQuestionIndex);
          const nextQ = questions[next];
          if (nextQ) {
            freshState.addMessage(buildQuestionMessage(nextQ));
          }
          freshState.advanceTo(next);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentQuestion, questions, validate, recordAnswer, addCompletedQuestion, addMessage, scheduleTransition, checkIsLast, nextIndex]
  );

  return {
    phase: state.phase,
    setPhase,
    currentQuestion,
    currentIndex: state.currentQuestionIndex,
    totalCount,
    answers: state.answers,
    messages: state.messages,
    isTyping: state.isTyping,
    validationError: state.validationError,
    clearValidationError,
    submitAnswer,
  };
}
