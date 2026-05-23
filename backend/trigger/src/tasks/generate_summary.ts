import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { GenerateSummaryPayloadSchema } from "../schemas/ai.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskStart,
  logTaskComplete,
  logTaskError,
} from "../utils/logging_utils.js";
import { NETWORK_RETRY_CONFIG, isRetryableError } from "../utils/retry_utils.js";
import { TASK_IDS } from "../constants/index.js";

/**
 * generate-summary — async AI summarisation workflow
 *
 * Workflow:
 *   Trigger.dev receives payload (jobId + text + optional context)
 *   → Validate payload (Zod)
 *   → Call Django internal execute endpoint
 *   → Django: load AIJob → AIGateway.run_summarization → persist result
 *   → Task completes with summary output
 *
 * Retry strategy:
 *   Network / transient errors → retry (NETWORK_RETRY_CONFIG)
 *   Validation errors         → abort immediately (no retries)
 */
export const generateSummaryTask = task({
  id: TASK_IDS.GENERATE_SUMMARY,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    // Step 1: Validate payload
    const parsed = GenerateSummaryPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for generate-summary: ${parsed.error.message}`
      );
    }

    const { jobId } = parsed.data;
    logTaskStart(TASK_IDS.GENERATE_SUMMARY, { jobId });

    // Step 2: Delegate to Django
    try {
      const result = await callDjangoApi(
        `/api/v1/internal/ai/jobs/${jobId}/execute/`,
        "POST"
      );
      logTaskComplete(TASK_IDS.GENERATE_SUMMARY, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.GENERATE_SUMMARY, error);
        throw new AbortTaskRunError(
          `Permanent failure for generate-summary job ${jobId}: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.GENERATE_SUMMARY, { payload, error: String(error) });
  },
});
