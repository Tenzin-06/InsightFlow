import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskStart,
  logTaskComplete,
  logTaskError,
} from "../utils/logging_utils.js";
import { DEFAULT_RETRY_CONFIG } from "../utils/retry_utils.js";
import { TASK_IDS } from "../constants/index.js";

const CleanupJobsPayloadSchema = z.object({
  olderThanDays: z.number().int().positive().default(30),
});

/**
 * cleanup-jobs task
 *
 * Removes stale BackgroundJob records older than the specified threshold.
 * Keeps the job tracking table lean and prevents unbounded growth.
 *
 * Intended for future scheduled execution (nightly cron).
 * Currently triggered manually.
 *
 * Retry strategy: 3 attempts (standard — database operations may have transient failures).
 */
export const cleanupJobsTask = task({
  id: TASK_IDS.CLEANUP_JOBS,
  retry: DEFAULT_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = CleanupJobsPayloadSchema.safeParse(payload ?? {});
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for cleanup-jobs: ${parsed.error.message}`
      );
    }

    const { olderThanDays } = parsed.data;
    logTaskStart(TASK_IDS.CLEANUP_JOBS, { olderThanDays });

    const result = await callDjangoApi(
      `/api/v1/internal/jobs/cleanup/`,
      "POST",
      { olderThanDays }
    );

    logTaskComplete(TASK_IDS.CLEANUP_JOBS, result);
    return result;
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.CLEANUP_JOBS, { payload, error: String(error) });
  },
});
