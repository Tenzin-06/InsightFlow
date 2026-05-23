import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def dispatch_trigger_task(
    *,
    task_id: str,
    payload: dict,
    run_at=None,
) -> str:
    secret = getattr(settings, "TRIGGER_SECRET_KEY", "")
    api_url = getattr(settings, "TRIGGER_API_URL", "https://api.trigger.dev")

    if not secret:
        logger.warning("TRIGGER_SECRET_KEY not configured; task %s was not dispatched", task_id)
        return ""

    body: dict = {"payload": payload}
    if run_at is not None:
        body["options"] = {"delay": run_at.isoformat()}

    response = requests.post(
        f"{api_url}/api/v1/tasks/{task_id}/trigger",
        headers={
            "Authorization": f"Bearer {secret}",
            "Content-Type": "application/json",
        },
        json=body,
        timeout=10,
    )
    response.raise_for_status()

    data = response.json()
    trigger_job_id = data.get("id", "")
    logger.info("Dispatched Trigger.dev task %s with job_id=%s", task_id, trigger_job_id)
    return trigger_job_id

