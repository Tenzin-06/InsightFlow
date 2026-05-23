import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { TASK_IDS } from "../constants/index.js";
import { ReminderPayloadSchema } from "../schemas/automation.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";
import { isRetryableError, NETWORK_RETRY_CONFIG } from "../utils/retry_utils.js";

export const evaluateFollowupsTask = task({
  id: TASK_IDS.EVALUATE_FOLLOWUPS,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = ReminderPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for evaluate-followups: ${parsed.error.message}`
      );
    }

    logTaskStart(TASK_IDS.EVALUATE_FOLLOWUPS, parsed.data);

    try {
      const result = await callDjangoApi(
        "/api/v1/internal/automations/evaluate-followups/",
        "POST",
        parsed.data
      );
      logTaskComplete(TASK_IDS.EVALUATE_FOLLOWUPS, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.EVALUATE_FOLLOWUPS, error);
        throw new AbortTaskRunError(
          `Permanent follow-up evaluation failure: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.EVALUATE_FOLLOWUPS, {
      payload,
      error: String(error),
    });
  },
});
