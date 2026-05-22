import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSurveys,
  createSurvey,
  updateSurvey,
  deleteSurvey,
} from "@/features/surveys/services/survey-api";
import type { CreateSurveyPayload, Survey, UpdateSurveyPayload } from "@/features/surveys/types";

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
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["survey", id] });
      await queryClient.cancelQueries({ queryKey: SURVEYS_QUERY_KEY });

      const previousSurvey = queryClient.getQueryData<Survey>(["survey", id]);
      const previousSurveys = queryClient.getQueryData<Survey[]>(SURVEYS_QUERY_KEY);

      if (previousSurvey) {
        queryClient.setQueryData<Survey>(["survey", id], { ...previousSurvey, ...payload });
      }
      queryClient.setQueryData<Survey[]>(SURVEYS_QUERY_KEY, (old) =>
        (old ?? []).map((s) => (s.id === id ? { ...s, ...payload } : s))
      );

      return { previousSurvey, previousSurveys, id };
    },
    onError: (error, _, context) => {
      if (context?.previousSurvey) {
        queryClient.setQueryData(["survey", context.id], context.previousSurvey);
      }
      if (context?.previousSurveys) {
        queryClient.setQueryData(SURVEYS_QUERY_KEY, context.previousSurveys);
      }
      toast.error(apiErrorMessage(error, "Failed to update survey"));
    },
    onSuccess: () => {
      toast.success("Survey updated");
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["survey", id] });
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
