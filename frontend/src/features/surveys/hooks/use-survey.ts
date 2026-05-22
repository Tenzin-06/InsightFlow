import { useQuery } from "@tanstack/react-query";
import { getSurveyById } from "@/features/surveys/services/survey-api";

export function useSurvey(id: string) {
  return useQuery({
    queryKey: ["survey", id],
    queryFn: () => getSurveyById(id),
    enabled: !!id,
  });
}
