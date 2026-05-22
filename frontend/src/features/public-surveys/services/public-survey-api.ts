/**
 * Public Survey API Service
 *
 * Uses a standalone Axios client that does NOT attach auth tokens, since
 * public survey participation does not require authentication.
 *
 * Backend endpoint notes:
 *  - GET  /api/v1/surveys/{id}/        → survey detail with nested questions
 *                                         (backend must expose this AllowAny)
 *  - POST /api/v1/surveys/{id}/submit/ → submit answers (already AllowAny, Unit 14)
 */

import axios from "axios";

import { API_CONFIG } from "@/lib/api/config";
import type { ApiResponse } from "@/lib/api/types";
import type { PublicSurvey, SubmissionPayload } from "../types";

// ---------------------------------------------------------------------------
// Standalone public client — no auth injection
// ---------------------------------------------------------------------------

const publicClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: { "Content-Type": "application/json" },
});

// Normalise error shape for consistent error handling
publicClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error?.response?.status;
    const message: string =
      error?.response?.data?.error?.message ??
      error?.response?.data?.detail ??
      error?.message ??
      "Unknown error";
    return Promise.reject({ message, status });
  }
);

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

/**
 * Fetch a published survey with its questions.
 * Uses the dedicated /public/ endpoint which requires no authentication
 * and only returns surveys with status=published.
 */
export async function getPublicSurvey(surveyId: string): Promise<PublicSurvey> {
  const res = await publicClient.get<ApiResponse<PublicSurvey>>(
    `/surveys/${surveyId}/public/`
  );
  return res.data.data;
}

/**
 * Submit a respondent's answers to a survey.
 * Corresponds to the AllowAny endpoint created in Unit 14.
 */
export async function submitSurvey(
  surveyId: string,
  payload: SubmissionPayload
): Promise<void> {
  await publicClient.post(`/surveys/${surveyId}/submit/`, payload);
}
