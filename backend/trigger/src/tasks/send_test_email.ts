import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { SendTestEmailPayloadSchema } from "../schemas/campaign.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskStart,
  logTaskComplete,
  logTaskError,
} from "../utils/logging_utils.js";
import { NETWORK_RETRY_CONFIG, isRetryableError } from "../utils/retry_utils.js";
import { TASK_IDS } from "../constants/index.js";

/**
 * send-test-email task
 *
 * Sends a single test email for QA template validation.
 * Does not alter campaign state or write delivery logs.
 *
 * Workflow:
 *   Trigger.dev receives payload
 *   → Validate payload (Zod)
 *   → Call Django test-send endpoint
 *   → Django renders template, sends via Resend to the test address
 *   → Task completes
 *
 * Retry strategy: same as send-campaign (network errors retried).
 */
export const sendTestEmailTask = task({
  id: TASK_IDS.SEND_TEST_EMAIL,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = SendTestEmailPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for send-test-email: ${parsed.error.message}`
      );
    }

    const { campaignId, email } = parsed.data;
    logTaskStart(TASK_IDS.SEND_TEST_EMAIL, { campaignId, email });

    try {
      const result = await callDjangoApi(
        `/api/v1/internal/campaigns/${campaignId}/test-process/`,
        "POST",
        { email }
      );

      logTaskComplete(TASK_IDS.SEND_TEST_EMAIL, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.SEND_TEST_EMAIL, error);
        throw new AbortTaskRunError(
          `Permanent failure for test email — campaign ${campaignId}: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.SEND_TEST_EMAIL, { payload, error: String(error) });
  },
});
