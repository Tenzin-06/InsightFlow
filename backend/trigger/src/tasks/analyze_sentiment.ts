import { task } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { TASK_IDS } from "../constants/index.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";

const AnalyzeSentimentPayloadSchema = z.object({
  survey_id: z.number(),
  owner_id: z.number(),
});

export const analyzeSentimentTask = task({
  id: TASK_IDS.ANALYZE_SENTIMENT,
  retry: { maxAttempts: 3 },

  run: async (payload: unknown) => {
    const data = AnalyzeSentimentPayloadSchema.parse(payload);

    logTaskStart(TASK_IDS.ANALYZE_SENTIMENT, data);

    const result = await callDjangoApi(
      `/api/v1/internal/ai-analytics/sentiment/${data.survey_id}/`,
      "POST",
      {}
    );

    logTaskComplete(TASK_IDS.ANALYZE_SENTIMENT, result);

    return result;
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.ANALYZE_SENTIMENT, {
      payload,
      error: String(error),
    });
  },
});
