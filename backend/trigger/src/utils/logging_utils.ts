import pino from "pino";

/**
 * Structured logger for Trigger.dev workers.
 *
 * - Development: pretty-printed output via pino-pretty
 * - Production: JSON output for centralized log ingestion (e.g. Sentry, Datadog)
 */
export const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
  },
  process.env.NODE_ENV !== "production"
    ? pino.transport({
        target: "pino-pretty",
        options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" },
      })
    : undefined
);

/**
 * Log the start of a task run.
 */
export function logTaskStart(taskId: string, payload: unknown): void {
  logger.info({ taskId, payload }, `[${taskId}] task started`);
}

/**
 * Log the successful completion of a task run.
 */
export function logTaskComplete(taskId: string, result: unknown): void {
  logger.info({ taskId, result }, `[${taskId}] task completed`);
}

/**
 * Log a retry event (transient failure, will be retried).
 */
export function logTaskRetry(taskId: string, attempt: number, error: unknown): void {
  logger.warn({ taskId, attempt, error }, `[${taskId}] task retrying (attempt ${attempt})`);
}

/**
 * Log a permanent task failure (all retries exhausted).
 */
export function logTaskError(taskId: string, error: unknown): void {
  logger.error({ taskId, error }, `[${taskId}] task permanently failed`);
}

/**
 * Log a provider response (e.g. Resend, external API).
 */
export function logProviderResponse(taskId: string, provider: string, response: unknown): void {
  logger.debug({ taskId, provider, response }, `[${taskId}] provider response from ${provider}`);
}
