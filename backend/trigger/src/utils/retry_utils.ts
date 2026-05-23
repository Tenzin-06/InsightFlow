/**
 * Retry configuration types and helpers.
 *
 * Trigger.dev handles the actual retry scheduling; these utilities
 * define retry strategies and classify errors for the workers.
 */

export type RetryConfig = {
  maxAttempts: number;
  factor: number;
  minTimeoutInMs: number;
  maxTimeoutInMs: number;
};

/**
 * Default retry strategy — 3 attempts with exponential backoff.
 * Suitable for most background tasks.
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  factor: 2,
  minTimeoutInMs: 1000,
  maxTimeoutInMs: 30000,
};

/**
 * Network retry strategy — 5 attempts for transient network failures.
 * Used for tasks that communicate with external providers (Resend, etc.).
 */
export const NETWORK_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 5,
  factor: 2,
  minTimeoutInMs: 500,
  maxTimeoutInMs: 60000,
};

/**
 * Upload retry strategy — generous retries for long-running upload processing.
 */
export const UPLOAD_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 4,
  factor: 2,
  minTimeoutInMs: 2000,
  maxTimeoutInMs: 120000,
};

/**
 * Classify whether an error is retryable.
 *
 * Retry strategy:
 * - Network errors           → retry (transient)
 * - Provider timeouts        → retry (transient)
 * - Validation failures      → do NOT retry (permanent)
 * - Missing resource (404)   → do NOT retry (permanent)
 * - Unknown errors           → retry (default safe)
 */
export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return true;

  const msg = error.message.toLowerCase();

  // Permanent failures — do not retry
  const permanentPatterns = [
    "validation",
    "invalid",
    "not found",
    "404",
    "400",
    "unauthorized",
    "forbidden",
    "403",
    "401",
  ];
  if (permanentPatterns.some((p) => msg.includes(p))) {
    return false;
  }

  // Transient failures — retry
  const transientPatterns = [
    "econnrefused",
    "etimedout",
    "enotfound",
    "network",
    "timeout",
    "rate limit",
    "429",
    "503",
    "502",
    "500",
  ];
  if (transientPatterns.some((p) => msg.includes(p))) {
    return true;
  }

  // Default: retry unknown errors
  return true;
}

/**
 * Wrap a function call with a permanent-failure guard.
 * If the error is not retryable, wrap it in an AbortTaskRunError
 * so Trigger.dev does not schedule further retries.
 */
export async function withRetryGuard<T>(
  fn: () => Promise<T>,
  taskId: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (!isRetryableError(error)) {
      // Re-throw with a marker that tells Trigger.dev to abort (no more retries)
      const permanent = new Error(
        `[${taskId}] permanent failure — skipping retries: ${String(error)}`
      );
      (permanent as Error & { skipRetrying?: boolean }).skipRetrying = true;
      throw permanent;
    }
    throw error;
  }
}
