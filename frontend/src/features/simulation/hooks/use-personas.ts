import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createPersona, listPersonas, updatePersona } from "@/features/simulation/services/persona-api";
import type { CreatePersonaPayload, UpdatePersonaPayload } from "@/features/simulation/types";

const PERSONAS_QUERY_KEY = ["simulation-personas"];

export function usePersonas() {
  return useQuery({
    queryKey: PERSONAS_QUERY_KEY,
    queryFn: listPersonas,
  });
}

export function useCreatePersona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePersonaPayload) => createPersona(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERSONAS_QUERY_KEY });
    },
  });
}

export function useUpdatePersona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePersonaPayload }) =>
      updatePersona(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERSONAS_QUERY_KEY });
    },
  });
}

