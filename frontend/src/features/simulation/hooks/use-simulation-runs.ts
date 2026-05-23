import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSimulationRun, getSimulationRunDetails, getSimulationRuns } from "@/features/simulation/services/simulation-api";
import type { CreateSimulationRunPayload } from "@/features/simulation/types";

export function useSimulationRuns(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ["simulation-runs", limit, offset],
    queryFn: () => getSimulationRuns(limit, offset),
    refetchInterval: 8000,
  });
}

export function useSimulationRunDetails(runId: string | null) {
  return useQuery({
    queryKey: ["simulation-run-detail", runId],
    queryFn: () => getSimulationRunDetails(runId as string),
    enabled: Boolean(runId),
    refetchInterval: (query) => {
      const state = query.state.data?.run.status;
      if (!state) {
        return 6000;
      }
      return state === "completed" || state === "failed" || state === "blocked" ? false : 6000;
    },
  });
}

export function useCreateSimulationRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSimulationRunPayload) => createSimulationRun(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulation-runs"] });
    },
  });
}

