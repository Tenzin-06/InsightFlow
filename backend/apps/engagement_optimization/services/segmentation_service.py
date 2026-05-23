"""
segmentation_service.py
~~~~~~~~~~~~~~~~~~~~~~~~
Groups recipients by engagement behavior.

Initial Segments:
- completed           — Finished survey
- opened_not_clicked  — Opened email only
- clicked_not_started — Clicked link but didn't start survey
- started_not_completed — Survey abandoned
- inactive            — No engagement
"""

from apps.engagement_optimization.constants import (
    SEGMENT_CLICKED_NOT_STARTED,
    SEGMENT_COMPLETED,
    SEGMENT_INACTIVE,
    SEGMENT_OPENED_NOT_CLICKED,
    SEGMENT_STARTED_NOT_COMPLETED,
)
from apps.engagement_optimization.models import EngagementSegment, OptimizationEvent
from apps.engagement_optimization.constants import OPT_EVENT_SEGMENT_CHANGED
from apps.engagement_optimization.services import engagement_evaluator
from apps.engagement_optimization.services.optimization_logger import log_segment_updated


def _resolve_segment(*, campaign, email: str) -> str:
    """Deterministically assign the correct segment for one recipient."""
    if engagement_evaluator.has_completed_survey(campaign=campaign, email=email):
        return SEGMENT_COMPLETED
    if engagement_evaluator.has_started_survey(campaign=campaign, email=email):
        return SEGMENT_STARTED_NOT_COMPLETED
    if engagement_evaluator.has_clicked_link(campaign=campaign, email=email):
        return SEGMENT_CLICKED_NOT_STARTED
    if engagement_evaluator.has_opened_email(campaign=campaign, email=email):
        return SEGMENT_OPENED_NOT_CLICKED
    return SEGMENT_INACTIVE


def assign_segment(*, campaign, email: str) -> EngagementSegment:
    """
    Assign (or update) the engagement segment for one recipient.
    Logs a segment_changed OptimizationEvent if the segment transitions.
    """
    new_segment = _resolve_segment(campaign=campaign, email=email.strip().lower())

    obj, created = EngagementSegment.objects.get_or_create(
        campaign=campaign,
        recipient_email=email.strip().lower(),
        defaults={"segment_type": new_segment},
    )

    if not created and obj.segment_type != new_segment:
        old_segment = obj.segment_type
        obj.previous_segment = old_segment
        obj.segment_type = new_segment
        obj.save(update_fields=["segment_type", "previous_segment", "assigned_at"])

        log_segment_updated(
            campaign_id=campaign.pk,
            recipient_email=email,
            old_segment=old_segment,
            new_segment=new_segment,
        )
        OptimizationEvent.objects.create(
            campaign=campaign,
            recipient_email=email.strip().lower(),
            event_type=OPT_EVENT_SEGMENT_CHANGED,
            outcome=f"{old_segment} → {new_segment}",
        )

    return obj


def generate_segments_for_campaign(*, campaign, emails: list[str]) -> dict:
    """
    Batch-assign segments for a list of recipient emails.
    Returns a summary of segment counts.
    """
    summary: dict[str, int] = {}
    for email in emails:
        seg = assign_segment(campaign=campaign, email=email)
        summary[seg.segment_type] = summary.get(seg.segment_type, 0) + 1
    return summary
