import logging

from django.db import IntegrityError

from apps.engagement.constants import (
    EVENT_EMAIL_OPEN,
    EVENT_LINK_CLICK,
    EVENT_QUESTION_ANSWERED,
    EVENT_SURVEY_COMPLETE,
    EVENT_SURVEY_START,
)
from apps.engagement.models import EmailOpen, EngagementEvent, LinkClick, TrackingToken
from apps.engagement.services.attribution_service import resolve_tracking_token
from apps.engagement.services.session_service import (
    get_or_create_response_session,
    update_session_progress,
)
from apps.engagement.utils import get_client_ip, hash_ip_address
from apps.surveys.models.survey import Survey

logger = logging.getLogger(__name__)


def _summarize_user_agent(user_agent: str) -> str:
    if not user_agent:
        return ""
    try:
        from user_agents import parse

        parsed = parse(user_agent)
        return f"{parsed.browser.family} / {parsed.os.family} / {parsed.device.family}"[:255]
    except Exception:
        return user_agent[:255]


def _request_metadata(request) -> dict:
    return {
        "method": request.method,
        "path": request.path,
        "client": _summarize_user_agent(request.META.get("HTTP_USER_AGENT", "")),
    }


def create_engagement_event(
    *,
    event_type: str,
    survey,
    campaign=None,
    recipient=None,
    recipient_email: str = "",
    response_session=None,
    tracking_token=None,
    session_id=None,
    metadata: dict | None = None,
    request=None,
    unique_key: str | None = None,
) -> EngagementEvent:
    user_agent = request.META.get("HTTP_USER_AGENT", "") if request else ""
    ip_hash = hash_ip_address(get_client_ip(request)) if request else ""
    try:
        return EngagementEvent.objects.create(
            event_type=event_type,
            campaign=campaign,
            survey=survey,
            recipient=recipient,
            recipient_email=recipient_email,
            response_session=response_session,
            tracking_token=tracking_token,
            session_id=session_id,
            unique_key=unique_key,
            metadata=metadata or {},
            user_agent=user_agent,
            ip_hash=ip_hash,
        )
    except IntegrityError:
        if unique_key:
            return EngagementEvent.objects.get(unique_key=unique_key)
        raise


def record_email_open(token_value, request=None) -> EngagementEvent | None:
    tracking_token = resolve_tracking_token(token_value)
    if not tracking_token:
        logger.warning("Invalid open tracking token: %s", token_value)
        return None

    unique_key = f"{EVENT_EMAIL_OPEN}:{tracking_token.token}"
    event = create_engagement_event(
        event_type=EVENT_EMAIL_OPEN,
        campaign=tracking_token.campaign,
        survey=tracking_token.survey,
        recipient=tracking_token.recipient,
        recipient_email=tracking_token.recipient_email,
        tracking_token=tracking_token,
        metadata=_request_metadata(request) if request else {},
        request=request,
        unique_key=unique_key,
    )
    EmailOpen.objects.get_or_create(
        event=event,
        defaults={
            "tracking_token": tracking_token,
            "user_agent_summary": _summarize_user_agent(request.META.get("HTTP_USER_AGENT", "")) if request else "",
        },
    )
    return event


def record_link_click(token_value, request=None) -> tuple[EngagementEvent | None, TrackingToken | None]:
    tracking_token = resolve_tracking_token(token_value)
    if not tracking_token:
        logger.warning("Invalid click tracking token: %s", token_value)
        return None, None

    event = create_engagement_event(
        event_type=EVENT_LINK_CLICK,
        campaign=tracking_token.campaign,
        survey=tracking_token.survey,
        recipient=tracking_token.recipient,
        recipient_email=tracking_token.recipient_email,
        tracking_token=tracking_token,
        metadata=_request_metadata(request) if request else {},
        request=request,
    )
    LinkClick.objects.create(
        event=event,
        tracking_token=tracking_token,
        destination_url=tracking_token.destination_url,
    )
    return event, tracking_token


def record_public_event(payload: dict, request=None) -> dict:
    survey = Survey.objects.prefetch_related("questions").get(pk=payload["survey_id"])
    tracking_token = None
    campaign = None
    recipient = None
    recipient_email = ""

    token_value = payload.get("tracking_token")
    if token_value:
        tracking_token = resolve_tracking_token(token_value)
        if tracking_token:
            campaign = tracking_token.campaign
            recipient = tracking_token.recipient
            recipient_email = tracking_token.recipient_email

    session = get_or_create_response_session(
        survey=survey,
        session_id=payload.get("session_id"),
        campaign=campaign,
        recipient=recipient,
        recipient_email=recipient_email,
        metadata=payload.get("metadata", {}),
    )
    update_session_progress(
        session=session,
        question_id=payload.get("question_id"),
        answered_questions_count=payload.get("answered_questions_count"),
        total_questions_count=payload.get("total_questions_count"),
        completed=payload["event_type"] == EVENT_SURVEY_COMPLETE,
    )

    unique_key = None
    if payload["event_type"] == EVENT_SURVEY_COMPLETE:
        unique_key = f"{EVENT_SURVEY_COMPLETE}:{session.session_id}"

    event = create_engagement_event(
        event_type=payload["event_type"],
        campaign=session.campaign,
        survey=survey,
        recipient=session.recipient,
        recipient_email=session.recipient_email,
        response_session=session,
        tracking_token=tracking_token,
        session_id=session.session_id,
        metadata=payload.get("metadata", {}),
        request=request,
        unique_key=unique_key,
    )
    return {"event_id": event.id, "session_id": str(session.session_id)}


def record_submission_completion(survey, session_id: str | None, request=None):
    if not session_id:
        return None
    return record_public_event(
        {
            "event_type": EVENT_SURVEY_COMPLETE,
            "survey_id": survey.pk,
            "session_id": session_id,
            "answered_questions_count": survey.questions.count(),
            "total_questions_count": survey.questions.count(),
            "metadata": {"source": "submission"},
        },
        request=request,
    )

