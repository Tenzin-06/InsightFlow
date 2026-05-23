"""
optimization_engine.py
~~~~~~~~~~~~~~~~~~~~~~~
Rule-based engagement optimization engine.

Workflow:
  Load Engagement Data → Evaluate Rules → Generate Actions → Trigger Automation

Responsibilities:
- evaluate automation rules
- determine optimization actions
- trigger follow-up workflows
- maintain execution state
"""

from apps.campaigns.models.campaign import Campaign
from apps.engagement_optimization.constants import TRIGGER_DROPOFF_DETECTED, TRIGGER_NON_RESPONSE
from apps.engagement_optimization.models import OptimizationRule
from apps.engagement_optimization.services.optimization_logger import (
    log_optimization_failure,
    log_rule_evaluated,
)
from apps.engagement_optimization.services.reminder_orchestrator import orchestrate_reminder
from apps.engagement_optimization.services.segmentation_service import generate_segments_for_campaign
from apps.engagement_optimization.services.targeting_service import get_nonrespondents
from apps.engagement import models as eng_models
from apps.engagement.models import ResponseSession


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _get_dropoff_emails(*, campaign) -> list[tuple[str, str]]:
    """Return (email, first_name) pairs for users who dropped off."""
    sessions = ResponseSession.objects.filter(
        campaign=campaign,
        dropped_off_at__isnull=False,
        completed_at__isnull=True,
    ).values_list("recipient_email", "metadata")

    results: list[tuple[str, str]] = []
    for email, metadata in sessions:
        if email:
            first_name = metadata.get("first_name", "") if isinstance(metadata, dict) else ""
            results.append((email.strip().lower(), first_name))
    return results


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def run_optimization_for_rule(*, rule: OptimizationRule, campaign: Campaign) -> dict:
    """
    Evaluate a single OptimizationRule against a campaign and orchestrate
    follow-up actions for all eligible recipients.

    Returns a summary dict with counts.
    """
    if not rule.is_active:
        return {"success": False, "reason": "rule_inactive", "processed": 0}

    try:
        if rule.trigger_type == TRIGGER_NON_RESPONSE:
            nonrespondents = get_nonrespondents(campaign=campaign)
            targets = [(nr.email, nr.first_name) for nr in nonrespondents]

        elif rule.trigger_type == TRIGGER_DROPOFF_DETECTED:
            targets = _get_dropoff_emails(campaign=campaign)

        else:
            return {"success": False, "reason": "unknown_trigger_type", "processed": 0}

        log_rule_evaluated(
            rule_name=rule.rule_name,
            campaign_id=campaign.pk,
            eligible_count=len(targets),
        )

        results: dict[str, int] = {"optimized": 0, "skipped": 0, "failed": 0}
        for email, first_name in targets:
            result = orchestrate_reminder(
                campaign=campaign,
                rule=rule,
                email=email,
                first_name=first_name,
            )
            bucket = result.get("status", "failed")
            results[bucket] = results.get(bucket, 0) + 1

        return {
            "success": True,
            "rule": rule.rule_name,
            "campaign_id": campaign.pk,
            "targets": len(targets),
            **results,
        }

    except Exception as exc:  # noqa: BLE001
        log_optimization_failure(campaign_id=campaign.pk, error=str(exc))
        return {"success": False, "reason": str(exc), "processed": 0}


def run_optimization_for_campaign(*, campaign_id: int) -> dict:
    """
    Run all active optimization rules for a given campaign.
    Generates segments, then evaluates each applicable rule.
    """
    try:
        campaign = Campaign.objects.select_related("survey", "owner").get(pk=campaign_id)
    except Campaign.DoesNotExist:
        return {"success": False, "reason": "campaign_not_found"}

    # 1. Refresh segmentation
    from apps.email_campaigns.models import DeliveryLog
    from apps.email_campaigns.constants import DELIVERY_STATUS_SENT

    sent_emails = list(
        DeliveryLog.objects.filter(campaign=campaign, status=DELIVERY_STATUS_SENT)
        .values_list("recipient_email", flat=True)
        .distinct()
    )
    segment_summary = generate_segments_for_campaign(campaign=campaign, emails=sent_emails)

    # 2. Evaluate active rules scoped to this campaign (or global rules for this owner)
    rules = OptimizationRule.objects.filter(
        is_active=True,
    ).filter(
        campaign=campaign
    )

    if not rules.exists():
        return {
            "success": True,
            "campaign_id": campaign_id,
            "segments": segment_summary,
            "rules_evaluated": 0,
            "message": "No active optimization rules found for this campaign.",
        }

    rule_results = []
    for rule in rules:
        result = run_optimization_for_rule(rule=rule, campaign=campaign)
        rule_results.append(result)

    return {
        "success": True,
        "campaign_id": campaign_id,
        "segments": segment_summary,
        "rules_evaluated": len(rule_results),
        "results": rule_results,
    }
