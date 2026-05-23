# apps.ai.services — public API
#
# Class-based API (Unit 31 — AI Infrastructure):
#   GeminiService, PromptBuilder, AIResponseParser, AIGateway, AIExecutionManager
#
# Backward-compatible function API (used by apps.ai_analytics):
#   call_gemini, is_gemini_configured
#   build_summarization_prompt, build_sentiment_prompt,
#   build_quality_scoring_prompt, build_question_insight_prompt
#   parse_json_response, safe_parse_json, extract_field

from .ai_logger import AILogger
from .ai_retry_handler import (
    with_ai_retry,
    is_retryable_error,
    AIRetryError,
    AIRateLimitError,
    AITimeoutError,
    AIAuthError,
)
from .gemini_service import (
    GeminiService,
    # backward-compat helpers
    call_gemini,
    is_gemini_configured,
)
from .prompt_builder import (
    PromptBuilder,
    # backward-compat helpers
    build_summarization_prompt,
    build_sentiment_prompt,
    build_quality_scoring_prompt,
    build_question_insight_prompt,
)
from .ai_response_parser import (
    AIResponseParser,
    AIParseError,
    # backward-compat helpers
    parse_json_response,
    safe_parse_json,
    extract_field,
)
from .ai_gateway import AIGateway
from .ai_execution_manager import AIExecutionManager

__all__ = [
    # Class-based API
    "AILogger",
    "with_ai_retry",
    "is_retryable_error",
    "AIRetryError",
    "AIRateLimitError",
    "AITimeoutError",
    "AIAuthError",
    "GeminiService",
    "PromptBuilder",
    "AIResponseParser",
    "AIParseError",
    "AIGateway",
    "AIExecutionManager",
    # Backward-compatible function API
    "call_gemini",
    "is_gemini_configured",
    "build_summarization_prompt",
    "build_sentiment_prompt",
    "build_quality_scoring_prompt",
    "build_question_insight_prompt",
    "parse_json_response",
    "safe_parse_json",
    "extract_field",
]
