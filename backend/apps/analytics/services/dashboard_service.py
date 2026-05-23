"""
Dashboard data computation service.

Aggregates multiple analytics services into a single, frontend-optimized
payload. Reduces frontend computation and structures visualization data.
"""

from __future__ import annotations

import logging

from apps.analytics.services.metrics_service import compute_rate, summarize_metrics
from apps.analytics.services.aggregation_service import (
    get_dashboard_response_trend,
    get_top_surveys_by_responses,
)

logger = logging.getLogger(__name__)


def get_dashboard_overview(user_id: int, days: int = 30) -> dict:
    """
    Build the complete dashboard analytics payload for a user.

    Structure matches the frontend DashboardOverview type:
        {
            "metrics": { total_surveys, total_responses, total_campaigns,
                         total_emails_sent, overall_response_rate },
            "charts": {
                "response_trend": [...],
                "top_surveys": [...],
            },
            "trends": {
                "response_trend": [...],
            },
            "segments": {
                "top_surveys": [...],
            },
        }
    """
    from apps.surveys.models.survey import Survey
    from apps.campaigns.models import Campaign

    # ── Aggregate core counts ─────────────────────────────────────────────
    total_surveys = Survey.objects.filter(owner_id=user_id).count()
    total_campaigns = Campaign.objects.filter(owner_id=user_id).count()
    total_responses = _get_total_responses(user_id)
    total_emails_sent = _get_total_emails_sent(user_id)

    overall_response_rate = compute_rate(total_responses, total_emails_sent)

    metrics = summarize_metrics(
        total_surveys=total_surveys,
        total_responses=total_responses,
        total_campaigns=total_campaigns,
        total_emails_sent=total_emails_sent,
        overall_response_rate=overall_response_rate,
    )

    # ── Chart data ────────────────────────────────────────────────────────
    response_trend = get_dashboard_response_trend(user_id, days=days)
    top_surveys = get_top_surveys_by_responses(user_id)

    return {
        "metrics": metrics,
        "charts": {
            "response_trend": response_trend,
            "top_surveys": top_surveys,
        },
        "trends": {
            "response_trend": response_trend,
        },
        "segments": {
            "top_surveys": top_surveys,
        },
    }


# ─── Internal helpers ────────────────────────────────────────────────────────

def _get_total_responses(user_id: int) -> int:
    from apps.responses.models import Response

    return Response.objects.filter(survey__owner_id=user_id).count()


def _get_total_emails_sent(user_id: int) -> int:
    from apps.email_campaigns.models import DeliveryLog
    from apps.email_campaigns.constants import DELIVERY_STATUS_SENT

    return DeliveryLog.objects.filter(
        campaign__owner_id=user_id,
        status=DELIVERY_STATUS_SENT,
    ).count()
