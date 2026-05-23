/**
 * useConversationState
 *
 * Provides component access to the core conversation store state.
 * Returns only the state slice — actions live in the store itself.
 *
 * IMPORTANT: useShallow is required here. Without it, the selector returns a
 * new object literal on every render, Zustand sees a changed reference,
 * re-renders the component, which calls the selector again... infinite loop.
 */

import { useShallow } from "zustand/react/shallow";
import { useConversationStore } from "../stores/conversation-store";
import type { ConversationState } from "../stores/conversation-store";

export type ConversationStateSlice = Pick<
  ConversationState,
  | "phase"
  | "currentQuestionIndex"
  | "answers"
  | "completedQuestions"
  | "isTyping"
  | "isSubmitting"
  | "isComplete"
  | "messages"
  | "validationError"
>;

export function useConversationState(): ConversationStateSlice {
  return useConversationStore(
    useShallow((s) => ({
      phase: s.phase,
      currentQuestionIndex: s.currentQuestionIndex,
      answers: s.answers,
      completedQuestions: s.completedQuestions,
      isTyping: s.isTyping,
      isSubmitting: s.isSubmitting,
      isComplete: s.isComplete,
      messages: s.messages,
      validationError: s.validationError,
    }))
  );
}
