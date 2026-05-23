import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { SimulationRunPayloadSchema } from "../schemas/simulation.schema.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";
import { TASK_IDS } from "../constants/index.js";

export const validateSimulationTask = task({
  id: TASK_IDS.VALIDATE_SIMULATION,

  run: async (payload: unknown) => {
    const parsed = SimulationRunPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for validate-simulation: ${parsed.error.message}`
      );
    }

    logTaskStart(TASK_IDS.VALIDATE_SIMULATION, parsed.data);
    logTaskComplete(TASK_IDS.VALIDATE_SIMULATION, {
      success: true,
      data: parsed.data,
      error: null,
    });
    return { success: true, data: parsed.data, error: null };
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.VALIDATE_SIMULATION, { payload, error: String(error) });
  },
});

