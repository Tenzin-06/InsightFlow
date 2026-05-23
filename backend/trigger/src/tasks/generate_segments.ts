import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { TASK_IDS } from "../constants/index.js";
import { GenerateSegmentsPayloadSchema } from "../schemas/optimization.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";
import { isRetryableError, NETWORK_RETRY_CONFIG } from "../utils/retry_utils.js";

/**
 * generate-segments
 * ~~~~~~~~~~~~~~~~~
 * Generates engagement segments for all delivered recipients of a campaign.
 * Delegates to Django's /api/v1/internal/optimization/generate-segments/
 */
export const generateSegmentsTask = task({
  id: TASK_IDS.GENERATE_SEGMENTS,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = GenerateSegmentsPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for generate-segments: ${parsed.error.message}`
      );
    }

    logTaskStart(TASK_IDS.GENERATE_SEGMENTS, parsed.data);

    try {
      const result = await callDjangoApi(
        "/api/v1/internal/optimization/generate-segments/",
        "POST",
        parsed.data
      );
      logTaskComplete(TASK_IDS.GENERATE_SEGMENTS, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.GENERATE_SEGMENTS, error);
        throw new AbortTaskRunError(
          `Permanent failure in generate-segments: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.GENERATE_SEGMENTS, {
      payload,
      error: String(error),
    });
  },
});
