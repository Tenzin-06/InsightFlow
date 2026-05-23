from decimal import Decimal
from uuid import UUID, uuid4

from django.utils import timezone

from apps.engagement.models import ResponseSession
from apps.surveys.models.question import Question
from apps.surveys.models.survey import Survey


def normalize_session_id(session_id: str | None):
    if not session_id:
        return uuid4()
    try:
        return UUID(str(session_id))
    except (TypeError, ValueError):
        return uuid4()


def calculate_completion_percentage(answered_count: int, total_count: int) -> Decimal:
    if total_count <= 0:
        return Decimal("0.00")
    percentage = min(100, max(0, (answered_count / total_count) * 100))
    return Decimal(str(round(percentage, 2)))


def get_or_create_response_session(
    *,
    survey: Survey,
    session_id: str | None,
    campaign=None,
    recipient=None,
    recipient_email: str = "",
    metadata: dict | None = None,
) -> ResponseSession:
    normalized_session_id = normalize_session_id(session_id)
    total_questions = survey.questions.count()
    session, created = ResponseSession.objects.get_or_create(
        session_id=normalized_session_id,
        defaults={
            "survey": survey,
            "campaign": campaign,
            "recipient": recipient,
            "recipient_email": recipient_email,
            "total_questions_count": total_questions,
            "metadata": metadata or {},
        },
    )
    if not created:
        updates = []
        if campaign and not session.campaign_id:
            session.campaign = campaign
            updates.append("campaign")
        if recipient and not session.recipient_id:
            session.recipient = recipient
            updates.append("recipient")
        if recipient_email and not session.recipient_email:
            session.recipient_email = recipient_email
            updates.append("recipient_email")
        if session.total_questions_count != total_questions:
            session.total_questions_count = total_questions
            updates.append("total_questions_count")
        if updates:
            session.save(update_fields=[*updates, "last_activity_at"])
    return session


def update_session_progress(
    *,
    session: ResponseSession,
    question_id: int | None = None,
    answered_questions_count: int | None = None,
    total_questions_count: int | None = None,
    completed: bool = False,
) -> ResponseSession:
    question = None
    if question_id:
        question = Question.objects.filter(pk=question_id, survey=session.survey).first()

    if question:
        session.current_question = question
        session.last_question_seen = question

    if total_questions_count is not None:
        session.total_questions_count = total_questions_count
    if answered_questions_count is not None:
        session.answered_questions_count = answered_questions_count

    session.completion_percentage = calculate_completion_percentage(
        session.answered_questions_count,
        session.total_questions_count,
    )

    if completed:
        session.completed_at = timezone.now()
        session.completion_percentage = Decimal("100.00")

    session.save()
    return session

