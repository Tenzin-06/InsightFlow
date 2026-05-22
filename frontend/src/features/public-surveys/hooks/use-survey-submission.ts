import { useMutation } from "@tanstack/react-query";

import { submitSurvey } from "../services/public-survey-api";
import type { SubmissionPayload } from "../types";

export function useSurveySubmission(surveyId: string) {
  return useMutation<
    { response_id: number },
    { message: string; status?: number },
    SubmissionPayload
  >({
    mutationFn: (payload: SubmissionPayload) => submitSurvey(surveyId, payload),
  });
}
