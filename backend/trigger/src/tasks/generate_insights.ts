import { task } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { TASK_IDS } from "../constants/index.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";

const GenerateInsightsPayloadSchema = z.object({
  survey_id: z.number(),
  owner_id: z.number(),
});

export const generateInsightsTask = task({
  id: TASK_IDS.GENERATE_INSIGHTS,
  retry: { maxAttempts: 3 },

  run: async (payload: unknown) => {
    const data = GenerateInsightsPayloadSchema.parse(payload);

    logTaskStart(TASK_IDS.GENERATE_INSIGHTS, data);

    const result = await callDjangoApi(
      `/api/v1/internal/ai-analytics/insights/${data.survey_id}/`,
      "POST",
      {}
    );

    logTaskComplete(TASK_IDS.GENERATE_INSIGHTS, result);

    return result;
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.GENERATE_INSIGHTS, {
      payload,
      error: String(error),
    });
  },
});
