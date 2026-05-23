import type { QuestionType, QuestionMetadata } from "@/features/surveys/types";

export type { QuestionType, QuestionMetadata };

// ---------------------------------------------------------------------------
// Public survey shape (returned by the public survey API)
// ---------------------------------------------------------------------------

export type PublicQuestion = {
  id: string;
  question_text: string;
  question_type: QuestionType;
  is_required: boolean;
  order: number;
  metadata: QuestionMetadata;
};

export type PublicSurvey = {
  id: string;
  title: string;
  description: string;
  question_count: number;
  questions: PublicQuestion[];
};

// ---------------------------------------------------------------------------
// Form & submission types
// ---------------------------------------------------------------------------

export type AnswerValue = string | string[] | number | null;

/**
 * Flat record keyed by question.id → answer value.
 * Used as react-hook-form's TFieldValues.
 */
export type SurveyFormValues = Record<string, AnswerValue>;

export type AnswerPayload = {
  question_id: string;
  value: AnswerValue;
};

export type SubmissionPayload = {
  answers: AnswerPayload[];
  metadata?: {
    engagement_session_id?: string;
    [key: string]: unknown;
  };
};

// ---------------------------------------------------------------------------
// Error classification
// ---------------------------------------------------------------------------

export type PublicSurveyErrorType = "not_found" | "unavailable" | "network";
