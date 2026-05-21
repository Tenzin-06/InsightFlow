export type SurveyStatus = "draft" | "published" | "archived";

export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "rating";

export type Survey = {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  is_public: boolean;
  owner: string;
  question_count: number;
  response_count?: number;
  completion_rate?: number;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: string;
  survey: string;
  question_text: string;
  question_type: QuestionType;
  is_required: boolean;
  order: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CreateSurveyPayload = {
  title: string;
  description?: string;
  is_public?: boolean;
};

export type UpdateSurveyPayload = Partial<CreateSurveyPayload> & {
  status?: SurveyStatus;
};

export type CreateQuestionPayload = {
  question_text: string;
  question_type: QuestionType;
  is_required?: boolean;
  order?: number;
  metadata?: Record<string, unknown>;
};

export type UpdateQuestionPayload = Partial<CreateQuestionPayload>;
