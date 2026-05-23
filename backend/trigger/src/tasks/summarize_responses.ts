import { task } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { TASK_IDS } from "../constants/index.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";

const SummarizePayloadSchema = z.object({
  survey_id: z.number(),
  owner_id: z.number(),
});

export const summarizeResponsesTask = task({
  id: TASK_IDS.SUMMARIZE_RESPONSES,
  retry: { maxAttempts: 3 },

  run: async (payload: unknown) => {
    const data = SummarizePayloadSchema.parse(payload);

    logTaskStart(TASK_IDS.SUMMARIZE_RESPONSES, data);

    const result = await callDjangoApi(
      `/api/v1/internal/ai-analytics/summarize/${data.survey_id}/`,
      "POST",
      {}
    );

    logTaskComplete(TASK_IDS.SUMMARIZE_RESPONSES, result);

    return result;
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.SUMMARIZE_RESPONSES, {
      payload,
      error: String(error),
    });
  },
});
