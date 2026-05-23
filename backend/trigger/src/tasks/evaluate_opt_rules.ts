import { task, AbortTaskRunError } from "@trigger.dev/sdk/v3";
import { TASK_IDS } from "../constants/index.js";
import { EvaluateOptRulesPayloadSchema } from "../schemas/optimization.schema.js";
import { callDjangoApi } from "../utils/trigger_client.js";
import {
  logTaskComplete,
  logTaskError,
  logTaskStart,
} from "../utils/logging_utils.js";
import { isRetryableError, NETWORK_RETRY_CONFIG } from "../utils/retry_utils.js";

/**
 * evaluate-opt-rules
 * ~~~~~~~~~~~~~~~~~~
 * Runs the full rule-based optimization engine for a campaign.
 * Evaluates all active OptimizationRules and orchestrates follow-up actions.
 * Delegates to Django's /api/v1/internal/optimization/evaluate-rules/
 */
export const evaluateOptRulesTask = task({
  id: TASK_IDS.EVALUATE_OPT_RULES,
  retry: NETWORK_RETRY_CONFIG,

  run: async (payload: unknown) => {
    const parsed = EvaluateOptRulesPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new AbortTaskRunError(
        `Invalid payload for evaluate-opt-rules: ${parsed.error.message}`
      );
    }

    logTaskStart(TASK_IDS.EVALUATE_OPT_RULES, parsed.data);

    try {
      const result = await callDjangoApi(
        "/api/v1/internal/optimization/evaluate-rules/",
        "POST",
        parsed.data
      );
      logTaskComplete(TASK_IDS.EVALUATE_OPT_RULES, result);
      return result;
    } catch (error) {
      if (!isRetryableError(error)) {
        logTaskError(TASK_IDS.EVALUATE_OPT_RULES, error);
        throw new AbortTaskRunError(
          `Permanent failure in evaluate-opt-rules: ${String(error)}`
        );
      }
      throw error;
    }
  },

  onFailure: async ({ payload, error }) => {
    logTaskError(TASK_IDS.EVALUATE_OPT_RULES, {
      payload,
      error: String(error),
    });
  },
});
