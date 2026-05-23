export type SurveyStatus = "draft" | "published" | "archived";

export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "rating";

export type SurveyMetadata = {
  theme?: string;
  estimated_completion_time?: number;
  distribution_enabled?: boolean;
  [key: string]: unknown;
};

export type QuestionMetadata = {
  choices?: string[];
  min_rating?: number;
  max_rating?: number;
  [key: string]: unknown;
};

export type Survey = {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  slug?: string | null;
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
  metadata: QuestionMetadata;
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
  metadata?: QuestionMetadata;
};

export type UpdateQuestionPayload = Partial<CreateQuestionPayload>;
