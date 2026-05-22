import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} from "@/features/surveys/services/survey-api";
import type { CreateQuestionPayload, Question, UpdateQuestionPayload } from "@/features/surveys/types";

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
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["questions", surveyId] });
      const previous = queryClient.getQueryData<Question[]>(["questions", surveyId]);

      const optimistic: Question = {
        id: `temp-${Date.now()}`,
        survey: surveyId,
        question_text: payload.question_text,
        question_type: payload.question_type,
        is_required: payload.is_required ?? false,
        order: payload.order ?? (previous?.length ?? 0) + 1,
        metadata: payload.metadata ?? {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData<Question[]>(["questions", surveyId], (old) => [
        ...(old ?? []),
        optimistic,
      ]);

      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(["questions", surveyId], context.previous);
      }
      const e = error as { status?: number } | null;
      if (!e?.status) toast.error("Cannot connect to server — make sure the backend is running.");
      else toast.error("Failed to add question");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey", surveyId] });
      toast.success("Question added");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", surveyId] });
    },
  });
}

export function useUpdateQuestion(surveyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateQuestionPayload }) =>
      updateQuestion(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["questions", surveyId] });
      const previous = queryClient.getQueryData<Question[]>(["questions", surveyId]);

      queryClient.setQueryData<Question[]>(["questions", surveyId], (old) =>
        (old ?? []).map((q) => (q.id === id ? { ...q, ...payload } : q))
      );

      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(["questions", surveyId], context.previous);
      }
      toast.error("Failed to update question");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", surveyId] });
    },
  });
}

export function useDeleteQuestion(surveyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionId),
    onMutate: async (questionId) => {
      await queryClient.cancelQueries({ queryKey: ["questions", surveyId] });
      const previous = queryClient.getQueryData<Question[]>(["questions", surveyId]);

      queryClient.setQueryData<Question[]>(["questions", surveyId], (old) =>
        (old ?? []).filter((q) => q.id !== questionId)
      );

      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(["questions", surveyId], context.previous);
      }
      toast.error("Failed to delete question");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey", surveyId] });
      toast.success("Question deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", surveyId] });
    },
  });
}

export function useReorderQuestions(surveyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderQuestions(orderedIds),
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: ["questions", surveyId] });
      const previous = queryClient.getQueryData<Question[]>(["questions", surveyId]);

      const orderMap = new Map(orderedIds.map((id, idx) => [id, idx + 1]));
      queryClient.setQueryData<Question[]>(["questions", surveyId], (old) => {
        if (!old) return old;
        return [...old]
          .map((q) => ({ ...q, order: orderMap.get(q.id) ?? q.order }))
          .sort((a, b) => a.order - b.order);
      });

      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(["questions", surveyId], context.previous);
      }
      toast.error("Failed to reorder questions");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", surveyId] });
    },
  });
}
