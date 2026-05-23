"""
Campaign send task.

Currently executes synchronously within the request cycle.
The function signature is intentionally compatible with
future Celery task decoration:

    @app.task
    def send_campaign_task(campaign_id: int) -> dict:
        ...

Future: convert to a Celery task with retry support,
exponential backoff, and dead-letter queue routing.
"""

import logging
from apps.email_campaigns.services.campaign_processor import process_campaign

logger = logging.getLogger(__name__)


def send_campaign_task(campaign_id: int) -> dict:
    """
    Entry point for campaign email delivery.

    Args:
        campaign_id: PK of the Campaign to send.

    Returns:
        dict with keys: success, sent, failed, total
    """
    logger.info("send_campaign_task — campaign_id=%s", campaign_id)
    return process_campaign(campaign_id)
