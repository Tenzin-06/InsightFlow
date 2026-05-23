/**
 * Conversation State Snapshot
 *
 * Describes a point-in-time snapshot of the conversation state.
 * Designed to support future autosave, draft restoration, and
 * session persistence without coupling to the Zustand store shape.
 */

import type { ConversationPhase, ConversationMessage, AnswerValue } from "../types";

/**
 * A serializable snapshot of conversational survey state.
 *
 * Future uses:
 * - autosave to localStorage / IndexedDB
 * - draft restoration on page reload
 * - reconnect recovery after network loss
 * - session handoff between devices
 */
export type ConversationStateSnapshot = {
  /** The survey being answered */
  surveyId: string;

  /** Current phase of the state machine */
  phase: ConversationPhase;

  /** Index of the question currently awaiting input */
  currentQuestionIndex: number;

  /** All answers collected so far, keyed by question id */
  answers: Record<string, AnswerValue>;

  /** Ordered list of question ids that have been answered */
  completedQuestions: string[];

  /** Full conversation message history */
  messages: ConversationMessage[];

  /** ISO timestamp when this snapshot was taken */
  snapshotAt: string;
};
