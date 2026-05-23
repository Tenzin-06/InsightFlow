from dataclasses import dataclass

from django.db.models import Q
from django.utils import timezone

from apps.automation.models import AutomationEvent, ReminderRule
from apps.email_campaigns.constants import DELIVERY_STATUS_SENT
from apps.email_campaigns.models import DeliveryLog
from apps.responses.models import Response


@dataclass(frozen=True)
class ReminderCandidate:
    email: str
    first_name: str
    original_sent_at: object
    rule: ReminderRule


def _has_completed_survey(*, campaign, email: str) -> bool:
    normalized = email.strip().lower()
    return Response.objects.filter(survey=campaign.survey).filter(
        Q(metadata__recipient_email__iexact=normalized)
        | Q(metadata__email__iexact=normalized)
        | Q(metadata__respondent_email__iexact=normalized)
    ).exists()


def _get_or_create_recipient_rule(*, campaign, campaign_rule: ReminderRule, email: str) -> ReminderRule:
    rule, _ = ReminderRule.objects.get_or_create(
        campaign=campaign,
        delay_days=campaign_rule.delay_days,
        recipient_email=email,
        defaults={
            "owner": campaign.owner,
            "reminder_type": campaign_rule.reminder_type,
            "max_reminders": campaign_rule.max_reminders,
            "is_enabled": campaign_rule.is_enabled,
        },
    )
    return rule


def get_eligible_reminder_recipients(*, campaign, delay_days: int) -> list[ReminderCandidate]:
    campaign_rule = ReminderRule.objects.filter(
        campaign=campaign,
        delay_days=delay_days,
        recipient_email="",
        is_enabled=True,
    ).first()
    if campaign_rule is None:
        return []

    cutoff = timezone.now() - timezone.timedelta(days=delay_days)
    sent_logs = (
        DeliveryLog.objects.filter(
            campaign=campaign,
            status=DELIVERY_STATUS_SENT,
            sent_at__lte=cutoff,
        )
        .order_by("recipient_email", "-sent_at")
        .distinct("recipient_email")
    )

    candidates: list[ReminderCandidate] = []
    for log in sent_logs:
        email = log.recipient_email.strip().lower()
        if not email:
            continue

        rule = _get_or_create_recipient_rule(
            campaign=campaign,
            campaign_rule=campaign_rule,
            email=email,
        )

        if not rule.is_enabled or rule.reminder_count >= rule.max_reminders:
            continue
        if _has_completed_survey(campaign=campaign, email=email):
            if rule.last_reminder_at:
                rule.responded_after_reminder = True
                rule.save(update_fields=["responded_after_reminder", "updated_at"])
            continue
        if AutomationEvent.objects.filter(
            campaign=campaign,
            recipient_email=email,
            event_type="reminder_sent",
            metadata__delay_days=delay_days,
        ).exists():
            continue

        candidates.append(
            ReminderCandidate(
                email=email,
                first_name=log.recipient_first_name,
                original_sent_at=log.sent_at,
                rule=rule,
            )
        )

    return candidates
