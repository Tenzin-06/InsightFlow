import { useQuery } from "@tanstack/react-query";

import { getPublicSurvey } from "../services/public-survey-api";
import type { PublicSurvey } from "../types";

export function usePublicSurvey(surveyId: string) {
  return useQuery<PublicSurvey, { message: string; status?: number }>({
    queryKey: ["public-survey", surveyId],
    queryFn: () => getPublicSurvey(surveyId),
    enabled: !!surveyId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 min — survey structure rarely changes mid-session
  });
}
