"""
Delivery logging service.

Persists per-recipient delivery outcomes to DeliveryLog records.
Keeps campaign send state in sync with individual delivery results.
"""

import logging
from django.utils import timezone
from apps.email_campaigns.models.delivery_log import DeliveryLog
from apps.email_campaigns.constants import (
    DELIVERY_STATUS_PENDING,
    DELIVERY_STATUS_SENT,
    DELIVERY_STATUS_FAILED,
)
from apps.email_campaigns.services.resend_service import SendEmailResult

logger = logging.getLogger(__name__)


def create_pending_log(campaign, recipient_email: str, recipient_first_name: str = "") -> DeliveryLog:
    """Create a pending delivery log entry before sending."""
    return DeliveryLog.objects.create(
        campaign=campaign,
        recipient_email=recipient_email,
        recipient_first_name=recipient_first_name,
        status=DELIVERY_STATUS_PENDING,
    )


def record_send_result(log: DeliveryLog, result: SendEmailResult) -> DeliveryLog:
    """Update a DeliveryLog with the outcome of a send attempt."""
    if result.success:
        log.status = DELIVERY_STATUS_SENT
        log.provider_message_id = result.provider_message_id
        log.sent_at = timezone.now()
        log.error_message = ""
    else:
        log.status = DELIVERY_STATUS_FAILED
        log.error_message = result.error_message

    log.save(update_fields=["status", "provider_message_id", "sent_at", "error_message", "updated_at"])
    return log


def get_campaign_delivery_summary(campaign) -> dict:
    """Return a summary of delivery counts for a campaign."""
    logs = DeliveryLog.objects.filter(campaign=campaign)
    return {
        "total": logs.count(),
        "sent": logs.filter(status=DELIVERY_STATUS_SENT).count(),
        "failed": logs.filter(status=DELIVERY_STATUS_FAILED).count(),
        "pending": logs.filter(status=DELIVERY_STATUS_PENDING).count(),
    }
