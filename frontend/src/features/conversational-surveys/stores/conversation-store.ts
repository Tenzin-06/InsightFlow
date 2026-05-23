/**
 * Conversation Store (Zustand)
 *
 * Single source of truth for all conversational survey state.
 *
 * Design notes:
 * - All state is co-located here to prevent prop-drilling and
 *   stale-closure issues inside setTimeout callbacks.
 * - Hooks access this store via useConversationStore(); async
 *   callbacks use useConversationStore.getState() for fresh reads.
 * - Actions are kept intentionally minimal — one responsibility each.
 */

import { create } from "zustand";
import type {
  ConversationPhase,
  ConversationMessage,
  AnswerValue,
} from "../types";

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

export type ConversationState = {
  /** The survey currently being answered (null = not yet loaded) */
  surveyId: string | null;

  /** Index of the question currently accepting input */
  currentQuestionIndex: number;

  /** Answers keyed by String(question.id) */
  answers: Record<string, AnswerValue>;

  /** Ordered list of question ids that have been fully answered */
  completedQuestions: string[];

  /** True while the "typing indicator" animation is visible */
  isTyping: boolean;

  /** True while the API submission is in flight */
  isSubmitting: boolean;

  /** True after a successful submission */
  isComplete: boolean;

  /** Current phase of the experience state machine */
  phase: ConversationPhase;

  /** Conversation message history (questions + answer bubbles) */
  messages: ConversationMessage[];

  /** Inline validation error for the currently active question */
  validationError: string | null;
};

export type ConversationActions = {
  /** Initialize the store for a new survey session */
  initialize: (surveyId: string, firstMessage: ConversationMessage) => void;

  /** Move the active question index to a new position */
  advanceTo: (index: number) => void;

  /** Record an answer for the given question id */
  recordAnswer: (questionId: string, value: AnswerValue) => void;

  /** Mark a question id as completed (for progress tracking) */
  addCompletedQuestion: (questionId: string) => void;

  /** Append a message to the conversation history */
  addMessage: (message: ConversationMessage) => void;

  /** Set the typing indicator visibility */
  setIsTyping: (typing: boolean) => void;

  /** Set or clear the inline validation error */
  setValidationError: (error: string | null) => void;

  /** Transition to a new phase */
  setPhase: (phase: ConversationPhase) => void;

  /** Reset the store to its initial state */
  reset: () => void;
};

// ---------------------------------------------------------------------------
// Initial state (also used by reset)
// ---------------------------------------------------------------------------

const INITIAL_STATE: ConversationState = {
  surveyId: null,
  currentQuestionIndex: 0,
  answers: {},
  completedQuestions: [],
  isTyping: false,
  isSubmitting: false,
  isComplete: false,
  phase: "active",
  messages: [],
  validationError: null,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useConversationStore = create<ConversationState & ConversationActions>()(
  (set) => ({
    ...INITIAL_STATE,

    initialize: (surveyId, firstMessage) =>
      set({
        ...INITIAL_STATE,
        surveyId,
        messages: [firstMessage],
      }),

    advanceTo: (index) =>
      set({ currentQuestionIndex: index }),

    recordAnswer: (questionId, value) =>
      set((state) => ({
        answers: { ...state.answers, [questionId]: value },
      })),

    addCompletedQuestion: (questionId) =>
      set((state) => ({
        completedQuestions: state.completedQuestions.includes(questionId)
          ? state.completedQuestions
          : [...state.completedQuestions, questionId],
      })),

    addMessage: (message) =>
      set((state) => ({
        messages: [...state.messages, message],
      })),

    setIsTyping: (typing) =>
      set({ isTyping: typing }),

    setValidationError: (error) =>
      set({ validationError: error }),

    setPhase: (phase) =>
      set({
        phase,
        isSubmitting: phase === "submitting",
        isComplete: phase === "complete",
      }),

    reset: () => set(INITIAL_STATE),
  })
);
