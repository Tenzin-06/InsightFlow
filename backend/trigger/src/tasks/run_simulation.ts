import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { SimulationRunPayloadSchema } from "../schemas/simulation.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";
import { NETWORK_RETRY_CONFIG, isRetryableError } from "../utils/retry_utils.js";
import { TASK_IDS } from "../constants/index.js";

export const runSimulationTask = task({
  id: TASK_IDS.RUN_SIMULATION,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = SimulationRunPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for run-simulation: ${parsed.error.message}`
      );
    }

    const { simulationRunId } = parsed.data;
    logTaskStart(TASK_IDS.RUN_SIMULATION, { simulationRunId });

    try {
      const result = await callDjangoApi(
        `/api/v1/internal/simulation/runs/${simulationRunId}/execute/`,
        "POST"
      );
      logTaskComplete(TASK_IDS.RUN_SIMULATION, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.RUN_SIMULATION, error);
        throw new AbortTaskRunError(
          `Permanent failure for simulation run ${simulationRunId}: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.RUN_SIMULATION, { payload, error: String(error) });
  },
});

