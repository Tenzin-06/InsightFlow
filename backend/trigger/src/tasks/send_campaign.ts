import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { SendCampaignPayloadSchema } from "../schemas/campaign.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskStart,
  logTaskComplete,
  logTaskError,
} from "../utils/logging_utils.js";
import { NETWORK_RETRY_CONFIG } from "../utils/retry_utils.js";
import { isRetryableError } from "../utils/retry_utils.js";
import { TASK_IDS } from "../constants/index.js";

/**
 * send-campaign task
 *
 * Executes bulk email delivery for a campaign.
 *
 * Workflow:
 *   Trigger.dev receives payload
 *   → Validate payload (Zod)
 *   → Call Django internal processing endpoint
 *   → Django: load audience, render templates, send via Resend, persist delivery logs
 *   → Task completes with delivery summary
 *
 * Retry strategy:
 *   - Network errors and provider timeouts → retry (up to 5 attempts, exponential backoff)
 *   - Validation and missing-resource errors → abort immediately (no retries)
 */
export const sendCampaignTask = task({
  id: TASK_IDS.SEND_CAMPAIGN,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    // Step 1: Validate payload — fail fast on invalid input (no retry)
    const parsed = SendCampaignPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for send-campaign: ${parsed.error.message}`
      );
    }

    const { campaignId } = parsed.data;
    logTaskStart(TASK_IDS.SEND_CAMPAIGN, { campaignId });

    // Step 2: Delegate processing to Django backend
    try {
      const result = await callDjangoApi(
        `/api/v1/internal/campaigns/${campaignId}/process/`
      );

      logTaskComplete(TASK_IDS.SEND_CAMPAIGN, result);
      return result;
    } catch (error) {
      // Let Trigger.dev decide whether to retry based on error type
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.SEND_CAMPAIGN, error);
        throw new AbortTaskRunError(
          `Permanent failure for campaign ${campaignId}: ${String(error)}`
        );
      }
      // Transient error — re-throw so Trigger.dev retries
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.SEND_CAMPAIGN, {
      payload,
      error: String(error),
    });
  },
});
