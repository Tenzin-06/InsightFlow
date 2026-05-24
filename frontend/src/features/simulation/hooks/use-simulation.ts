import { useMemo, useState } from "react";

import {
  useCreateSimulationRun,
  useSimulationRunDetails,
  useSimulationRuns,
} from "@/features/simulation/hooks/use-simulation-runs";
import { executeSimulationRun } from "@/features/simulation/services/simulation-api";
import type { CreateSimulationRunPayload } from "@/features/simulation/types";

export function useSimulation() {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executeError, setExecuteError] = useState<string | null>(null);

  const runsQuery = useSimulationRuns();
  const createRunMutation = useCreateSimulationRun();
  const detailsQuery = useSimulationRunDetails(selectedRunId);

  const activeRuns = useMemo(
    () =>
      (runsQuery.data?.results ?? []).filter((run) =>
        ["pending", "validating", "running", "generating", "aggregating"].includes(run.status),
      ),
    [runsQuery.data?.results],
  );

  /**
   * Creates a simulation run then immediately triggers synchronous Gemini
   * execution (POST /simulation/runs/<id>/execute/).
   *
   * The execute call may take 15–60 seconds while Gemini generates responses
   * for each persona.  isExecuting stays true until it resolves or errors.
   */
  async function createRun(payload: CreateSimulationRunPayload) {
    setExecuteError(null);

    // 1. Create the run (status = "pending")
    const run = await createRunMutation.mutateAsync(payload);
    setSelectedRunId(run.id);

    // 2. Immediately kick off synchronous AI execution
    setIsExecuting(true);
    try {
      await executeSimulationRun(run.id);
      // Invalidation happens via refetchInterval in useSimulationRunDetails
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "AI execution failed. Check run status for details.";
      setExecuteError(message);
    } finally {
      setIsExecuting(false);
    }

    return run;
  }

  return {
    selectedRunId,
    setSelectedRunId,
    activeRuns,
    runsQuery,
    createRunMutation,
    detailsQuery,
    isExecuting,
    executeError,
    createRun,
  };
}
