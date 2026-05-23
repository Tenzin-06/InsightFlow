"""
Queue service — synchronous placeholder.

Currently executes campaign email delivery synchronously.
Prepared for future migration to Celery + Redis distributed queues.

Future architecture will support:
- Celery task dispatch
- Redis task queues
- Distributed workers
- Dead-letter queues
"""

import logging
from typing import Callable

logger = logging.getLogger(__name__)


def enqueue_campaign_send(campaign_id: int, process_fn: Callable) -> None:
    """
    Enqueue a campaign send job.

    In the current synchronous implementation, the process function
    is called immediately in the same request-response cycle.
    Future: dispatch to Celery worker.
    """
    logger.info("Dispatching campaign send — campaign_id=%s (synchronous)", campaign_id)
    process_fn(campaign_id)
