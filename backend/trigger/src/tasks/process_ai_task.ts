import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { ProcessAITaskPayloadSchema } from "../schemas/ai.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskStart,
  logTaskComplete,
  logTaskError,
} from "../utils/logging_utils.js";
import { NETWORK_RETRY_CONFIG, isRetryableError } from "../utils/retry_utils.js";
import { TASK_IDS } from "../constants/index.js";

/**
 * process-ai-task — generic async AI execution workflow
 *
 * This task is the fallback / generic dispatcher. It receives only a jobId
 * and delegates entirely to Django, which determines the correct AI operation
 * from the persisted AIJob.job_type and AIJob.payload fields.
 *
 * Use this task when:
 *   - The job has been created with AIExecutionManager.create_job()
 *   - The job type and payload are already stored in Django
 *   - No type-specific Trigger.dev task is needed
 *
 * Workflow:
 *   Trigger.dev receives payload { jobId }
 *   → Validate payload (Zod)
 *   → POST /api/v1/internal/ai/jobs/{jobId}/execute/
 *   → Django dispatches based on job_type
 *   → Result stored in AIJob.result
 *
 * Retry strategy:
 *   Network / transient errors → retry (NETWORK_RETRY_CONFIG)
 *   Validation errors         → abort immediately (no retries)
 */
export const processAITaskTask = task({
  id: TASK_IDS.PROCESS_AI_TASK,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    // Step 1: Validate payload
    const parsed = ProcessAITaskPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for process-ai-task: ${parsed.error.message}`
      );
    }

    const { jobId } = parsed.data;
    logTaskStart(TASK_IDS.PROCESS_AI_TASK, { jobId });

    // Step 2: Delegate to Django — Django decides what to do based on job_type
    try {
      const result = await callDjangoApi(
        `/api/v1/internal/ai/jobs/${jobId}/execute/`,
        "POST"
      );
      logTaskComplete(TASK_IDS.PROCESS_AI_TASK, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.PROCESS_AI_TASK, error);
        throw new AbortTaskRunError(
          `Permanent failure for AI job ${jobId}: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.PROCESS_AI_TASK, { payload, error: String(error) });
  },
});
