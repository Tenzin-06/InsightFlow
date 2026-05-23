from apps.automation.services.eligibility_service import get_eligible_reminder_recipients
from apps.campaigns.models.campaign import Campaign


def evaluate_followups(*, campaign_id: int, delay_days: int) -> dict:
    campaign = Campaign.objects.select_related("survey", "owner").get(pk=campaign_id)
    candidates = get_eligible_reminder_recipients(campaign=campaign, delay_days=delay_days)
    return {
        "success": True,
        "eligible_count": len(candidates),
        "recipients": [candidate.email for candidate in candidates],
    }

