from datetime import timedelta

from django.utils import timezone

from apps.engagement.constants import DEFAULT_DROPOFF_INACTIVITY_MINUTES, EVENT_DROPOFF
from apps.engagement.models import DropoffEvent, ResponseSession
from apps.engagement.services.tracking_service import create_engagement_event


def detect_dropoffs(inactivity_minutes: int = DEFAULT_DROPOFF_INACTIVITY_MINUTES) -> list[DropoffEvent]:
    cutoff = timezone.now() - timedelta(minutes=inactivity_minutes)
    sessions = ResponseSession.objects.filter(
        completed_at__isnull=True,
        dropped_off_at__isnull=True,
        last_activity_at__lte=cutoff,
    ).select_related("survey", "campaign", "recipient", "last_question_seen")

    dropoffs = []
    for session in sessions:
        session.dropped_off_at = timezone.now()
        session.save(update_fields=["dropped_off_at", "last_activity_at"])
        event = create_engagement_event(
            event_type=EVENT_DROPOFF,
            survey=session.survey,
            campaign=session.campaign,
            recipient=session.recipient,
            recipient_email=session.recipient_email,
            response_session=session,
            session_id=session.session_id,
            metadata={
                "last_question_seen_id": session.last_question_seen_id,
                "completion_percentage": str(session.completion_percentage),
            },
            unique_key=f"{EVENT_DROPOFF}:{session.session_id}",
        )
        dropoff = DropoffEvent.objects.create(
            event=event,
            response_session=session,
            survey=session.survey,
            campaign=session.campaign,
            last_question_seen=session.last_question_seen,
            completion_percentage=session.completion_percentage,
            inactivity_minutes=inactivity_minutes,
        )
        dropoffs.append(dropoff)
    return dropoffs

