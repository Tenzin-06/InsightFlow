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
"""

import time
import logging
from typing import Any, Optional

logger = logging.getLogger("apps.ai")


class GeminiService:
    """
    Thin wrapper around the google-generativeai SDK.

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
        """Return the cached Gemini GenerativeModel, initialising it lazily."""
        if self._client is None:
            try:
                import google.generativeai as genai  # type: ignore[import]
            except ImportError as exc:
                raise RuntimeError(
                    "google-generativeai is not installed. "
                    "Run: pip install google-generativeai"
                ) from exc

            from django.conf import settings

            api_key: str = getattr(settings, "GEMINI_API_KEY", "")
            if not api_key:
                raise RuntimeError(
                    "GEMINI_API_KEY is not configured. "
                    "Add it to your .env file and Django settings."
                )

            model_name: str = getattr(
                settings, "GEMINI_MODEL", "gemini-1.5-flash"
            )
            genai.configure(api_key=api_key)
            self._client = genai.GenerativeModel(model_name)
            logger.debug("GeminiService: client initialised with model=%s", model_name)

        return self._client

    @property
    def model_name(self) -> str:
        from django.conf import settings
        return getattr(settings, "GEMINI_MODEL", "gemini-1.5-flash")

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
        client = self._get_client()
        from django.conf import settings

        timeout: int = getattr(settings, "AI_TIMEOUT_SECONDS", 30)
        start = time.time()

        response = client.generate_content(
            prompt,
            generation_config={
                "temperature": 0.7,
                "max_output_tokens": 2048,
            },
            request_options={"timeout": timeout},
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
                return int(response.usage_metadata.total_token_count or 0)
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
