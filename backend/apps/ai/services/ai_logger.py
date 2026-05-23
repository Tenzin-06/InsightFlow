"""
AILogger — structured logging for all AI operations.

Provides a single, consistent logging interface so that request/response
cycles, failures, retries, and malformed outputs are always logged in the
same format and can be filtered easily in log aggregators.
"""

import logging

logger = logging.getLogger("apps.ai")


class AILogger:
    """
    Centralised AI observability logger.

    All methods are static — callers do not need to instantiate this class.
    Logging is only emitted when the AI_ENABLE_LOGGING Django setting is True
    (default: True).
    """

    @staticmethod
    def _is_enabled() -> bool:
        from django.conf import settings
        return getattr(settings, "AI_ENABLE_LOGGING", True)

    @staticmethod
    def log_request(job_type: str, model_name: str, prompt_length: int) -> None:
        """Log an outbound AI request before it is sent to the provider."""
        if AILogger._is_enabled():
            logger.info(
                "AI Request | job_type=%s model=%s prompt_chars=%d",
                job_type,
                model_name,
                prompt_length,
            )

    @staticmethod
    def log_response(
        job_type: str,
        model_name: str,
        tokens_used: int,
        latency_ms: float,
    ) -> None:
        """Log a successful AI response after it has been normalised."""
        if AILogger._is_enabled():
            logger.info(
                "AI Response | job_type=%s model=%s tokens=%d latency_ms=%.1f",
                job_type,
                model_name,
                tokens_used,
                latency_ms,
            )

    @staticmethod
    def log_failure(job_type: str, error: Exception, attempt: int) -> None:
        """Log a non-recoverable AI failure."""
        logger.error(
            "AI Failure | job_type=%s attempt=%d error=%s: %s",
            job_type,
            attempt,
            type(error).__name__,
            str(error),
        )

    @staticmethod
    def log_retry(job_type: str, attempt: int, delay: float) -> None:
        """Log a transient failure that will be retried after a delay."""
        logger.warning(
            "AI Retry | job_type=%s attempt=%d retry_in=%.1fs",
            job_type,
            attempt,
            delay,
        )

    @staticmethod
    def log_malformed_output(job_type: str, raw_response: str) -> None:
        """Log a provider response that could not be parsed."""
        logger.warning(
            "AI Malformed Output | job_type=%s response_preview=%s",
            job_type,
            raw_response[:300],
        )

    @staticmethod
    def log_provider_down(provider: str, error: Exception) -> None:
        """Log a provider connectivity failure."""
        logger.error(
            "AI Provider Down | provider=%s error=%s: %s",
            provider,
            type(error).__name__,
            str(error),
        )
