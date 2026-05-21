import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/features/surveys/services/survey-api";
import type { CreateQuestionPayload, UpdateQuestionPayload } from "@/features/surveys/types";

export function useQuestions(surveyId: string) {
  return useQuery({
    queryKey: ["questions", surveyId],
    queryFn: () => getQuestions(surveyId),
    enabled: !!surveyId,
  });
}

export function useCreateQuestion(surveyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuestionPayload) => createQuestion(surveyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", surveyId] });
      queryClient.invalidateQueries({ queryKey: ["survey", surveyId] });
      toast.success("Question added");
    },
    onError: (error) => {
      const e = error as { status?: number } | null;
      if (!e?.status) toast.error("Cannot connect to server — make sure the backend is running.");
      else toast.error("Failed to add question");
    },
  });
}

export function useUpdateQuestion(surveyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateQuestionPayload }) =>
      updateQuestion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", surveyId] });
    },
    onError: () => {
      toast.error("Failed to update question");
    },
  });
}

export function useDeleteQuestion(surveyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", surveyId] });
      queryClient.invalidateQueries({ queryKey: ["survey", surveyId] });
      toast.success("Question deleted");
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });
}
