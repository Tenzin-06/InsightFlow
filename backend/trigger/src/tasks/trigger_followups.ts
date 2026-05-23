import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { TASK_IDS } from "../constants/index.js";
import { TriggerFollowupsPayloadSchema } from "../schemas/optimization.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";
import { isRetryableError, NETWORK_RETRY_CONFIG } from "../utils/retry_utils.js";

/**
 * trigger-followups
 * ~~~~~~~~~~~~~~~~~
 * Triggers optimized follow-up reminder delivery for a campaign.
 * Delegates to Django's /api/v1/internal/optimization/trigger-followups/
 */
export const triggerFollowupsTask = task({
  id: TASK_IDS.TRIGGER_FOLLOWUPS,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = TriggerFollowupsPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for trigger-followups: ${parsed.error.message}`
      );
    }

    logTaskStart(TASK_IDS.TRIGGER_FOLLOWUPS, parsed.data);

    try {
      const result = await callDjangoApi(
        "/api/v1/internal/optimization/trigger-followups/",
        "POST",
        parsed.data
      );
      logTaskComplete(TASK_IDS.TRIGGER_FOLLOWUPS, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.TRIGGER_FOLLOWUPS, error);
        throw new AbortTaskRunError(
          `Permanent failure in trigger-followups: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.TRIGGER_FOLLOWUPS, {
      payload,
      error: String(error),
    });
  },
});
