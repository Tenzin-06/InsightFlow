import axios from "axios";

import { API_CONFIG } from "@/lib/api/config";
import type { AnswerValue, PublicQuestion, PublicSurvey } from "../types";
import { isAnswered } from "../utils";

const client = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: { "Content-Type": "application/json" },
});

type EngagementEventType = "survey_start" | "question_answered" | "survey_complete";

type TrackEventInput = {
  eventType: EngagementEventType;
  survey: PublicSurvey;
  formValues?: Record<string, AnswerValue>;
  questionId?: string;
};

const SESSION_PREFIX = "insightflow:engagement-session:";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getEngagementSessionId(surveyId: string) {
  const key = `${SESSION_PREFIX}${surveyId}`;
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const next = createSessionId();
  sessionStorage.setItem(key, next);
  return next;
}

export function getTrackingTokenFromUrl() {
  return new URLSearchParams(window.location.search).get("t") ?? undefined;
}

function countAnswered(questions: PublicQuestion[], formValues?: Record<string, AnswerValue>) {
  if (!formValues) return 0;
  return questions.filter((question) => isAnswered(formValues[question.id])).length;
}

export async function trackEngagementEvent(input: TrackEventInput) {
  const sessionId = getEngagementSessionId(input.survey.id);
  const answeredCount = countAnswered(input.survey.questions, input.formValues);
  const trackingToken = getTrackingTokenFromUrl();

  try {
    await client.post("/engagement/events/", {
      event_type: input.eventType,
      survey_id: Number(input.survey.id),
      session_id: sessionId,
      tracking_token: trackingToken,
      question_id: input.questionId ? Number(input.questionId) : undefined,
      answered_questions_count: answeredCount,
      total_questions_count: input.survey.questions.length,
      metadata: {
        source: "public_survey",
      },
    });
  } catch {
    // Tracking should never interrupt a respondent's survey experience.
  }
}

