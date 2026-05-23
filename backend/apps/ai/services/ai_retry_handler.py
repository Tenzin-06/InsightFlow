"""
AIRetryHandler — resilient retry logic for AI provider calls.

Classifies errors as retryable or permanent, then executes the provided
callable with exponential backoff up to the configured retry limit.

Retry rules (from spec):
    Rate limits     → always retry
    Timeouts        → always retry
    Invalid response → limited retries
    Auth failure    → never retry
"""

import time
import logging
from typing import Callable, Any, Optional, TypeVar

logger = logging.getLogger("apps.ai")

T = TypeVar("T")


# ---------------------------------------------------------------------------
# Error types
# ---------------------------------------------------------------------------

class AIRetryError(Exception):
    """Explicitly marks an error as non-retryable."""


class AIRateLimitError(Exception):
    """Provider rate limit hit — always retry with backoff."""


class AITimeoutError(Exception):
    """Provider call timed out — retry."""


class AIAuthError(Exception):
    """Authentication failure — never retry."""


# ---------------------------------------------------------------------------
# Error classification
# ---------------------------------------------------------------------------

_RETRYABLE_TYPES = (AIRateLimitError, AITimeoutError, ConnectionError, TimeoutError)
_PERMANENT_TYPES = (AIRetryError, AIAuthError)

_RETRYABLE_KEYWORDS = frozenset([
    "rate limit", "quota", "too many requests", "429",
    "timeout", "connection", "network", "service unavailable", "503", "504",
])

_PERMANENT_KEYWORDS = frozenset([
    "auth", "api key", "unauthorized", "forbidden",
    "invalid api key", "401", "403",
])


def is_retryable_error(error: Exception) -> bool:
    """
    Return True if *error* represents a transient failure worth retrying.

    Decision order:
        1. If the error is explicitly typed as permanent → False.
        2. If the error is explicitly typed as retryable → True.
        3. Fall back to keyword matching on the stringified error.
    """
    if isinstance(error, _PERMANENT_TYPES):
        return False
    if isinstance(error, _RETRYABLE_TYPES):
        return True

    error_str = str(error).lower()
    if any(kw in error_str for kw in _PERMANENT_KEYWORDS):
        return False
    if any(kw in error_str for kw in _RETRYABLE_KEYWORDS):
        return True

    # Unknown error — retry conservatively
    return True


# ---------------------------------------------------------------------------
# Retry executor
# ---------------------------------------------------------------------------

def with_ai_retry(
    func: Callable[[], T],
    max_attempts: Optional[int] = None,
    job_type: str = "unknown",
) -> T:
    """
    Execute *func* with exponential backoff retry logic.

    Parameters
    ----------
    func         : Zero-argument callable that performs the AI operation.
    max_attempts : Override the default AI_MAX_RETRIES Django setting.
    job_type     : Label used in log messages.

    Returns
    -------
    The return value of *func* on success.

    Raises
    ------
    The last exception raised by *func* if all attempts are exhausted,
    or the first permanent error encountered.
    """
    from django.conf import settings
    from .ai_logger import AILogger

    limit = max_attempts or getattr(settings, "AI_MAX_RETRIES", 3)
    last_error: Optional[Exception] = None

    for attempt in range(1, limit + 1):
        try:
            return func()
        except Exception as exc:
            last_error = exc

            if not is_retryable_error(exc):
                AILogger.log_failure(job_type, exc, attempt)
                raise

            if attempt >= limit:
                AILogger.log_failure(job_type, exc, attempt)
                break

            delay = float(2 ** attempt)  # 2s, 4s, 8s …
            AILogger.log_retry(job_type, attempt, delay)
            time.sleep(delay)

    # All attempts exhausted — re-raise last transient error
    raise last_error  # type: ignore[misc]
