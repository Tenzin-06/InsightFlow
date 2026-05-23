"""
Engagement analytics engine.

Computes respondent engagement metrics across all of a user's
surveys and campaigns. Builds the engagement funnel from delivery
and response data.

Future expansion: when Unit 27 (Engagement Tracking System) is
implemented, open/click events will feed into this service for
richer funnel stages.
"""

from __future__ import annotations

import logging
from datetime import timedelta

from django.utils import timezone

from apps.analytics.services.metrics_service import compute_rate, summarize_metrics
from apps.analytics.services.aggregation_service import get_dashboard_response_trend
from apps.analytics.utils import build_funnel_step

logger = logging.getLogger(__name__)


def get_engagement_overview(user_id: int) -> dict:
    """
    Compute high-level engagement KPIs for all of a user's campaigns.

    Returns:
        {
            "total_sent": float,
            "total_responses": float,
            "total_campaigns": float,
            "overall_response_rate": float,
        }
    """
    from apps.campaigns.models import Campaign

    total_sent = _get_total_emails_sent(user_id)
    total_responses = _get_total_responses(user_id)
    total_campaigns = Campaign.objects.filter(owner_id=user_id).count()

    overall_response_rate = compute_rate(total_responses, total_sent)

    return summarize_metrics(
        total_sent=total_sent,
        total_responses=total_responses,
        total_campaigns=total_campaigns,
        overall_response_rate=overall_response_rate,
    )


def get_engagement_funnel(user_id: int) -> list[dict]:
    """
    Return the engagement funnel across all of a user's campaigns.

    Current stages:
        Emails Sent → Responses Submitted

    Future stages (Unit 27):
        Emails Sent → Opened → Clicked → Started → Completed

    Returns:
        [
            {"label": "Emails Sent", "value": 5000, "percentage": 100.0},
            {"label": "Responses", "value": 1200, "percentage": 24.0},
        ]
    """
    total_sent = _get_total_emails_sent(user_id)
    total_responses = _get_total_responses(user_id)

    if not total_sent:
        # No campaigns yet — show pure survey response count
        return [
            build_funnel_step("Responses", total_responses, 100.0),
        ]

    response_pct = compute_rate(total_responses, total_sent)

    return [
        build_funnel_step("Emails Sent", total_sent, 100.0),
        build_funnel_step("Responses", total_responses, response_pct),
    ]


def get_engagement_drop_off(user_id: int) -> list[dict]:
    """
    Return per-survey drop-off analysis sorted by lowest engagement rate.

    Output:
        [
            {
                "survey_id": 1,
                "title": "Customer Satisfaction Survey",
                "emails_sent": 200,
                "responses": 40,
                "response_rate": 20.0,
                "drop_off_rate": 80.0,
            },
            ...
        ]
    """
    from apps.surveys.models.survey import Survey
    from apps.responses.models import Response
    from apps.email_campaigns.models import DeliveryLog
    from apps.email_campaigns.constants import DELIVERY_STATUS_SENT

    surveys = Survey.objects.filter(owner_id=user_id).prefetch_related("campaigns")
    result = []

    for survey in surveys:
        sent = DeliveryLog.objects.filter(
            campaign__survey_id=survey.id, status=DELIVERY_STATUS_SENT
        ).count()
        responses = Response.objects.filter(survey_id=survey.id).count()
        response_rate = compute_rate(responses, sent) if sent else 0.0
        drop_off_rate = 100.0 - response_rate if sent else 0.0

        result.append(
            {
                "survey_id": survey.id,
                "title": survey.title,
                "emails_sent": sent,
                "responses": responses,
                "response_rate": round(response_rate, 2),
                "drop_off_rate": round(drop_off_rate, 2),
            }
        )

    # Sort by lowest response rate (highest drop-off first)
    result.sort(key=lambda x: x["response_rate"])
    return result


def get_interaction_timeline(user_id: int, days: int = 30) -> list[dict]:
    """
    Return daily interaction counts (responses) over the last N days
    for use in a trend/area chart.
    """
    return get_dashboard_response_trend(user_id, days=days)


def get_audience_segments(user_id: int) -> list[dict]:
    """
    Return audience segment breakdown by campaign.

    Output:
        [
            {"label": "Campaign A", "value": 350, "fill": None},
            ...
        ]
    """
    from apps.campaigns.models import Campaign
    from apps.email_campaigns.models import DeliveryLog
    from apps.email_campaigns.constants import DELIVERY_STATUS_SENT

    campaigns = Campaign.objects.filter(owner_id=user_id)
    result = []

    for campaign in campaigns:
        sent = DeliveryLog.objects.filter(
            campaign_id=campaign.id, status=DELIVERY_STATUS_SENT
        ).count()
        if sent > 0:
            result.append({"label": campaign.title, "value": sent, "fill": None})

    # Sort by volume descending
    result.sort(key=lambda x: x["value"], reverse=True)
    return result[:10]  # cap at 10 segments for chart clarity


def get_engagement_analytics(user_id: int, days: int = 30) -> dict:
    """
    Build the complete engagement analytics payload.

    Structure:
        {
            "metrics": {...},
            "charts": {
                "funnel": [...],
                "drop_off": [...],
                "timeline": [...],
                "segments": [...],
            },
            "trends": {
                "timeline": [...],
            },
            "funnel": [...],
        }
    """
    overview = get_engagement_overview(user_id)
    funnel = get_engagement_funnel(user_id)
    drop_off = get_engagement_drop_off(user_id)
    timeline = get_interaction_timeline(user_id, days=days)
    segments = get_audience_segments(user_id)

    return {
        "metrics": overview,
        "charts": {
            "funnel": funnel,
            "drop_off": drop_off,
            "timeline": timeline,
            "segments": segments,
        },
        "trends": {
            "timeline": timeline,
        },
        "funnel": funnel,
    }


# ─── Internal helpers ────────────────────────────────────────────────────────

def _get_total_emails_sent(user_id: int) -> int:
    from apps.email_campaigns.models import DeliveryLog
    from apps.email_campaigns.constants import DELIVERY_STATUS_SENT

    return DeliveryLog.objects.filter(
        campaign__owner_id=user_id,
        status=DELIVERY_STATUS_SENT,
    ).count()


def _get_total_responses(user_id: int) -> int:
    from apps.responses.models import Response

    return Response.objects.filter(survey__owner_id=user_id).count()
