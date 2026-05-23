from django.db.models import Count

from apps.campaigns.models.campaign import Campaign
from apps.engagement.constants import (
    EVENT_EMAIL_OPEN,
    EVENT_LINK_CLICK,
    EVENT_SURVEY_COMPLETE,
    EVENT_SURVEY_START,
)
from apps.engagement.models import EngagementEvent, ResponseSession


def get_campaign_engagement_summary(campaign: Campaign) -> dict:
    counts = (
        EngagementEvent.objects.filter(campaign=campaign)
        .values("event_type")
        .annotate(total=Count("id"))
    )
    by_type = {item["event_type"]: item["total"] for item in counts}
    sessions = ResponseSession.objects.filter(campaign=campaign)

    return {
        "campaign_id": campaign.id,
        "survey_id": campaign.survey_id,
        "email_opens": by_type.get(EVENT_EMAIL_OPEN, 0),
        "link_clicks": by_type.get(EVENT_LINK_CLICK, 0),
        "survey_starts": by_type.get(EVENT_SURVEY_START, 0),
        "survey_completions": by_type.get(EVENT_SURVEY_COMPLETE, 0),
        "dropoffs": campaign.dropoff_events.count(),
        "active_sessions": sessions.filter(completed_at__isnull=True, dropped_off_at__isnull=True).count(),
        "completed_sessions": sessions.filter(completed_at__isnull=False).count(),
    }

