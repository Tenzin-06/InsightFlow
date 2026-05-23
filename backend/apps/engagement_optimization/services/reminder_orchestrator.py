"""
reminder_orchestrator.py
~~~~~~~~~~~~~~~~~~~~~~~~~
Determines reminder timing and coordinates follow-up execution.

Responsibilities:
- determine reminder timing
- select reminder templates
- prevent excessive outreach
- coordinate follow-up execution
"""

from django.utils import timezone

from apps.engagement_optimization.constants import (
    EXECUTION_STATUS_EVALUATING,
    EXECUTION_STATUS_FAILED,
    EXECUTION_STATUS_OPTIMIZED,
    EXECUTION_STATUS_SKIPPED,
)
from apps.engagement_optimization.models import (
    FollowupExecution,
    OptimizationEvent,
    OptimizationRule,
)
from apps.engagement_optimization.constants import OPT_EVENT_AUTOMATION_SKIPPED, OPT_EVENT_REMINDER_SENT
from apps.engagement_optimization.services.engagement_evaluator import is_reminder_eligible
from apps.engagement_optimization.services.optimization_logger import (
    log_action_skipped,
    log_reminder_triggered,
)


def _get_or_create_execution(
    *, campaign, rule: OptimizationRule, email: str
) -> FollowupExecution:
    obj, _ = FollowupExecution.objects.get_or_create(
        campaign=campaign,
        optimization_rule=rule,
        recipient_email=email,
        defaults={"status": EXECUTION_STATUS_EVALUATING},
    )
    if obj.status not in (EXECUTION_STATUS_EVALUATING,):
        # Reset to evaluating for a fresh pass
        obj.status = EXECUTION_STATUS_EVALUATING
        obj.save(update_fields=["status", "updated_at"])
    return obj


def orchestrate_reminder(
    *,
    campaign,
    rule: OptimizationRule,
    email: str,
    first_name: str = "",
) -> dict:
    """
    Evaluate eligibility and record a reminder trigger for one recipient.

    Returns a dict with keys: status, reason.
    """
    execution = _get_or_create_execution(campaign=campaign, rule=rule, email=email)

    eligible, reason = is_reminder_eligible(
        campaign=campaign,
        email=email,
        reminder_limit=rule.reminder_limit,
    )

    if not eligible:
        execution.status = EXECUTION_STATUS_SKIPPED
        execution.save(update_fields=["status", "updated_at"])

        log_action_skipped(campaign_id=campaign.pk, recipient_email=email, reason=reason)
        OptimizationEvent.objects.create(
            campaign=campaign,
            optimization_rule=rule,
            recipient_email=email,
            event_type=OPT_EVENT_AUTOMATION_SKIPPED,
            outcome=reason,
        )
        return {"status": EXECUTION_STATUS_SKIPPED, "reason": reason}

    # Record the reminder event — actual email delivery is handled by the
    # existing reminder service (automation app).  The orchestrator's job is
    # eligibility gate-keeping and audit trail.
    try:
        OptimizationEvent.objects.create(
            campaign=campaign,
            optimization_rule=rule,
            recipient_email=email,
            event_type=OPT_EVENT_REMINDER_SENT,
            outcome="queued",
            metadata={"first_name": first_name, "rule": rule.rule_name},
        )

        execution.status = EXECUTION_STATUS_OPTIMIZED
        execution.executed_at = timezone.now()
        execution.save(update_fields=["status", "executed_at", "updated_at"])

        log_reminder_triggered(
            campaign_id=campaign.pk,
            recipient_email=email,
            rule_name=rule.rule_name,
        )
        return {"status": EXECUTION_STATUS_OPTIMIZED, "reason": "reminder_queued"}

    except Exception as exc:  # noqa: BLE001
        execution.status = EXECUTION_STATUS_FAILED
        execution.error_message = str(exc)
        execution.save(update_fields=["status", "error_message", "updated_at"])
        return {"status": EXECUTION_STATUS_FAILED, "reason": str(exc)}
