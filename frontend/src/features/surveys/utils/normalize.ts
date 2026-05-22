import type { Survey, Question, QuestionMetadata, SurveyMetadata } from "@/features/surveys/types";

export function normalizeQuestionMetadata(raw: unknown): QuestionMetadata {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const m = raw as Record<string, unknown>;
  return {
    ...(Array.isArray(m.choices) ? { choices: m.choices as string[] } : {}),
    ...(typeof m.min_rating === "number" ? { min_rating: m.min_rating } : {}),
    ...(typeof m.max_rating === "number" ? { max_rating: m.max_rating } : {}),
  };
}

export function normalizeSurveyMetadata(raw: unknown): SurveyMetadata {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as SurveyMetadata;
}

export function normalizeQuestion(raw: Question): Question {
  return {
    ...raw,
    metadata: normalizeQuestionMetadata(raw.metadata),
  };
}

export function normalizeSurvey(raw: Survey): Survey {
  return {
    ...raw,
    description: raw.description ?? "",
  };
}
