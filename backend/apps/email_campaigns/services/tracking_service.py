"""
Tracking service — placeholder.

Currently a stub ready for future expansion into:
- open/click tracking
- bounce tracking
- unsubscribe workflows
- analytics event ingestion
- webhook processing

Deferred per Unit 24 scope (see feature spec).
"""

import logging

logger = logging.getLogger(__name__)


def record_send_event(campaign_id: int, recipient_email: str, message_id: str) -> None:
    """
    Record that an email was dispatched to a recipient.
    Future: persist to EmailEvent model and/or analytics pipeline.
    """
    logger.info(
        "Email dispatched — campaign=%s recipient=%s message_id=%s",
        campaign_id,
        recipient_email,
        message_id,
    )
