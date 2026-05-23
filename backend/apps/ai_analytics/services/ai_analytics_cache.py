"""
Redis-backed caching layer for AI analytics outputs.

AI computations are expensive; this module provides helpers to
cache and retrieve AI-generated payloads, using the existing
analytics cache backend (Redis or LocMemCache fallback).
"""

from __future__ import annotations

import json
import logging
from typing import Any

from django.core.cache import cache, caches
from django.core.cache.backends.base import BaseCache

from apps.ai_analytics.constants import (
    AI_ANALYTICS_CACHE_TTL,
    AI_SUMMARY_CACHE_TTL,
    AI_SENTIMENT_CACHE_TTL,
    AI_QUALITY_CACHE_TTL,
    AI_QUESTION_CACHE_TTL,
)

logger = logging.getLogger(__name__)

_CACHE_NS = "ai_analytics"


def _get_cache() -> BaseCache:
    try:
        return caches["analytics"]
    except Exception:
        return cache


def _make_key(*parts: str | int) -> str:
    return f"{_CACHE_NS}:" + ":".join(str(p) for p in parts)


def _get(key: str) -> Any | None:
    try:
        raw = _get_cache().get(key)
        if raw is None:
            return None
        return json.loads(raw) if isinstance(raw, (str, bytes)) else raw
    except Exception as exc:
        logger.warning("AI analytics cache GET failed for key=%r: %s", key, exc)
        return None


def _set(key: str, payload: Any, ttl: int = AI_ANALYTICS_CACHE_TTL) -> None:
    try:
        _get_cache().set(key, payload, timeout=ttl)
    except Exception as exc:
        logger.warning("AI analytics cache SET failed for key=%r: %s", key, exc)


def _delete(key: str) -> None:
    try:
        _get_cache().delete(key)
    except Exception as exc:
        logger.warning("AI analytics cache DELETE failed for key=%r: %s", key, exc)


# ── Summary cache ──────────────────────────────────────────────────────────────

def get_summary_cache(survey_id: int) -> Any | None:
    return _get(_make_key("summary", survey_id))


def set_summary_cache(survey_id: int, payload: Any) -> None:
    _set(_make_key("summary", survey_id), payload, ttl=AI_SUMMARY_CACHE_TTL)


def invalidate_summary_cache(survey_id: int) -> None:
    _delete(_make_key("summary", survey_id))


# ── Sentiment cache ────────────────────────────────────────────────────────────

def get_sentiment_cache(survey_id: int) -> Any | None:
    return _get(_make_key("sentiment", survey_id))


def set_sentiment_cache(survey_id: int, payload: Any) -> None:
    _set(_make_key("sentiment", survey_id), payload, ttl=AI_SENTIMENT_CACHE_TTL)


def invalidate_sentiment_cache(survey_id: int) -> None:
    _delete(_make_key("sentiment", survey_id))


# ── Quality cache ──────────────────────────────────────────────────────────────

def get_quality_cache(survey_id: int) -> Any | None:
    return _get(_make_key("quality", survey_id))


def set_quality_cache(survey_id: int, payload: Any) -> None:
    _set(_make_key("quality", survey_id), payload, ttl=AI_QUALITY_CACHE_TTL)


def invalidate_quality_cache(survey_id: int) -> None:
    _delete(_make_key("quality", survey_id))


# ── Question insights cache ────────────────────────────────────────────────────

def get_question_insights_cache(survey_id: int) -> Any | None:
    return _get(_make_key("questions", survey_id))


def set_question_insights_cache(survey_id: int, payload: Any) -> None:
    _set(_make_key("questions", survey_id), payload, ttl=AI_QUESTION_CACHE_TTL)


def invalidate_question_insights_cache(survey_id: int) -> None:
    _delete(_make_key("questions", survey_id))


# ── Full survey AI cache invalidation ─────────────────────────────────────────

def invalidate_all_ai_cache(survey_id: int) -> None:
    """Invalidate all AI analytics cache entries for a survey."""
    invalidate_summary_cache(survey_id)
    invalidate_sentiment_cache(survey_id)
    invalidate_quality_cache(survey_id)
    invalidate_question_insights_cache(survey_id)
