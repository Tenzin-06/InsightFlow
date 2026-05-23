import { useMemo, useState } from "react";

import { useCreateSimulationRun, useSimulationRunDetails, useSimulationRuns } from "@/features/simulation/hooks/use-simulation-runs";
import type { CreateSimulationRunPayload } from "@/features/simulation/types";

export function useSimulation() {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

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

  async function createRun(payload: CreateSimulationRunPayload) {
    const run = await createRunMutation.mutateAsync(payload);
    setSelectedRunId(run.id);
    return run;
  }

  return {
    selectedRunId,
    setSelectedRunId,
    activeRuns,
    runsQuery,
    createRunMutation,
    detailsQuery,
    createRun,
  };
}

