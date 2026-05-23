from django.db import transaction
from django.utils import timezone

from apps.automation.constants import (
    AUTOMATION_EVENT_CANCELLED,
    AUTOMATION_EVENT_COMPLETED,
    AUTOMATION_EVENT_FAILED,
    AUTOMATION_EVENT_SCHEDULED,
    AUTOMATION_EVENT_STARTED,
    AUTOMATION_STATUS_CANCELLED,
    AUTOMATION_STATUS_COMPLETED,
    AUTOMATION_STATUS_FAILED,
    AUTOMATION_STATUS_RUNNING,
    AUTOMATION_STATUS_SCHEDULED,
    TRIGGER_TASK_EXECUTE_SCHEDULED_CAMPAIGN,
    TRIGGER_TASK_PROCESS_REMINDERS,
)
from apps.automation.models import AutomationSchedule, ReminderRule
from apps.automation.services.automation_logger import log_automation_event
from apps.automation.services.trigger_dispatch_service import dispatch_trigger_task
from apps.campaigns.constants import CAMPAIGN_STATUS_SCHEDULED
from apps.campaigns.models.campaign import Campaign
from apps.email_campaigns.services.campaign_processor import process_campaign


class AutomationValidationError(ValueError):
    pass


def schedule_campaign(
    *,
    campaign: Campaign,
    scheduled_for,
    reminder_delays: list[int] | None = None,
    max_reminders: int = 1,
) -> AutomationSchedule:
    if scheduled_for <= timezone.now():
        raise AutomationValidationError("scheduled_for must be a future UTC datetime.")

    if AutomationSchedule.objects.filter(
        campaign=campaign,
        status__in=[AUTOMATION_STATUS_SCHEDULED, AUTOMATION_STATUS_RUNNING],
    ).exists():
        raise AutomationValidationError("Campaign already has an active automation schedule.")

    reminder_delays = reminder_delays or []

    with transaction.atomic():
        schedule = AutomationSchedule.objects.create(
            campaign=campaign,
            owner=campaign.owner,
            scheduled_for=scheduled_for,
        )

        campaign.status = CAMPAIGN_STATUS_SCHEDULED
        campaign.save(update_fields=["status", "updated_at"])

        for delay_days in sorted(set(reminder_delays)):
            ReminderRule.objects.update_or_create(
                campaign=campaign,
                delay_days=delay_days,
                recipient_email="",
                defaults={
                    "owner": campaign.owner,
                    "max_reminders": max_reminders,
                    "is_enabled": True,
                },
            )

        log_automation_event(
            campaign=campaign,
            schedule=schedule,
            event_type=AUTOMATION_EVENT_SCHEDULED,
            message="Campaign scheduled.",
            metadata={"scheduled_for": scheduled_for.isoformat(), "reminder_delays": reminder_delays},
        )

    trigger_job_id = dispatch_trigger_task(
        task_id=TRIGGER_TASK_EXECUTE_SCHEDULED_CAMPAIGN,
        payload={"scheduleId": schedule.pk},
        run_at=scheduled_for,
    )
    if trigger_job_id:
        schedule.trigger_job_id = trigger_job_id
        schedule.save(update_fields=["trigger_job_id", "updated_at"])

    return schedule


def cancel_schedule(schedule: AutomationSchedule) -> AutomationSchedule:
    if schedule.status in [AUTOMATION_STATUS_COMPLETED, AUTOMATION_STATUS_FAILED, AUTOMATION_STATUS_CANCELLED]:
        return schedule

    schedule.status = AUTOMATION_STATUS_CANCELLED
    schedule.cancelled_at = timezone.now()
    schedule.save(update_fields=["status", "cancelled_at", "updated_at"])

    ReminderRule.objects.filter(campaign=schedule.campaign).update(is_enabled=False)
    log_automation_event(
        campaign=schedule.campaign,
        schedule=schedule,
        event_type=AUTOMATION_EVENT_CANCELLED,
        message="Scheduled automation cancelled.",
    )
    return schedule


def execute_scheduled_campaign(schedule_id: int) -> dict:
    schedule = AutomationSchedule.objects.select_related("campaign", "campaign__owner").get(pk=schedule_id)

    if schedule.status == AUTOMATION_STATUS_CANCELLED:
        return {"success": False, "message": "Schedule was cancelled."}
    if schedule.status == AUTOMATION_STATUS_COMPLETED:
        return {"success": True, "message": "Schedule already completed.", "already_completed": True}
    if schedule.scheduled_for > timezone.now():
        return {"success": False, "message": "Schedule is not due yet."}

    with transaction.atomic():
        locked = AutomationSchedule.objects.select_for_update().get(pk=schedule_id)
        if locked.status not in [AUTOMATION_STATUS_SCHEDULED, AUTOMATION_STATUS_RUNNING]:
            return {"success": False, "message": f"Schedule is {locked.status}."}
        locked.status = AUTOMATION_STATUS_RUNNING
        locked.save(update_fields=["status", "updated_at"])

    log_automation_event(
        campaign=schedule.campaign,
        schedule=schedule,
        event_type=AUTOMATION_EVENT_STARTED,
        message="Scheduled campaign execution started.",
    )

    result = process_campaign(schedule.campaign_id)
    schedule.refresh_from_db()

    if result.get("success"):
        schedule.status = AUTOMATION_STATUS_COMPLETED
        schedule.executed_at = timezone.now()
        schedule.result = result
        schedule.error_message = ""
        schedule.save(update_fields=["status", "executed_at", "result", "error_message", "updated_at"])
        log_automation_event(
            campaign=schedule.campaign,
            schedule=schedule,
            event_type=AUTOMATION_EVENT_COMPLETED,
            message="Scheduled campaign execution completed.",
            metadata=result,
        )
        enqueue_reminder_tasks(schedule)
        return result

    schedule.status = AUTOMATION_STATUS_FAILED
    schedule.executed_at = timezone.now()
    schedule.result = result
    schedule.error_message = result.get("message", "Campaign execution failed.")
    schedule.save(update_fields=["status", "executed_at", "result", "error_message", "updated_at"])
    log_automation_event(
        campaign=schedule.campaign,
        schedule=schedule,
        event_type=AUTOMATION_EVENT_FAILED,
        message=schedule.error_message,
        metadata=result,
    )
    return result


def enqueue_reminder_tasks(schedule: AutomationSchedule) -> None:
    rules = ReminderRule.objects.filter(
        campaign=schedule.campaign,
        recipient_email="",
        is_enabled=True,
    )
    base_time = schedule.executed_at or timezone.now()

    for rule in rules:
        run_at = base_time + timezone.timedelta(days=rule.delay_days)
        dispatch_trigger_task(
            task_id=TRIGGER_TASK_PROCESS_REMINDERS,
            payload={"campaignId": schedule.campaign_id, "delayDays": rule.delay_days},
            run_at=run_at,
        )
