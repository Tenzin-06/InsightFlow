import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { ProcessUploadPayloadSchema } from "../schemas/upload.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskStart,
  logTaskComplete,
  logTaskError,
} from "../utils/logging_utils.js";
import { UPLOAD_RETRY_CONFIG, isRetryableError } from "../utils/retry_utils.js";
import { TASK_IDS } from "../constants/index.js";

/**
 * process-audience-upload task
 *
 * Processes a CSV audience upload asynchronously.
 *
 * Workflow:
 *   Trigger.dev receives payload
 *   → Validate payload (Zod)
 *   → Call Django internal upload-processing endpoint
 *   → Django: parse CSV, validate recipients, deduplicate, bulk insert
 *   → Task completes with upload summary (uploaded, duplicates, invalid)
 *
 * Scalability goals:
 *   - Large CSV files processed outside the request cycle
 *   - Long-running processing does not block the API
 *   - Recoverable: failed uploads can be retried from the task level
 *
 * Retry strategy:
 *   - 4 attempts with generous backoff (uploads can take time)
 *   - Validation failures abort immediately
 */
export const processAudienceUploadTask = task({
  id: TASK_IDS.PROCESS_AUDIENCE_UPLOAD,
  retry: UPLOAD_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = ProcessUploadPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for process-audience-upload: ${parsed.error.message}`
      );
    }

    const { audienceId, uploadToken } = parsed.data;
    logTaskStart(TASK_IDS.PROCESS_AUDIENCE_UPLOAD, { audienceId, uploadToken });

    try {
      const result = await callDjangoApi(
        `/api/v1/internal/audiences/${audienceId}/process-upload/`,
        "POST",
        { uploadToken }
      );

      logTaskComplete(TASK_IDS.PROCESS_AUDIENCE_UPLOAD, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.PROCESS_AUDIENCE_UPLOAD, error);
        throw new AbortTaskRunError(
          `Permanent failure for audience upload ${audienceId}: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.PROCESS_AUDIENCE_UPLOAD, {
      payload,
      error: String(error),
    });
  },
});
