/**
 * Public Survey API Service
 *
 * Uses a standalone Axios client that does NOT attach auth tokens, since
 * public survey participation does not require authentication.
 *
 * Endpoints (Unit 16):
 *  - GET  /api/v1/public/surveys/{id}/        → fetch a published survey with questions
 *  - POST /api/v1/public/surveys/{id}/submit/ → submit respondent answers
 *
 * Both endpoints accept anonymous and authenticated requests.
 * If a valid Bearer token is present on a submit request, the backend will
 * link the respondent FK on the created Response record.
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

// Normalise error shape for consistent error handling in hooks
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
 *
 * Calls GET /api/v1/public/surveys/{surveyId}/
 * Only surveys with status=published are returned.
 * Draft / archived / deleted surveys return a 404 which the hook surfaces
 * as the SurveyError component.
 */
export async function getPublicSurvey(surveyId: string): Promise<PublicSurvey> {
  const res = await publicClient.get<ApiResponse<PublicSurvey>>(
    `/public/surveys/${surveyId}/`
  );
  return res.data.data;
}

/**
 * Submit a respondent's answers to a published survey.
 *
 * Calls POST /api/v1/public/surveys/{surveyId}/submit/
 * The backend validates, normalises, and atomically persists the submission.
 * Any validation failure is reflected via a rejected promise with { message, status }.
 */
export async function submitSurvey(
  surveyId: string,
  payload: SubmissionPayload
): Promise<{ response_id: number }> {
  const res = await publicClient.post<ApiResponse<{ response_id: number }>>(
    `/public/surveys/${surveyId}/submit/`,
    payload
  );
  return res.data.data;
}
