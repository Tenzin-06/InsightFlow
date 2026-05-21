import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSurveys,
  createSurvey,
  updateSurvey,
  deleteSurvey,
} from "@/features/surveys/services/survey-api";
import type { CreateSurveyPayload, UpdateSurveyPayload } from "@/features/surveys/types";

export const SURVEYS_QUERY_KEY = ["surveys"] as const;

function apiErrorMessage(error: unknown, fallback: string): string {
  const e = error as { message?: string; status?: number } | null;
  if (!e) return fallback;
  if (!e.status) return "Cannot connect to server — make sure the backend is running.";
  if (e.status === 401) return "Session expired. Please sign out and sign back in.";
  if (e.status === 403) return "You don't have permission to do that.";
  return e.message ?? fallback;
}

export function useSurveys() {
  return useQuery({
    queryKey: SURVEYS_QUERY_KEY,
    queryFn: getSurveys,
  });
}

export function useCreateSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSurveyPayload) => createSurvey(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY });
      toast.success("Survey created");
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, "Failed to create survey"));
    },
  });
}

export function useUpdateSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSurveyPayload }) =>
      updateSurvey(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["survey", data.id] });
      toast.success("Survey updated");
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, "Failed to update survey"));
    },
  });
}

export function useDeleteSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSurvey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY });
      toast.success("Survey deleted");
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, "Failed to delete survey"));
    },
  });
}
