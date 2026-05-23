"""
targeting_service.py
~~~~~~~~~~~~~~~~~~~~
Identifies non-respondents for a campaign.

Responsibilities:
- identify non-respondents
- filter incomplete sessions
- exclude completed users
- support segmentation
"""

from dataclasses import dataclass

from django.db.models import Q

from apps.email_campaigns.constants import DELIVERY_STATUS_SENT
from apps.email_campaigns.models import DeliveryLog
from apps.responses.models import Response


@dataclass(frozen=True)
class NonRespondent:
    email: str
    first_name: str


def _has_completed_survey(*, campaign, email: str) -> bool:
    normalized = email.strip().lower()
    return Response.objects.filter(survey=campaign.survey).filter(
        Q(metadata__recipient_email__iexact=normalized)
        | Q(metadata__email__iexact=normalized)
        | Q(metadata__respondent_email__iexact=normalized)
    ).exists()


def get_nonrespondents(*, campaign) -> list[NonRespondent]:
    """
    Return all recipients who received the campaign email but have not
    completed the survey.

    Criteria:
    - Received original campaign (status = sent in DeliveryLog)
    - Did not complete survey (no matching Response)
    """
    sent_logs = (
        DeliveryLog.objects.filter(campaign=campaign, status=DELIVERY_STATUS_SENT)
        .order_by("recipient_email", "-sent_at")
        .distinct("recipient_email")
    )

    nonrespondents: list[NonRespondent] = []
    for log in sent_logs:
        email = log.recipient_email.strip().lower()
        if not email:
            continue
        if _has_completed_survey(campaign=campaign, email=email):
            continue
        nonrespondents.append(
            NonRespondent(email=email, first_name=log.recipient_first_name)
        )

    return nonrespondents
