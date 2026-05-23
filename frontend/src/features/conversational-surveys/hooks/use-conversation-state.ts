/**
 * useConversationState
 *
 * Provides component access to the core conversation store state.
 * Returns only the state slice — actions live in the store itself.
 *
 * Components that need actions should import useConversationStore directly.
 */

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

/**
 * Returns the full conversation state slice from the Zustand store.
 *
 * Prefer this hook in display components that read state but don't
 * dispatch actions directly.
 */
export function useConversationState(): ConversationStateSlice {
  return useConversationStore((s) => ({
    phase: s.phase,
    currentQuestionIndex: s.currentQuestionIndex,
    answers: s.answers,
    completedQuestions: s.completedQuestions,
    isTyping: s.isTyping,
    isSubmitting: s.isSubmitting,
    isComplete: s.isComplete,
    messages: s.messages,
    validationError: s.validationError,
  }));
}
