"""
AI response parsing and sanitisation utilities.

Handles JSON extraction from Gemini responses, which may include
markdown code fences or extra whitespace.

Usage:
    from apps.ai.services import parse_json_response
    data = parse_json_response(gemini_text)
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

logger = logging.getLogger(__name__)


def _strip_code_fences(text: str) -> str:
    """Remove ```json ... ``` or ``` ... ``` wrappers if present."""
    text = text.strip()
    # Remove leading ```json or ``` markers
    text = re.sub(r"^```(?:json)?\s*", "", text)
    # Remove trailing ``` marker
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def parse_json_response(text: str | None) -> dict | list | None:
    """
    Parse a JSON payload from a raw Gemini response string.

    Handles:
    - None / empty input → returns None
    - Markdown code fences (```json ... ```)
    - Trailing commas (limited cleanup)
    - Unexpected whitespace

    Returns the parsed Python object (dict or list), or None on failure.
    """
    if not text:
        return None

    cleaned = _strip_code_fences(text)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as exc:
        logger.warning("JSON parse failed on first attempt (%s) — trying cleanup", exc)

    # Attempt light cleanup: remove trailing commas before } or ]
    cleaned_retry = re.sub(r",\s*([}\]])", r"\1", cleaned)
    try:
        return json.loads(cleaned_retry)
    except json.JSONDecodeError as exc:
        logger.error(
            "AI response JSON parse failed after cleanup: %s | raw=%r",
            exc,
            text[:200],
        )
        return None


def safe_parse_json(text: str | None, fallback: Any = None) -> Any:
    """
    Like parse_json_response but returns `fallback` instead of None on failure.

    Useful when a default empty structure is preferable to None.
    """
    result = parse_json_response(text)
    return result if result is not None else fallback


def extract_field(data: dict | None, field: str, fallback: Any = None) -> Any:
    """
    Safely extract a field from a parsed AI response dict.
    Returns `fallback` when data is None or the field is missing.
    """
    if not isinstance(data, dict):
        return fallback
    return data.get(field, fallback)
