"""
GeminiService — direct integration with the Google Gemini AI API.

Responsibilities:
    - Authenticate with the Gemini API using GEMINI_API_KEY.
    - Submit prompts and receive provider responses.
    - Normalise raw provider output into a consistent dict shape.
    - Expose operations: text generation, summarisation, classification,
      and structured JSON output.

Application code must NOT call this service directly.
Use AIGateway instead so provider logic stays isolated.

Backward-compatible helpers (call_gemini, is_gemini_configured) are
provided at module level for existing callers in apps.ai_analytics.

SDK: google-genai (google.genai) — the new official SDK.
     Install: pip install google-genai
     The deprecated google-generativeai package is no longer used.
"""

import time
import logging
from typing import Any, Optional

logger = logging.getLogger("apps.ai")

# Default model to use when GEMINI_MODEL is not configured
_DEFAULT_MODEL = "gemini-2.0-flash"


class GeminiService:
    """
    Thin wrapper around the google.genai SDK.

    The client is initialised lazily on the first request so that missing
    GEMINI_API_KEY does not break the application at startup — only at the
    point where an AI operation is actually attempted.
    """

    def __init__(self) -> None:
        self._client: Any = None

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _get_client(self) -> Any:
        """Return the cached google.genai Client, initialising it lazily."""
        if self._client is None:
            try:
                from google import genai  # type: ignore[import]
            except ImportError as exc:
                raise RuntimeError(
                    "google-genai is not installed. "
                    "Run: pip install google-genai"
                ) from exc

            from django.conf import settings

            api_key: str = getattr(settings, "GEMINI_API_KEY", "")
            if not api_key:
                raise RuntimeError(
                    "GEMINI_API_KEY is not configured. "
                    "Add it to your .env file and Django settings."
                )

            self._client = genai.Client(api_key=api_key)
            logger.debug(
                "GeminiService: client initialised with model=%s", self.model_name
            )

        return self._client

    @property
    def model_name(self) -> str:
        from django.conf import settings
        return getattr(settings, "GEMINI_MODEL", _DEFAULT_MODEL)

    def _call(self, prompt: str) -> dict:
        """
        Send *prompt* to Gemini and return a normalised response dict.

        Returned shape
        --------------
        {
            "text":        str,   # raw provider text
            "model":       str,   # model name used
            "latency_ms":  float, # end-to-end call duration
            "tokens_used": int,   # total token count (0 if unavailable)
        }
        """
        from google import genai  # type: ignore[import]
        from google.genai import types  # type: ignore[import]

        client = self._get_client()
        from django.conf import settings

        timeout: int = getattr(settings, "AI_TIMEOUT_SECONDS", 30)
        start = time.time()

        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=2048,
            ),
        )

        latency_ms = (time.time() - start) * 1000
        text: str = response.text if hasattr(response, "text") and response.text else ""

        return {
            "text": text,
            "model": self.model_name,
            "latency_ms": latency_ms,
            "tokens_used": self._extract_token_count(response),
        }

    @staticmethod
    def _extract_token_count(response: Any) -> int:
        """Safely pull total_token_count from provider metadata."""
        try:
            if hasattr(response, "usage_metadata"):
                meta = response.usage_metadata
                return int(
                    getattr(meta, "total_token_count", None)
                    or getattr(meta, "candidates_token_count", 0)
                    or 0
                )
        except Exception:
            pass
        return 0

    # ------------------------------------------------------------------
    # Public operations
    # ------------------------------------------------------------------

    def generate_text(self, prompt: str) -> dict:
        """
        Generate free-form text from a prompt.

        Returns the standard normalised response dict.
        """
        result = self._call(prompt)
        result["output_type"] = "text"
        return result

    def summarize(self, text: str, context: Optional[str] = None) -> dict:
        """
        Summarise *text*.

        An optional *context* string is prepended to guide the model.
        """
        parts = []
        if context:
            parts.append(f"Context: {context}")
        parts.append(
            f"Summarise the following text concisely and clearly:\n\n{text}"
        )
        result = self._call("\n\n".join(parts))
        result["output_type"] = "summary"
        return result

    def classify(self, text: str, categories: list[str]) -> dict:
        """
        Classify *text* into exactly one of *categories*.

        The provider is instructed to respond with only the category name.
        """
        categories_str = ", ".join(categories)
        prompt = (
            f"Classify the following text into exactly one of these categories: "
            f"{categories_str}\n\n"
            f"Text: {text}\n\n"
            "Respond with ONLY the category name — no explanation, no punctuation."
        )
        result = self._call(prompt)
        result["output_type"] = "classification"
        result["categories"] = categories
        return result

    def generate_structured_output(self, prompt: str) -> dict:
        """
        Generate a structured JSON response from *prompt*.

        Appends an explicit JSON-only instruction to minimise markdown wrapping.
        """
        json_prompt = (
            f"{prompt}\n\n"
            "IMPORTANT: Respond ONLY with valid JSON. "
            "No markdown, no code fences, no explanation — raw JSON only."
        )
        result = self._call(json_prompt)
        result["output_type"] = "structured_json"
        return result


# ---------------------------------------------------------------------------
# Backward-compatible module-level helpers
# Used by apps.ai_analytics services that were built against the original
# function-based API. New code should use GeminiService or AIGateway.
# ---------------------------------------------------------------------------

def call_gemini(
    prompt: str,
    *,
    model: str | None = None,
    timeout: int | None = None,
    temperature: float = 0.2,
) -> str | None:
    """
    Submit a prompt to the Gemini API and return the response text.

    Backward-compatible wrapper — new code should use GeminiService.

    Returns the raw text response, or None on any error / missing key.
    Errors are logged but never raised — callers must handle a None result.
    """
    from django.conf import settings

    api_key: str = getattr(settings, "GEMINI_API_KEY", "") or ""
    if not api_key:
        logger.warning(
            "GEMINI_API_KEY is not configured — AI call skipped. "
            "Set GEMINI_API_KEY in your .env to enable AI features."
        )
        return None

    model_name = model or getattr(settings, "GEMINI_MODEL", _DEFAULT_MODEL)
    _request_timeout = timeout or getattr(settings, "AI_TIMEOUT_SECONDS", 30)

    try:
        from google import genai  # lazy import — optional dependency
        from google.genai import types  # type: ignore[import]

        client = genai.Client(api_key=api_key)

        logger.debug(
            "Gemini request — model=%s prompt_length=%d", model_name, len(prompt)
        )
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=temperature,
                max_output_tokens=2048,
            ),
        )
        text = response.text
        logger.debug(
            "Gemini response received — length=%d", len(text) if text else 0
        )
        return text

    except ImportError:
        logger.error(
            "google-genai is not installed. "
            "Run: pip install google-genai"
        )
        return None
    except Exception as exc:
        logger.error("Gemini API call failed: %s", exc)
        return None


def is_gemini_configured() -> bool:
    """Return True if the Gemini API key is set and the SDK is importable."""
    from django.conf import settings
    if not getattr(settings, "GEMINI_API_KEY", ""):
        return False
    try:
        from google import genai  # noqa: F401
        return True
    except ImportError:
        return False
