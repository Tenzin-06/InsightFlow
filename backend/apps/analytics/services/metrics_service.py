"""
Centralized analytics metrics computation.

All KPI formulas live here to guarantee consistent values across
dashboard, survey, and campaign analytics endpoints.
"""

from __future__ import annotations


def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Divide numerator by denominator, returning default when denominator is 0."""
    if not denominator:
        return default
    return numerator / denominator


def compute_rate(count: int, total: int) -> float:
    """
    Return count / total as a percentage (0–100), rounded to 2 decimal places.
    Returns 0.0 when total is 0 to avoid division by zero.
    """
    if not total:
        return 0.0
    return round((count / total) * 100, 2)


def compute_completion_rate(completed: int, started: int) -> float:
    """Percentage of started surveys that reached submission."""
    return compute_rate(completed, started)


def compute_open_rate(opens: int, sent: int) -> float:
    """Percentage of sent emails that were opened."""
    return compute_rate(opens, sent)


def compute_click_rate(clicks: int, sent: int) -> float:
    """Percentage of sent emails where a link was clicked."""
    return compute_rate(clicks, sent)


def compute_response_rate(responses: int, sent: int) -> float:
    """Percentage of sent emails that resulted in a survey response."""
    return compute_rate(responses, sent)


def compute_delivery_rate(sent: int, attempted: int) -> float:
    """Percentage of attempted email sends that succeeded."""
    return compute_rate(sent, attempted)


def compute_drop_off_rate(dropped: int, started: int) -> float:
    """Percentage of survey starts that did not reach completion."""
    return compute_rate(dropped, started)


def compute_trend_change(current: int | float, previous: int | float) -> float:
    """
    Percentage change from previous to current period.
    Returns 0.0 when previous is 0.
    """
    if not previous:
        return 0.0
    return round(((current - previous) / abs(previous)) * 100, 2)


def normalize_metric(value: float) -> float:
    """Clamp any metric to a non-negative float, rounded to 2 decimal places."""
    return round(max(0.0, value), 2)


def summarize_metrics(**kwargs: float | int) -> dict:
    """
    Build a normalized metric summary dict from keyword arguments.
    All values are passed through normalize_metric.

    Example:
        summarize_metrics(total_responses=42, completion_rate=78.5)
        → {"total_responses": 42.0, "completion_rate": 78.5}
    """
    return {key: normalize_metric(float(val)) for key, val in kwargs.items()}
