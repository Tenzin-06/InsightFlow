"""
Redis-backed analytics caching layer.

Falls back to Django's local-memory cache when Redis is unavailable,
so development environments without a Redis server work out of the box.
"""

from __future__ import annotations

import json
import logging
from typing import Any

from django.core.cache import cache, caches
from django.core.cache.backends.base import BaseCache

from apps.analytics.constants import ANALYTICS_CACHE_TTL

logger = logging.getLogger(__name__)

# Namespace prefix for all analytics cache keys
CACHE_NS = "analytics"


def _get_cache() -> BaseCache:
    """
    Return the analytics cache backend.
    Uses the 'analytics' alias if configured, otherwise falls back to default.
    """
    try:
        return caches["analytics"]
    except Exception:
        return cache  # default cache (locmem in development)


def make_cache_key(*parts: str | int) -> str:
    """
    Build a namespaced, colon-separated cache key.

    Example:
        make_cache_key("dashboard", 7) → "analytics:dashboard:7"
    """
    return f"{CACHE_NS}:" + ":".join(str(p) for p in parts)


def get_cached(key: str) -> Any | None:
    """
    Retrieve a cached analytics payload.
    Returns None on cache miss or backend error.
    """
    try:
        raw = _get_cache().get(key)
        if raw is None:
            return None
        return json.loads(raw) if isinstance(raw, (str, bytes)) else raw
    except Exception as exc:
        logger.warning("Analytics cache GET failed for key=%r: %s", key, exc)
        return None


def set_cached(key: str, payload: Any, ttl: int = ANALYTICS_CACHE_TTL) -> bool:
    """
    Store a analytics payload in the cache.
    Returns True on success, False on backend error.
    """
    try:
        _get_cache().set(key, payload, timeout=ttl)
        return True
    except Exception as exc:
        logger.warning("Analytics cache SET failed for key=%r: %s", key, exc)
        return False


def invalidate(key: str) -> None:
    """Delete a single cache entry."""
    try:
        _get_cache().delete(key)
    except Exception as exc:
        logger.warning("Analytics cache DELETE failed for key=%r: %s", key, exc)


def invalidate_for_entity(entity_type: str, entity_id: int) -> None:
    """
    Best-effort invalidation for all cache keys related to a given entity.
    Uses pattern-based deletion when the backend supports it.
    """
    pattern = f"{CACHE_NS}:{entity_type}:{entity_id}:*"
    try:
        backend = _get_cache()
        if hasattr(backend, "delete_pattern"):
            backend.delete_pattern(pattern)
        else:
            # Fallback: delete well-known keys individually
            for suffix in ["overview", "trends", "funnel", "questions"]:
                invalidate(f"{CACHE_NS}:{entity_type}:{entity_id}:{suffix}")
    except Exception as exc:
        logger.warning(
            "Analytics cache pattern invalidation failed for %r: %s", pattern, exc
        )


# ────────────────────────────────────────────────────────────
#  Convenience wrappers for common cache targets
# ────────────────────────────────────────────────────────────

def get_dashboard_cache(user_id: int) -> Any | None:
    return get_cached(make_cache_key("dashboard", user_id))


def set_dashboard_cache(user_id: int, payload: Any, ttl: int = ANALYTICS_CACHE_TTL) -> None:
    set_cached(make_cache_key("dashboard", user_id), payload, ttl)


def get_survey_cache(survey_id: int) -> Any | None:
    return get_cached(make_cache_key("survey", survey_id))


def set_survey_cache(survey_id: int, payload: Any, ttl: int = ANALYTICS_CACHE_TTL) -> None:
    set_cached(make_cache_key("survey", survey_id), payload, ttl)


def get_campaign_cache(campaign_id: int) -> Any | None:
    return get_cached(make_cache_key("campaign", campaign_id))


def set_campaign_cache(campaign_id: int, payload: Any, ttl: int = ANALYTICS_CACHE_TTL) -> None:
    set_cached(make_cache_key("campaign", campaign_id), payload, ttl)


def get_engagement_cache(user_id: int) -> Any | None:
    return get_cached(make_cache_key("engagement", user_id))


def set_engagement_cache(user_id: int, payload: Any, ttl: int = ANALYTICS_CACHE_TTL) -> None:
    set_cached(make_cache_key("engagement", user_id), payload, ttl)
