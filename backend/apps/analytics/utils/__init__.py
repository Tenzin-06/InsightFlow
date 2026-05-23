import logging
from typing import Any

logger = logging.getLogger(__name__)


def success_response(data: Any) -> dict:
    """Standard analytics success payload."""
    return {"success": True, "data": data, "error": None}


def error_response(message: str, code: str = "ANALYTICS_ERROR") -> dict:
    """Standard analytics error payload."""
    return {"success": False, "data": None, "error": {"message": message, "code": code}}


def build_time_series_point(date_str: str, value: int | float) -> dict:
    """Return a single time-series data point for chart rendering."""
    return {"date": date_str, "value": value}


def build_funnel_step(label: str, value: int, percentage: float) -> dict:
    """Return a single funnel step for funnel chart rendering."""
    return {"label": label, "value": value, "percentage": round(percentage, 1)}
