"""
AIResponseParser — normalise and validate raw AI provider outputs.

Responsibilities:
    - validate that a response is non-empty
    - strip markdown fences from JSON responses
    - parse JSON safely with clear failure messages
    - parse list outputs (JSON array or newline-separated)
    - validate structured outputs against Pydantic schemas
    - provide safe fallback variants for non-critical pipelines

All parsing errors raise AIParseError so callers can handle them uniformly.

Backward-compatible module-level helpers (parse_json_response, safe_parse_json,
extract_field) are provided for existing callers in apps.ai_analytics.
"""

import json
import logging
import re
from typing import Any, Optional, Type, TypeVar

from pydantic import BaseModel, ValidationError

logger = logging.getLogger("apps.ai")

M = TypeVar("M", bound=BaseModel)


class AIParseError(Exception):
    """Raised when an AI response cannot be parsed into the expected format."""


class AIResponseParser:
    """
    Stateless parser — all methods are static.

    Supports:
        plain text   → parse_text()
        JSON object  → parse_json()
        JSON / line array → parse_list()
        Pydantic schemas  → validate_with_schema()
    """

    # ------------------------------------------------------------------
    # Plain text
    # ------------------------------------------------------------------

    @staticmethod
    def parse_text(raw: str) -> str:
        """Strip and return a text response. Raises AIParseError if empty."""
        if not raw or not raw.strip():
            raise AIParseError("AI returned an empty text response")
        return raw.strip()

    # ------------------------------------------------------------------
    # JSON object
    # ------------------------------------------------------------------

    @staticmethod
    def parse_json(raw: str) -> dict:
        """
        Parse a JSON object from the provider response.

        Handles:
            - leading/trailing whitespace
            - markdown code fences  (```json … ``` or ``` … ```)
        """
        if not raw:
            raise AIParseError("AI returned an empty response")

        cleaned = raw.strip()

        # Strip markdown fences when present
        if cleaned.startswith("```"):
            lines = cleaned.splitlines()
            inner: list[str] = []
            recording = False
            for line in lines:
                if line.startswith("```") and not recording:
                    recording = True
                    continue
                if line.startswith("```") and recording:
                    break
                if recording:
                    inner.append(line)
            cleaned = "\n".join(inner)

        try:
            result = json.loads(cleaned)
        except json.JSONDecodeError as exc:
            logger.warning(
                "AIResponseParser: JSON parse failed — %s | preview=%s",
                exc,
                raw[:300],
            )
            raise AIParseError(f"AI response is not valid JSON: {exc}") from exc

        if not isinstance(result, dict):
            raise AIParseError(
                f"Expected a JSON object but got {type(result).__name__}"
            )

        return result

    # ------------------------------------------------------------------
    # List
    # ------------------------------------------------------------------

    @staticmethod
    def parse_list(raw: str) -> list:
        """
        Parse an array from the provider response.

        Tries JSON array first; falls back to newline-separated text.
        """
        if not raw:
            raise AIParseError("AI returned an empty response")

        # Attempt JSON array
        try:
            parsed = json.loads(raw.strip())
            if isinstance(parsed, list):
                return parsed
        except (json.JSONDecodeError, ValueError):
            pass

        # Fall back: split on newlines, strip bullet markers
        items = [
            line.strip().lstrip("-•*0123456789.)").strip()
            for line in raw.strip().splitlines()
        ]
        return [item for item in items if item]

    # ------------------------------------------------------------------
    # Pydantic schema validation
    # ------------------------------------------------------------------

    @staticmethod
    def validate_with_schema(data: Any, schema: Type[M]) -> M:
        """
        Validate *data* against a Pydantic *schema*.

        Raises AIParseError on validation failure.
        """
        try:
            return schema.model_validate(data)
        except ValidationError as exc:
            raise AIParseError(
                f"AI response failed schema validation: {exc}"
            ) from exc

    # ------------------------------------------------------------------
    # Safe / fallback variants
    # ------------------------------------------------------------------

    @staticmethod
    def safe_parse_json(raw: str, fallback: Optional[dict] = None) -> dict:
        """Parse JSON with a default fallback on failure — never raises."""
        try:
            return AIResponseParser.parse_json(raw)
        except AIParseError:
            logger.warning("AIResponseParser: safe_parse_json using fallback")
            return fallback if fallback is not None else {}

    @staticmethod
    def safe_parse_list(raw: str) -> list:
        """Parse a list with an empty-list fallback on failure — never raises."""
        try:
            return AIResponseParser.parse_list(raw)
        except AIParseError:
            return []


# ---------------------------------------------------------------------------
# Backward-compatible module-level helpers
# Used by apps.ai_analytics services that were built against the original
# function-based API. New code should use AIResponseParser directly.
# ---------------------------------------------------------------------------

def _strip_code_fences(text: str) -> str:
    """Remove ```json ... ``` or ``` ... ``` wrappers if present."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def parse_json_response(text: str | None) -> dict | list | None:
    """
    Parse a JSON payload from a raw Gemini response string.

    Backward-compatible wrapper — new code should use AIResponseParser.

    Handles markdown code fences, trailing commas, and extra whitespace.
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

    Backward-compatible wrapper — new code should use AIResponseParser.
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
