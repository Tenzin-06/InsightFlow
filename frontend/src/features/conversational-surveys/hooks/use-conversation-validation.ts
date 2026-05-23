/**
 * useConversationValidation
 *
 * Wraps the validation-service to give the flow hook a consistent
 * validate/clear interface backed by the Zustand store.
 */

import { useCallback } from "react";
import { useConversationStore } from "../stores/conversation-store";
import { validateConversationalAnswer } from "../services/validation-service";
import type { PublicQuestion, AnswerValue } from "../types";

export interface ConversationValidationResult {
  /** Current validation error for the active question (null = none) */
  validationError: string | null;

  /**
   * Validate `value` against `question`.
   * Updates the store's validationError and returns true if valid.
   */
  validate: (question: PublicQuestion, value: AnswerValue) => boolean;

  /** Clears any active validation error */
  clearValidationError: () => void;
}

export function useConversationValidation(): ConversationValidationResult {
  const validationError = useConversationStore((s) => s.validationError);
  const setValidationError = useConversationStore((s) => s.setValidationError);

  const validate = useCallback(
    (question: PublicQuestion, value: AnswerValue): boolean => {
      const error = validateConversationalAnswer(question, value);
      setValidationError(error);
      return error === null;
    },
    [setValidationError]
  );

  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, [setValidationError]);

  return { validationError, validate, clearValidationError };
}
