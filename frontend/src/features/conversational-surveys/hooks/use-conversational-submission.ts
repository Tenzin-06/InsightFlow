import { useMutation } from "@tanstack/react-query";

import { submitSurvey } from "../services/conversational-survey-api";
import type { SubmissionPayload } from "../types";

/**
 * useConversationalSubmission
 *
 * Wraps the survey submission mutation for the conversational flow.
 * Identical to useSurveySubmission from the standard public-surveys feature
 * but lives here so this feature stays self-contained and can be swapped
 * for an AI-aware submission endpoint in the future.
 */
export function useConversationalSubmission(surveyId: string) {
  return useMutation<
    { response_id: number },
    { message: string; status?: number },
    SubmissionPayload
  >({
    mutationFn: (payload: SubmissionPayload) => submitSurvey(surveyId, payload),
  });
}
