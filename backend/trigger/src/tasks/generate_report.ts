import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskStart,
  logTaskComplete,
  logTaskError,
} from "../utils/logging_utils.js";
import { DEFAULT_RETRY_CONFIG, isRetryableError } from "../utils/retry_utils.js";
import { TASK_IDS } from "../constants/index.js";

const GenerateReportPayloadSchema = z.object({
  surveyId: z.number().int().positive(),
  reportType: z.enum(["summary", "full"]).default("summary"),
});

/**
 * generate-report task
 *
 * Generates an analytics report for a survey in the background.
 *
 * Workflow:
 *   Trigger.dev receives payload
 *   → Validate payload (Zod)
 *   → Call Django report generation endpoint
 *   → Django aggregates responses, builds analytics, stores result
 *   → Task completes with report ID
 *
 * Future expansion: PDF generation, export packaging.
 */
export const generateReportTask = task({
  id: TASK_IDS.GENERATE_REPORT,
  retry: DEFAULT_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = GenerateReportPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for generate-report: ${parsed.error.message}`
      );
    }

    const { surveyId, reportType } = parsed.data;
    logTaskStart(TASK_IDS.GENERATE_REPORT, { surveyId, reportType });

    try {
      const result = await callDjangoApi(
        `/api/v1/internal/surveys/${surveyId}/generate-report/`,
        "POST",
        { reportType }
      );

      logTaskComplete(TASK_IDS.GENERATE_REPORT, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.GENERATE_REPORT, error);
        throw new AbortTaskRunError(
          `Permanent failure generating report for survey ${surveyId}: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.GENERATE_REPORT, { payload, error: String(error) });
  },
});
