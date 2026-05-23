import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { TASK_IDS } from "../constants/index.js";
import { ProcessNonrespondentsPayloadSchema } from "../schemas/optimization.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";
import { isRetryableError, NETWORK_RETRY_CONFIG } from "../utils/retry_utils.js";

/**
 * process-nonrespondents
 * ~~~~~~~~~~~~~~~~~~~~~~
 * Identifies recipients who have not completed surveys for a given campaign.
 * Delegates to Django's /api/v1/internal/optimization/process-nonrespondents/
 */
export const processNonrespondentsTask = task({
  id: TASK_IDS.PROCESS_NONRESPONDENTS,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = ProcessNonrespondentsPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for process-nonrespondents: ${parsed.error.message}`
      );
    }

    logTaskStart(TASK_IDS.PROCESS_NONRESPONDENTS, parsed.data);

    try {
      const result = await callDjangoApi(
        "/api/v1/internal/optimization/process-nonrespondents/",
        "POST",
        parsed.data
      );
      logTaskComplete(TASK_IDS.PROCESS_NONRESPONDENTS, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.PROCESS_NONRESPONDENTS, error);
        throw new AbortTaskRunError(
          `Permanent failure in process-nonrespondents: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.PROCESS_NONRESPONDENTS, {
      payload,
      error: String(error),
    });
  },
});
