"""
AIGateway — provider-independent AI execution layer.

This is the single entry point that all application features must use
when requesting AI operations. It:
    - abstracts the underlying provider (Gemini today, others in future)
    - routes requests through the retry handler
    - logs every request / response cycle via AILogger
    - post-processes structured outputs through AIResponseParser

Architectural rule (from spec):
    Application code → AIGateway → GeminiService
    NEVER: application code → GeminiService directly
"""

import logging
from typing import Optional

from .gemini_service import GeminiService
from .ai_logger import AILogger
from .ai_retry_handler import with_ai_retry
from .ai_response_parser import AIResponseParser

logger = logging.getLogger("apps.ai")


class AIGateway:
    """
    Provider-independent gateway for all AI operations.

    Supported operations
    --------------------
    run_text_generation    : Free-form text generation.
    run_summarization      : Text summarisation with optional context.
    run_classification     : Single-label text classification.
    run_structured_output  : JSON-producing prompt with automatic parsing.

    Future providers (OpenAI, Anthropic, local models) are added by
    replacing or supplementing self._provider without touching callers.
    """

    def __init__(self) -> None:
        self._provider = GeminiService()

    # ------------------------------------------------------------------
    # Public operations
    # ------------------------------------------------------------------

    def run_text_generation(
        self,
        prompt: str,
        job_type: str = "text_generation",
        max_retries: Optional[int] = None,
    ) -> dict:
        """
        Generate free-form text from *prompt*.

        Returns the normalised provider response dict.
        """
        AILogger.log_request(job_type, self._provider.model_name, len(prompt))

        result = with_ai_retry(
            lambda: self._provider.generate_text(prompt),
            max_attempts=max_retries,
            job_type=job_type,
        )

        AILogger.log_response(
            job_type,
            result.get("model", ""),
            result.get("tokens_used", 0),
            result.get("latency_ms", 0.0),
        )
        return result

    def run_summarization(
        self,
        text: str,
        context: Optional[str] = None,
        job_type: str = "summarization",
        max_retries: Optional[int] = None,
    ) -> dict:
        """
        Summarise *text* with an optional *context* hint.
        """
        AILogger.log_request(job_type, self._provider.model_name, len(text))

        result = with_ai_retry(
            lambda: self._provider.summarize(text, context=context),
            max_attempts=max_retries,
            job_type=job_type,
        )

        AILogger.log_response(
            job_type,
            result.get("model", ""),
            result.get("tokens_used", 0),
            result.get("latency_ms", 0.0),
        )
        return result

    def run_classification(
        self,
        text: str,
        categories: list[str],
        job_type: str = "classification",
        max_retries: Optional[int] = None,
    ) -> dict:
        """
        Classify *text* into one of *categories*.
        """
        AILogger.log_request(job_type, self._provider.model_name, len(text))

        result = with_ai_retry(
            lambda: self._provider.classify(text, categories),
            max_attempts=max_retries,
            job_type=job_type,
        )

        AILogger.log_response(
            job_type,
            result.get("model", ""),
            result.get("tokens_used", 0),
            result.get("latency_ms", 0.0),
        )
        return result

    def run_structured_output(
        self,
        prompt: str,
        job_type: str = "structured_output",
        max_retries: Optional[int] = None,
    ) -> dict:
        """
        Generate structured JSON output from *prompt*.

        The raw provider text is automatically parsed into a ``parsed``
        key inside the returned dict.
        """
        AILogger.log_request(job_type, self._provider.model_name, len(prompt))

        result = with_ai_retry(
            lambda: self._provider.generate_structured_output(prompt),
            max_attempts=max_retries,
            job_type=job_type,
        )

        AILogger.log_response(
            job_type,
            result.get("model", ""),
            result.get("tokens_used", 0),
            result.get("latency_ms", 0.0),
        )

        # Best-effort JSON parsing — callers receive both raw text and parsed dict
        raw_text: str = result.get("text", "")
        result["parsed"] = AIResponseParser.safe_parse_json(raw_text)

        if not result["parsed"]:
            AILogger.log_malformed_output(job_type, raw_text)

        return result

    # ------------------------------------------------------------------
    # Provider metadata
    # ------------------------------------------------------------------

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def model_name(self) -> str:
        return self._provider.model_name
