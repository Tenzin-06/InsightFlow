import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { AnalyzeTextPayloadSchema } from "../schemas/ai.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskStart,
  logTaskComplete,
  logTaskError,
} from "../utils/logging_utils.js";
import { NETWORK_RETRY_CONFIG, isRetryableError } from "../utils/retry_utils.js";
import { TASK_IDS } from "../constants/index.js";

/**
 * analyze-text — async AI text analysis workflow
 *
 * Workflow:
 *   Trigger.dev receives payload (jobId + text)
 *   → Validate payload (Zod)
 *   → Call Django internal execute endpoint
 *   → Django: load AIJob → AIGateway.run_text_generation → persist result
 *   → Task completes with AI output
 *
 * Retry strategy:
 *   Network / transient errors → retry (NETWORK_RETRY_CONFIG)
 *   Validation errors         → abort immediately (no retries)
 */
export const analyzeTextTask = task({
  id: TASK_IDS.ANALYZE_TEXT,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    // Step 1: Validate payload — fail fast, no retry
    const parsed = AnalyzeTextPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for analyze-text: ${parsed.error.message}`
      );
    }

    const { jobId } = parsed.data;
    logTaskStart(TASK_IDS.ANALYZE_TEXT, { jobId });

    // Step 2: Delegate to Django
    try {
      const result = await callDjangoApi(
        `/api/v1/internal/ai/jobs/${jobId}/execute/`,
        "POST"
      );
      logTaskComplete(TASK_IDS.ANALYZE_TEXT, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.ANALYZE_TEXT, error);
        throw new AbortTaskRunError(
          `Permanent failure for analyze-text job ${jobId}: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.ANALYZE_TEXT, { payload, error: String(error) });
  },
});
