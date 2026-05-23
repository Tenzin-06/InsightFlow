/**
 * useConversationTransitions
 *
 * Coordinates UI transition timing: typing indicator + question advance.
 *
 * Flow:
 *   setIsTyping(true)
 *   → wait TYPING_DELAY_MS
 *   → setIsTyping(false)
 *   → call onAdvance() (caller decides next step)
 *
 * Async callbacks read fresh state via useConversationStore.getState()
 * to avoid stale-closure issues inside setTimeout.
 */

import { useCallback } from "react";
import { useConversationStore } from "../stores/conversation-store";
import { TYPING_DELAY_MS } from "../constants";

export interface ConversationTransitionsResult {
  /**
   * Triggers the typing indicator, then after the configured delay
   * calls onAdvance (which should advance the question or submit).
   */
  scheduleTransition: (onAdvance: () => void) => void;
}

export function useConversationTransitions(): ConversationTransitionsResult {
  const setIsTyping = useConversationStore((s) => s.setIsTyping);

  const scheduleTransition = useCallback(
    (onAdvance: () => void) => {
      setIsTyping(true);

      setTimeout(() => {
        // Use getState() for a fresh read — avoids stale closures
        useConversationStore.getState().setIsTyping(false);
        onAdvance();
      }, TYPING_DELAY_MS);
    },
    [setIsTyping]
  );

  return { scheduleTransition };
}
