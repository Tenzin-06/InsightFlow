"""
engagement_evaluator.py
~~~~~~~~~~~~~~~~~~~~~~~~
Continuously evaluates recipient engagement states.

Responsibilities:
- measure engagement status
- detect inactivity
- identify optimization opportunities
- validate reminder eligibility

Evaluation inputs:
- email opens    (Unit 27 — EmailOpen)
- link clicks    (Unit 27 — LinkClick)
- survey progress (Unit 16 — ResponseSession)
- survey completion (Unit 14 — Response)
"""

from django.db.models import Q
from django.utils import timezone

from apps.engagement_optimization.constants import (
    DEFAULT_MAX_REMINDERS_PER_CAMPAIGN,
    DEFAULT_MIN_REMINDER_GAP_HOURS,
)
from apps.engagement_optimization.models import OptimizationEvent
from apps.engagement_optimization.constants import OPT_EVENT_REMINDER_SENT
from apps.engagement.models import EmailOpen, LinkClick, ResponseSession
from apps.responses.models import Response


# ---------------------------------------------------------------------------
# Engagement state helpers
# ---------------------------------------------------------------------------

def has_opened_email(*, campaign, email: str) -> bool:
    return EmailOpen.objects.filter(
        token__campaign=campaign,
        token__recipient_email__iexact=email,
    ).exists()


def has_clicked_link(*, campaign, email: str) -> bool:
    return LinkClick.objects.filter(
        token__campaign=campaign,
        token__recipient_email__iexact=email,
    ).exists()


def has_started_survey(*, campaign, email: str) -> bool:
    return ResponseSession.objects.filter(
        campaign=campaign,
        recipient_email__iexact=email,
        started_at__isnull=False,
    ).exists()


def has_completed_survey(*, campaign, email: str) -> bool:
    normalized = email.strip().lower()
    return Response.objects.filter(survey=campaign.survey).filter(
        Q(metadata__recipient_email__iexact=normalized)
        | Q(metadata__email__iexact=normalized)
        | Q(metadata__respondent_email__iexact=normalized)
    ).exists()


def has_dropped_off(*, campaign, email: str) -> bool:
    return ResponseSession.objects.filter(
        campaign=campaign,
        recipient_email__iexact=email,
        dropped_off_at__isnull=False,
        completed_at__isnull=True,
    ).exists()


# ---------------------------------------------------------------------------
# Reminder eligibility
# ---------------------------------------------------------------------------

def count_reminders_sent(*, campaign, email: str) -> int:
    return OptimizationEvent.objects.filter(
        campaign=campaign,
        recipient_email__iexact=email,
        event_type=OPT_EVENT_REMINDER_SENT,
    ).count()


def is_reminder_eligible(
    *,
    campaign,
    email: str,
    reminder_limit: int = DEFAULT_MAX_REMINDERS_PER_CAMPAIGN,
    min_gap_hours: int = DEFAULT_MIN_REMINDER_GAP_HOURS,
) -> tuple[bool, str]:
    """
    Returns (is_eligible: bool, reason: str).

    A recipient is NOT eligible if:
    - They completed the survey.
    - They exceeded the reminder limit.
    - The last reminder was sent within the minimum gap.
    """
    if has_completed_survey(campaign=campaign, email=email):
        return False, "already_completed"

    sent_count = count_reminders_sent(campaign=campaign, email=email)
    if sent_count >= reminder_limit:
        return False, "reminder_limit_reached"

    last_event = (
        OptimizationEvent.objects.filter(
            campaign=campaign,
            recipient_email__iexact=email,
            event_type=OPT_EVENT_REMINDER_SENT,
        )
        .order_by("-triggered_at")
        .first()
    )
    if last_event:
        elapsed_hours = (timezone.now() - last_event.triggered_at).total_seconds() / 3600
        if elapsed_hours < min_gap_hours:
            return False, "min_gap_not_reached"

    return True, "eligible"
