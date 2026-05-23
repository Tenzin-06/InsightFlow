"""
Campaign analytics computation service.

Computes delivery volume, response rate, and
funnel metrics for a single email campaign.
"""

from __future__ import annotations

import logging

from apps.analytics.services.metrics_service import (
    compute_delivery_rate,
    compute_response_rate,
    summarize_metrics,
)
from apps.analytics.services.aggregation_service import (
    aggregate_campaign_deliveries,
    get_campaign_delivery_trend,
)
from apps.analytics.utils import build_funnel_step

logger = logging.getLogger(__name__)


def get_campaign_metrics(campaign_id: int) -> dict:
    """
    Compute high-level KPI metrics for a single campaign.

    Returns:
        {
            "emails_sent": float,
            "emails_failed": float,
            "delivery_rate": float,   # % of attempts that succeeded
            "response_rate": float,   # % of sent emails with a survey response
        }
    """
    delivery = aggregate_campaign_deliveries(campaign_id)
    total_attempted = delivery["total_attempted"]
    sent = delivery["sent"]
    failed = delivery["failed"]

    responses = _get_responses_for_campaign(campaign_id)

    delivery_rate = compute_delivery_rate(sent, total_attempted)
    response_rate = compute_response_rate(responses, sent)

    return summarize_metrics(
        emails_sent=sent,
        emails_failed=failed,
        delivery_rate=delivery_rate,
        response_rate=response_rate,
        total_responses=responses,
    )


def get_campaign_delivery_funnel(campaign_id: int) -> list[dict]:
    """
    Return the campaign delivery funnel.

    Stages (what we can currently compute):
        Attempted → Sent → Response Submitted

    Future enhancements (when email open/click tracking is added):
        Attempted → Sent → Opened → Clicked → Response

    Returns:
        [
            {"label": "Attempted", "value": 1200, "percentage": 100.0},
            {"label": "Sent", "value": 1000, "percentage": 83.3},
            {"label": "Responded", "value": 320, "percentage": 26.7},
        ]
    """
    delivery = aggregate_campaign_deliveries(campaign_id)
    total_attempted = delivery["total_attempted"]
    sent = delivery["sent"]
    responses = _get_responses_for_campaign(campaign_id)

    if not total_attempted:
        return []

    from apps.analytics.services.metrics_service import compute_rate

    return [
        build_funnel_step("Attempted", total_attempted, 100.0),
        build_funnel_step("Sent", sent, compute_rate(sent, total_attempted)),
        build_funnel_step("Responded", responses, compute_rate(responses, total_attempted)),
    ]


def get_campaign_analytics(campaign_id: int, days: int = 30) -> dict:
    """
    Build the complete campaign analytics payload.

    Structure:
        {
            "metrics": {...},
            "charts": {
                "delivery_trend": [...],
            },
            "trends": {
                "delivery_trend": [...],
            },
            "funnel": [...],
        }
    """
    metrics = get_campaign_metrics(campaign_id)
    delivery_trend = get_campaign_delivery_trend(campaign_id, days=days)
    funnel = get_campaign_delivery_funnel(campaign_id)

    return {
        "metrics": metrics,
        "charts": {
            "delivery_trend": delivery_trend,
        },
        "trends": {
            "delivery_trend": delivery_trend,
        },
        "funnel": funnel,
    }


# ─── Internal helpers ────────────────────────────────────────────────────────

def _get_responses_for_campaign(campaign_id: int) -> int:
    """
    Count survey responses linked to the campaign's survey.
    Proxy for campaign-driven response volume.
    """
    from apps.responses.models import Response
    from apps.campaigns.models import Campaign

    try:
        campaign = Campaign.objects.get(pk=campaign_id)
        return Response.objects.filter(survey_id=campaign.survey_id).count()
    except Campaign.DoesNotExist:
        return 0
