import logging

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.automation.constants import (
    AUTOMATION_EVENT_FAILED,
    AUTOMATION_EVENT_REMINDER_SENT,
    AUTOMATION_EVENT_REMINDER_SKIPPED,
)
from apps.automation.services.automation_logger import log_automation_event
from apps.automation.services.eligibility_service import get_eligible_reminder_recipients
from apps.campaigns.models.campaign import Campaign
from apps.email_campaigns.services.delivery_service import create_pending_log, record_send_result
from apps.email_campaigns.services.email_renderer import render_email
from apps.email_campaigns.services.resend_service import SendEmailRequest, send_email
from apps.email_campaigns.utils.personalization_utils import build_email_context
from apps.email_campaigns.utils.template_utils import get_survey_link

logger = logging.getLogger(__name__)


def process_reminders(*, campaign_id: int, delay_days: int) -> dict:
    campaign = Campaign.objects.select_related("survey", "owner").get(pk=campaign_id)
    candidates = get_eligible_reminder_recipients(campaign=campaign, delay_days=delay_days)

    if not candidates:
        log_automation_event(
            campaign=campaign,
            event_type=AUTOMATION_EVENT_REMINDER_SKIPPED,
            message="No eligible reminder recipients.",
            metadata={"delay_days": delay_days},
        )
        return {"success": True, "sent": 0, "failed": 0, "total": 0}

    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@insightflow.ai")
    survey_link = get_survey_link(campaign.survey)
    sent_count = 0
    failed_count = 0

    for candidate in candidates:
        context = build_email_context(
            recipient_email=candidate.email,
            first_name=candidate.first_name,
            survey_link=survey_link,
            campaign_name=campaign.title,
        )
        log = create_pending_log(campaign, candidate.email, candidate.first_name)

        try:
            html_body, text_body = render_email("reminder_email", context)
            result = send_email(
                SendEmailRequest(
                    to=candidate.email,
                    subject=campaign.subject or f"Reminder: {campaign.title}",
                    html_body=html_body,
                    text_body=text_body,
                    from_email=from_email,
                )
            )
            record_send_result(log, result)
        except RuntimeError as exc:
            log.status = "failed"
            log.error_message = str(exc)
            log.save(update_fields=["status", "error_message", "updated_at"])
            result = None

        if result and result.success:
            with transaction.atomic():
                candidate.rule.reminder_count += 1
                candidate.rule.last_reminder_at = timezone.now()
                candidate.rule.save(update_fields=["reminder_count", "last_reminder_at", "updated_at"])
            sent_count += 1
            log_automation_event(
                campaign=campaign,
                event_type=AUTOMATION_EVENT_REMINDER_SENT,
                recipient_email=candidate.email,
                message="Reminder email sent.",
                metadata={"delay_days": delay_days, "reminder_count": candidate.rule.reminder_count},
            )
        else:
            failed_count += 1
            log_automation_event(
                campaign=campaign,
                event_type=AUTOMATION_EVENT_FAILED,
                recipient_email=candidate.email,
                message="Reminder email failed.",
                metadata={"delay_days": delay_days},
            )

    logger.info(
        "Reminder processing complete campaign_id=%s delay_days=%s sent=%s failed=%s",
        campaign_id,
        delay_days,
        sent_count,
        failed_count,
    )
    return {"success": True, "sent": sent_count, "failed": failed_count, "total": len(candidates)}

