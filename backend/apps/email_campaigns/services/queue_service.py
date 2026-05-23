"""
Queue service — async task dispatch via Trigger.dev.

Responsible for:
- creating a BackgroundJob record (returns job_id immediately)
- triggering the Trigger.dev task via its REST API
- falling back to synchronous execution when Trigger.dev is not configured
  (safe for local development without credentials)

Workflow:
    API Layer receives send request
    → queue_service creates BackgroundJob (status=queued)
    → queue_service calls Trigger.dev HTTP API
    → Trigger.dev runs Node.js worker asynchronously
    → API Layer returns { success: True, job_id: "..." } immediately
"""

import logging
from typing import Optional

import requests
from django.conf import settings

from apps.email_campaigns.models.background_job import BackgroundJob

logger = logging.getLogger(__name__)

TRIGGER_TASK_SEND_CAMPAIGN = "send-campaign"
TRIGGER_TASK_SEND_TEST_EMAIL = "send-test-email"


def _get_trigger_config() -> tuple[str, str]:
    """Return (secret_key, api_url) from Django settings."""
    secret = getattr(settings, "TRIGGER_SECRET_KEY", "")
    api_url = getattr(settings, "TRIGGER_API_URL", "https://api.trigger.dev")
    return secret, api_url


def _dispatch_to_trigger(task_id: str, payload: dict, job: BackgroundJob) -> None:
    """
    Send a trigger request to Trigger.dev API.

    On success:  updates job with trigger_job_id + status=running
    On failure:  logs the error but does NOT raise — the job record
                 is left in queued state so callers still get a job_id back.
    """
    secret, api_url = _get_trigger_config()

    try:
        response = requests.post(
            f"{api_url}/api/v1/tasks/{task_id}/trigger",
            headers={
                "Authorization": f"Bearer {secret}",
                "Content-Type": "application/json",
            },
            json={"payload": payload},
            timeout=10,
        )
        response.raise_for_status()

        trigger_data: dict = response.json()
        trigger_job_id: str = trigger_data.get("id", "")

        job.mark_running(trigger_job_id=trigger_job_id)
        logger.info(
            "Trigger.dev task enqueued — task_id=%s, job_id=%s, trigger_job_id=%s",
            task_id,
            job.pk,
            trigger_job_id,
        )

    except requests.RequestException as exc:
        logger.error(
            "Failed to dispatch task to Trigger.dev — task_id=%s, job_id=%s, error=%s",
            task_id,
            job.pk,
            exc,
        )
        # Do NOT mark as failed here — caller still returns the job_id


def _fallback_sync_execute(task_id: str, job: BackgroundJob) -> None:
    """
    Execute the task synchronously when Trigger.dev is not configured.
    Used in local development without Trigger.dev credentials.
    """
    logger.warning(
        "TRIGGER_SECRET_KEY not configured — falling back to synchronous execution for task=%s",
        task_id,
    )

    try:
        if task_id == TRIGGER_TASK_SEND_CAMPAIGN:
            from apps.email_campaigns.services.campaign_processor import process_campaign

            campaign_id = job.payload.get("campaignId")
            result = process_campaign(campaign_id)
            job.mark_completed(result=result)

        else:
            logger.warning("No synchronous fallback implemented for task=%s", task_id)
            job.mark_running()

    except Exception as exc:
        logger.error("Synchronous fallback failed — task_id=%s, error=%s", task_id, exc)
        job.mark_failed(error_message=str(exc))


def enqueue_campaign_send(campaign_id: int) -> str:
    """
    Enqueue a campaign send job.

    Creates a BackgroundJob record, dispatches the task to Trigger.dev
    (or falls back to synchronous execution in development), and returns
    the job's primary key as a string for the API response.

    Args:
        campaign_id: PK of the Campaign to deliver.

    Returns:
        str: The BackgroundJob PK (used as job_id in API responses).
    """
    payload = {"campaignId": campaign_id}

    job = BackgroundJob.objects.create(
        task_id=TRIGGER_TASK_SEND_CAMPAIGN,
        status=BackgroundJob.STATUS_QUEUED,
        payload=payload,
    )

    logger.info(
        "Campaign send job created — campaign_id=%s, job_id=%s",
        campaign_id,
        job.pk,
    )

    secret, _ = _get_trigger_config()

    if secret:
        _dispatch_to_trigger(TRIGGER_TASK_SEND_CAMPAIGN, payload, job)
    else:
        _fallback_sync_execute(TRIGGER_TASK_SEND_CAMPAIGN, job)

    return str(job.pk)


def enqueue_test_email(campaign_id: int, email: str) -> str:
    """
    Enqueue a test email send job.

    Args:
        campaign_id: PK of the Campaign.
        email:       Test recipient email address.

    Returns:
        str: The BackgroundJob PK (used as job_id in API responses).
    """
    payload = {"campaignId": campaign_id, "email": email}

    job = BackgroundJob.objects.create(
        task_id=TRIGGER_TASK_SEND_TEST_EMAIL,
        status=BackgroundJob.STATUS_QUEUED,
        payload=payload,
    )

    logger.info(
        "Test email job created — campaign_id=%s, email=%s, job_id=%s",
        campaign_id,
        email,
        job.pk,
    )

    secret, _ = _get_trigger_config()

    if secret:
        _dispatch_to_trigger(TRIGGER_TASK_SEND_TEST_EMAIL, payload, job)
    else:
        # Synchronous fallback for test sends in development
        try:
            from apps.email_campaigns.services.campaign_processor import process_test_send

            result = process_test_send(campaign_id, email)
            job.mark_completed(result=result)
        except Exception as exc:
            logger.error("Test email synchronous fallback failed: %s", exc)
            job.mark_failed(error_message=str(exc))

    return str(job.pk)


def get_job_status(job_id: str) -> Optional[BackgroundJob]:
    """
    Retrieve a BackgroundJob record by its PK.

    Returns None if not found rather than raising an exception —
    callers handle the not-found case themselves.
    """
    try:
        return BackgroundJob.objects.get(pk=int(job_id))
    except (BackgroundJob.DoesNotExist, ValueError, TypeError):
        return None
