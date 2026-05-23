/**
 * Conversational Survey Types
 *
 * Re-exports shared survey types from the public-surveys feature and adds
 * conversational-specific types for the chat-style one-question-at-a-time flow.
 */

// Re-export shared survey types
export type {
  PublicQuestion,
  PublicSurvey,
  AnswerValue,
  SubmissionPayload,
  AnswerPayload,
  QuestionType,
  QuestionMetadata,
} from "@/features/public-surveys/types";

// ---------------------------------------------------------------------------
// Conversation phase state machine
// ---------------------------------------------------------------------------

/**
 * Phase of the conversational survey experience:
 *
 * active           → user is answering questions one at a time
 * submitting       → all questions answered, API call in flight
 * complete         → submission successful, show completion screen
 * submission_error → API call failed, retry available
 */
export type ConversationPhase =
  | "active"
  | "submitting"
  | "complete"
  | "submission_error";

// ---------------------------------------------------------------------------
// Conversation message types (the chat history)
// ---------------------------------------------------------------------------

/** A survey question presented as a left-aligned chat bubble */
export type QuestionMessage = {
  type: "question";
  /** Unique message id (used as React key and animation key) */
  id: string;
  questionId: string;
  text: string;
  isRequired: boolean;
};

/** The respondent's answer presented as a right-aligned chat bubble */
export type AnswerMessage = {
  type: "answer";
  id: string;
  questionId: string;
  /** Human-readable representation of the answer value */
  displayValue: string;
};

export type ConversationMessage = QuestionMessage | AnswerMessage;

// ---------------------------------------------------------------------------
// Conversation flow state (returned by useConversationFlow)
// ---------------------------------------------------------------------------

export type ConversationFlowResult = {
  phase: ConversationPhase;
  setPhase: (phase: ConversationPhase) => void;

  /** The question currently accepting input (null when submitting/complete) */
  currentQuestion: import("@/features/public-surveys/types").PublicQuestion | null;
  currentIndex: number;
  totalCount: number;

  /** Accumulated answers keyed by question.id */
  answers: Record<string, import("@/features/public-surveys/types").AnswerValue>;

  /** Full conversation history (past Q+A pairs + current question) */
  messages: ConversationMessage[];

  /** True while the "typing indicator" is visible between questions */
  isTyping: boolean;

  /** Inline validation message for the current active question */
  validationError: string | null;
  clearValidationError: () => void;

  /** Called by each question component when the user commits an answer */
  submitAnswer: (value: import("@/features/public-surveys/types").AnswerValue) => void;
};
