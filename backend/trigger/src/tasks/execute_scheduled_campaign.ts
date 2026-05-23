import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { TASK_IDS } from "../constants/index.js";
import { ExecuteScheduledCampaignPayloadSchema } from "../schemas/automation.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";
import { isRetryableError, NETWORK_RETRY_CONFIG } from "../utils/retry_utils.js";

export const executeScheduledCampaignTask = task({
  id: TASK_IDS.EXECUTE_SCHEDULED_CAMPAIGN,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = ExecuteScheduledCampaignPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for execute-scheduled-campaign: ${parsed.error.message}`
      );
    }

    const { scheduleId } = parsed.data;
    logTaskStart(TASK_IDS.EXECUTE_SCHEDULED_CAMPAIGN, { scheduleId });

    try {
      const result = await callDjangoApi(
        `/api/v1/internal/automations/${scheduleId}/execute/`
      );
      logTaskComplete(TASK_IDS.EXECUTE_SCHEDULED_CAMPAIGN, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.EXECUTE_SCHEDULED_CAMPAIGN, error);
        throw new AbortTaskRunError(
          `Permanent scheduled campaign failure for ${scheduleId}: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.EXECUTE_SCHEDULED_CAMPAIGN, {
      payload,
      error: String(error),
    });
  },
});

