"""
Survey-specific analytics computation service.

Computes participation volume, completion metrics,
funnel stages, and question-level engagement.
"""

from __future__ import annotations

import logging

from apps.analytics.services.metrics_service import (
    compute_rate,
    compute_drop_off_rate,
    summarize_metrics,
)
from apps.analytics.services.aggregation_service import (
    aggregate_survey_responses,
    get_response_time_series,
    get_question_response_counts,
)
from apps.analytics.utils import build_funnel_step

logger = logging.getLogger(__name__)


def get_survey_metrics(survey_id: int) -> dict:
    """
    Compute high-level KPI metrics for a single survey.

    Returns a metrics dict suitable for the dashboard metrics cards:
        {
            "total_responses": float,
            "completion_rate": float,   # % of responders who submitted fully
            "drop_off_rate": float,
            "question_count": float,
        }

    Notes:
        - We do not track "survey started" separately from "submitted",
          so completion_rate reflects what we can currently compute
          (responses vs. emails sent to linked campaigns).
        - This will improve when a dedicated engagement tracking layer
          (Unit 27) is implemented.
    """
    from apps.surveys.models.survey import Survey
    from apps.surveys.models.question import Question

    agg = aggregate_survey_responses(survey_id)
    total_responses = agg["total_responses"]

    # Question count — used as a completeness proxy
    question_count = Question.objects.filter(survey_id=survey_id).count()

    # Compute emails sent for this survey across all campaigns
    emails_sent = _get_emails_sent_for_survey(survey_id)

    # Completion rate: responses / emails_sent (if campaigns exist), else N/A (0)
    completion_rate = compute_rate(total_responses, emails_sent) if emails_sent else 0.0
    drop_off_rate = 100.0 - completion_rate if emails_sent else 0.0

    return summarize_metrics(
        total_responses=total_responses,
        completion_rate=completion_rate,
        drop_off_rate=drop_off_rate,
        question_count=question_count,
    )


def get_survey_funnel(survey_id: int) -> list[dict]:
    """
    Return the survey engagement funnel stages.

    Funnel:
        Emails Sent → Survey Responses (Completed)

    Future phases (when engagement tracking is added):
        Emails Sent → Opened → Clicked → Started → Completed

    Returns:
        [
            {"label": "Emails Sent", "value": 1000, "percentage": 100.0},
            {"label": "Survey Responses", "value": 320, "percentage": 32.0},
        ]
    """
    agg = aggregate_survey_responses(survey_id)
    total_responses = agg["total_responses"]
    emails_sent = _get_emails_sent_for_survey(survey_id)

    steps: list[dict] = []

    if emails_sent:
        steps.append(build_funnel_step("Emails Sent", emails_sent, 100.0))
        response_pct = compute_rate(total_responses, emails_sent)
        steps.append(
            build_funnel_step("Survey Responses", total_responses, response_pct)
        )
    else:
        # No campaign distribution — show responses only
        steps.append(
            build_funnel_step("Survey Responses", total_responses, 100.0)
        )

    return steps


def get_survey_question_engagement(survey_id: int) -> list[dict]:
    """
    Return per-question engagement metrics, normalized against total responses.

    Output:
        [
            {
                "question_id": 1,
                "question_text": "How satisfied are you?",
                "answer_count": 38,
                "engagement_rate": 90.5,
                "order": 1,
            },
            ...
        ]
    """
    agg = aggregate_survey_responses(survey_id)
    total_responses = agg["total_responses"]

    questions = get_question_response_counts(survey_id)
    result = []
    for q in questions:
        engagement_rate = compute_rate(q["answer_count"], total_responses)
        result.append(
            {
                "question_id": q["question_id"],
                "question_text": q["question_text"],
                "answer_count": q["answer_count"],
                "engagement_rate": engagement_rate,
                "order": q["order"],
            }
        )

    return result


def get_survey_analytics(survey_id: int, days: int = 30) -> dict:
    """
    Build the complete survey analytics payload for a dashboard page.

    Structure:
        {
            "metrics": {...},
            "charts": {
                "response_trend": [...],
                "question_engagement": [...],
            },
            "trends": {
                "response_trend": [...],
            },
            "funnel": [...],
        }
    """
    metrics = get_survey_metrics(survey_id)
    response_trend = get_response_time_series(survey_id, days=days)
    question_engagement = get_survey_question_engagement(survey_id)
    funnel = get_survey_funnel(survey_id)

    return {
        "metrics": metrics,
        "charts": {
            "response_trend": response_trend,
            "question_engagement": question_engagement,
        },
        "trends": {
            "response_trend": response_trend,
        },
        "funnel": funnel,
    }


# ─── Internal helpers ────────────────────────────────────────────────────────

def _get_emails_sent_for_survey(survey_id: int) -> int:
    """
    Count the total number of successfully sent emails for a survey
    across all its linked campaigns.
    """
    from apps.email_campaigns.models import DeliveryLog
    from apps.email_campaigns.constants import DELIVERY_STATUS_SENT

    return DeliveryLog.objects.filter(
        campaign__survey_id=survey_id,
        status=DELIVERY_STATUS_SENT,
    ).count()
