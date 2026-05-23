"""
Gemini AI service — central gateway for all Gemini API calls.

All Gemini API communication must go through this module.
Do NOT invoke the Gemini SDK directly from views, models, or feature apps.

Usage:
    from apps.ai.services import call_gemini
    response_text = call_gemini(prompt)
"""

from __future__ import annotations

import logging
from typing import Any

from django.conf import settings

logger = logging.getLogger(__name__)

# Default model to use when GEMINI_MODEL is not configured
_DEFAULT_MODEL = "gemini-1.5-flash"


def call_gemini(
    prompt: str,
    *,
    model: str | None = None,
    timeout: int | None = None,
    temperature: float = 0.2,
) -> str | None:
    """
    Submit a prompt to the Gemini API and return the response text.

    Args:
        prompt:      The full prompt string to submit.
        model:       Override the default model (falls back to settings.GEMINI_MODEL).
        timeout:     Request timeout in seconds (falls back to settings.AI_TIMEOUT_SECONDS).
        temperature: Sampling temperature; lower = more deterministic.

    Returns:
        The raw text response from Gemini, or None on any error / missing key.

    Errors are logged but never raised — callers must handle a None result gracefully.
    """
    api_key: str = getattr(settings, "GEMINI_API_KEY", "") or ""
    if not api_key:
        logger.warning(
            "GEMINI_API_KEY is not configured — AI call skipped. "
            "Set GEMINI_API_KEY in your .env to enable AI features."
        )
        return None

    model_name = model or getattr(settings, "GEMINI_MODEL", _DEFAULT_MODEL)
    request_timeout = timeout or getattr(settings, "AI_TIMEOUT_SECONDS", 30)

    try:
        import google.generativeai as genai  # lazy import — optional dependency

        genai.configure(api_key=api_key)
        generation_config = genai.GenerationConfig(temperature=temperature)
        ai_model = genai.GenerativeModel(model_name, generation_config=generation_config)

        logger.debug("Gemini request — model=%s prompt_length=%d", model_name, len(prompt))
        response = ai_model.generate_content(prompt, request_options={"timeout": request_timeout})
        text = response.text
        logger.debug("Gemini response received — length=%d", len(text) if text else 0)
        return text

    except ImportError:
        logger.error(
            "google-generativeai is not installed. "
            "Run: pip install google-generativeai"
        )
        return None
    except Exception as exc:
        logger.error("Gemini API call failed: %s", exc)
        return None


def is_gemini_configured() -> bool:
    """Return True if the Gemini API key is set and the SDK is importable."""
    if not getattr(settings, "GEMINI_API_KEY", ""):
        return False
    try:
        import google.generativeai  # noqa: F401
        return True
    except ImportError:
        return False
