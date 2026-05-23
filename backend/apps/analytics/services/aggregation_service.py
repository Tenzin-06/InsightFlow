"""
Raw event aggregation pipeline.

Collects raw events from Response, Answer, and DeliveryLog models,
computes derived metrics, and returns normalized analytics values
ready for dashboard consumption.
"""

from __future__ import annotations

import logging
from datetime import date, timedelta

from django.db.models import Count, Q
from django.utils import timezone

from apps.analytics.utils import build_time_series_point

logger = logging.getLogger(__name__)


def get_response_time_series(
    survey_id: int,
    days: int = 30,
) -> list[dict]:
    """
    Return daily response counts for a survey over the last `days` days.

    Output:
        [{"date": "2026-05-01", "value": 12}, ...]
    """
    from apps.responses.models import Response  # local import avoids circular deps

    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=days - 1)

    qs = (
        Response.objects.filter(
            survey_id=survey_id,
            submitted_at__date__gte=start_date,
            submitted_at__date__lte=end_date,
        )
        .extra({"day": "DATE(submitted_at)"})
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )

    # Build a complete date range with 0 fills for missing days
    counts_by_date: dict[str, int] = {row["day"]: row["count"] for row in qs}

    series: list[dict] = []
    current = start_date
    while current <= end_date:
        date_str = current.isoformat()
        series.append(build_time_series_point(date_str, counts_by_date.get(date_str, 0)))
        current += timedelta(days=1)

    return series


def get_campaign_delivery_trend(
    campaign_id: int,
    days: int = 30,
) -> list[dict]:
    """
    Return daily successful delivery counts for a campaign.

    Output:
        [{"date": "2026-05-01", "value": 45}, ...]
    """
    from apps.email_campaigns.models import DeliveryLog
    from apps.email_campaigns.constants import DELIVERY_STATUS_SENT

    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=days - 1)

    qs = (
        DeliveryLog.objects.filter(
            campaign_id=campaign_id,
            status=DELIVERY_STATUS_SENT,
            sent_at__date__gte=start_date,
            sent_at__date__lte=end_date,
        )
        .extra({"day": "DATE(sent_at)"})
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )

    counts_by_date: dict[str, int] = {row["day"]: row["count"] for row in qs}

    series: list[dict] = []
    current = start_date
    while current <= end_date:
        date_str = current.isoformat()
        series.append(build_time_series_point(date_str, counts_by_date.get(date_str, 0)))
        current += timedelta(days=1)

    return series


def get_dashboard_response_trend(
    user_id: int,
    days: int = 30,
) -> list[dict]:
    """
    Return daily response counts across ALL of a user's surveys.

    Output:
        [{"date": "2026-05-01", "value": 23}, ...]
    """
    from apps.responses.models import Response

    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=days - 1)

    qs = (
        Response.objects.filter(
            survey__owner_id=user_id,
            submitted_at__date__gte=start_date,
            submitted_at__date__lte=end_date,
        )
        .extra({"day": "DATE(submitted_at)"})
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )

    counts_by_date: dict[str, int] = {row["day"]: row["count"] for row in qs}

    series: list[dict] = []
    current = start_date
    while current <= end_date:
        date_str = current.isoformat()
        series.append(build_time_series_point(date_str, counts_by_date.get(date_str, 0)))
        current += timedelta(days=1)

    return series


def aggregate_survey_responses(survey_id: int) -> dict:
    """
    Aggregate response counts and answer coverage for a survey.

    Returns:
        {
            "total_responses": int,
            "total_answers": int,
            "unique_respondents": int,
        }
    """
    from apps.responses.models import Response, Answer

    total_responses = Response.objects.filter(survey_id=survey_id).count()
    total_answers = Answer.objects.filter(response__survey_id=survey_id).count()
    unique_respondents = (
        Response.objects.filter(survey_id=survey_id, respondent__isnull=False)
        .values("respondent_id")
        .distinct()
        .count()
    )

    return {
        "total_responses": total_responses,
        "total_answers": total_answers,
        "unique_respondents": unique_respondents,
    }


def aggregate_campaign_deliveries(campaign_id: int) -> dict:
    """
    Aggregate delivery log counts for a campaign.

    Returns:
        {
            "total_attempted": int,
            "sent": int,
            "failed": int,
            "pending": int,
        }
    """
    from apps.email_campaigns.models import DeliveryLog
    from apps.email_campaigns.constants import (
        DELIVERY_STATUS_SENT,
        DELIVERY_STATUS_FAILED,
        DELIVERY_STATUS_PENDING,
    )

    total = DeliveryLog.objects.filter(campaign_id=campaign_id).count()
    sent = DeliveryLog.objects.filter(
        campaign_id=campaign_id, status=DELIVERY_STATUS_SENT
    ).count()
    failed = DeliveryLog.objects.filter(
        campaign_id=campaign_id, status=DELIVERY_STATUS_FAILED
    ).count()
    pending = DeliveryLog.objects.filter(
        campaign_id=campaign_id, status=DELIVERY_STATUS_PENDING
    ).count()

    return {
        "total_attempted": total,
        "sent": sent,
        "failed": failed,
        "pending": pending,
    }


def get_question_response_counts(survey_id: int) -> list[dict]:
    """
    Return per-question answer counts for a survey, ordered by question order.

    Output:
        [
            {"question_id": 1, "question_text": "...", "answer_count": 42, "order": 1},
            ...
        ]
    """
    from apps.responses.models import Answer
    from apps.surveys.models.question import Question

    questions = Question.objects.filter(survey_id=survey_id).order_by("order")

    result = []
    for question in questions:
        answer_count = Answer.objects.filter(question_id=question.id).count()
        result.append(
            {
                "question_id": question.id,
                "question_text": question.question_text,
                "answer_count": answer_count,
                "order": question.order,
            }
        )

    return result


def get_top_surveys_by_responses(user_id: int, limit: int = 5) -> list[dict]:
    """
    Return the user's top surveys ranked by total response count.

    Output:
        [
            {"survey_id": 1, "title": "...", "response_count": 42},
            ...
        ]
    """
    from apps.responses.models import Response
    from apps.surveys.models.survey import Survey

    qs = (
        Survey.objects.filter(owner_id=user_id)
        .annotate(response_count=Count("responses"))
        .order_by("-response_count")[:limit]
    )

    return [
        {
            "survey_id": s.id,
            "title": s.title,
            "response_count": s.response_count,
        }
        for s in qs
    ]
