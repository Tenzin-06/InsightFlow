import logging

from apps.automation.models import AutomationEvent

logger = logging.getLogger(__name__)


def log_automation_event(
    *,
    campaign,
    event_type: str,
    schedule=None,
    recipient_email: str = "",
    message: str = "",
    metadata: dict | None = None,
) -> AutomationEvent:
    event = AutomationEvent.objects.create(
        schedule=schedule,
        campaign=campaign,
        owner=campaign.owner,
        event_type=event_type,
        recipient_email=recipient_email,
        message=message,
        metadata=metadata or {},
    )
    logger.info(
        "Automation event: type=%s campaign_id=%s schedule_id=%s recipient=%s",
        event_type,
        campaign.pk,
        getattr(schedule, "pk", None),
        recipient_email,
    )
    return event

