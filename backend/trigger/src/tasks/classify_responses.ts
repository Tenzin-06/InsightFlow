import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { ClassifyResponsesPayloadSchema } from "../schemas/ai.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskStart,
  logTaskComplete,
  logTaskError,
} from "../utils/logging_utils.js";
import { NETWORK_RETRY_CONFIG, isRetryableError } from "../utils/retry_utils.js";
import { TASK_IDS } from "../constants/index.js";

/**
 * classify-responses — async AI classification workflow
 *
 * Workflow:
 *   Trigger.dev receives payload (jobId + responses[] + categories[])
 *   → Validate payload (Zod)
 *   → Call Django internal execute endpoint
 *   → Django: load AIJob → AIGateway.run_classification → persist result
 *   → Task completes with classification labels
 *
 * Retry strategy:
 *   Network / transient errors → retry (NETWORK_RETRY_CONFIG)
 *   Validation errors         → abort immediately (no retries)
 */
export const classifyResponsesTask = task({
  id: TASK_IDS.CLASSIFY_RESPONSES,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    // Step 1: Validate payload
    const parsed = ClassifyResponsesPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for classify-responses: ${parsed.error.message}`
      );
    }

    const { jobId } = parsed.data;
    logTaskStart(TASK_IDS.CLASSIFY_RESPONSES, { jobId });

    // Step 2: Delegate to Django
    try {
      const result = await callDjangoApi(
        `/api/v1/internal/ai/jobs/${jobId}/execute/`,
        "POST"
      );
      logTaskComplete(TASK_IDS.CLASSIFY_RESPONSES, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.CLASSIFY_RESPONSES, error);
        throw new AbortTaskRunError(
          `Permanent failure for classify-responses job ${jobId}: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.CLASSIFY_RESPONSES, { payload, error: String(error) });
  },
});
