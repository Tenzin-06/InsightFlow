import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAudience,
  getAudiences,
  updateAudience,
} from "@/features/audiences/services/audience-api";
import type { Audience, CreateAudiencePayload, UpdateAudiencePayload } from "@/features/audiences/types";

export const AUDIENCES_QUERY_KEY = ["audiences"] as const;

export function apiErrorMessage(error: unknown, fallback: string): string {
  const e = error as { message?: string; status?: number } | null;
  if (!e) return fallback;
  if (!e.status) return "Cannot connect to server - make sure the backend is running.";
  if (e.status === 401) return "Session expired. Please sign out and sign back in.";
  if (e.status === 403) return "You don't have permission to do that.";
  return e.message ?? fallback;
}

export function useAudiences() {
  return useQuery({
    queryKey: AUDIENCES_QUERY_KEY,
    queryFn: getAudiences,
  });
}

export function useCreateAudience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAudiencePayload) => createAudience(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUDIENCES_QUERY_KEY });
      toast.success("Audience created");
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, "Failed to create audience"));
    },
  });
}

export function useUpdateAudience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAudiencePayload }) =>
      updateAudience(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["audience", id] });
      await queryClient.cancelQueries({ queryKey: AUDIENCES_QUERY_KEY });

      const previousAudience = queryClient.getQueryData<Audience>(["audience", id]);
      const previousAudiences = queryClient.getQueryData<Audience[]>(AUDIENCES_QUERY_KEY);

      if (previousAudience) {
        queryClient.setQueryData<Audience>(["audience", id], { ...previousAudience, ...payload });
      }
      queryClient.setQueryData<Audience[]>(AUDIENCES_QUERY_KEY, (old) =>
        (old ?? []).map((audience) =>
          audience.id === id ? { ...audience, ...payload } : audience
        )
      );

      return { previousAudience, previousAudiences, id };
    },
    onError: (error, _, context) => {
      if (context?.previousAudience) {
        queryClient.setQueryData(["audience", context.id], context.previousAudience);
      }
      if (context?.previousAudiences) {
        queryClient.setQueryData(AUDIENCES_QUERY_KEY, context.previousAudiences);
      }
      toast.error(apiErrorMessage(error, "Failed to update audience"));
    },
    onSuccess: () => {
      toast.success("Audience updated");
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: AUDIENCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["audience", variables.id] });
    },
  });
}
