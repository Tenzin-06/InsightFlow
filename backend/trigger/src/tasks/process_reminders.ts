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

export const processRemindersTask = task({
  id: TASK_IDS.PROCESS_REMINDERS,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = ReminderPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for process-reminders: ${parsed.error.message}`
      );
    }

    logTaskStart(TASK_IDS.PROCESS_REMINDERS, parsed.data);

    try {
      const result = await callDjangoApi(
        "/api/v1/internal/automations/process-reminders/",
        "POST",
        parsed.data
      );
      logTaskComplete(TASK_IDS.PROCESS_REMINDERS, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.PROCESS_REMINDERS, error);
        throw new AbortTaskRunError(
          `Permanent reminder processing failure: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.PROCESS_REMINDERS, {
      payload,
      error: String(error),
    });
  },
});

