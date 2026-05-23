"""
Campaign processing engine.

Orchestrates the full email delivery workflow for a campaign:

    Load Campaign
    → Fetch Audience Recipients
    → Validate Campaign Readiness
    → Render Email for Each Recipient
    → Send Email via Resend
    → Log Delivery Outcome
    → Update Campaign Status

Failures are isolated per recipient so one bad address
does not abort the entire campaign run.
"""

import logging
from django.db import transaction
from apps.campaigns.models.campaign import Campaign
from apps.campaigns.constants import (
    CAMPAIGN_STATUS_SENDING,
    CAMPAIGN_STATUS_SENT,
    CAMPAIGN_STATUS_FAILED,
)
from apps.email_campaigns.services.email_renderer import render_email
from apps.email_campaigns.services.resend_service import send_email, SendEmailRequest
from apps.email_campaigns.services.delivery_service import (
    create_pending_log,
    record_send_result,
    get_campaign_delivery_summary,
)
from apps.email_campaigns.services.tracking_service import record_send_event
from apps.email_campaigns.utils.recipient_utils import collect_recipients
from apps.email_campaigns.utils.personalization_utils import build_email_context
from apps.email_campaigns.utils.template_utils import get_survey_link, resolve_template_name
from apps.engagement.services.attribution_service import build_tracking_urls, create_tracking_token
from django.conf import settings

logger = logging.getLogger(__name__)


def _load_campaign(campaign_id: int) -> Campaign:
    """Load campaign with all required relations prefetched."""
    return (
        Campaign.objects.select_related("survey", "owner")
        .prefetch_related("audiences__recipients")
        .get(pk=campaign_id)
    )


def _mark_campaign_sending(campaign: Campaign) -> None:
    campaign.status = CAMPAIGN_STATUS_SENDING
    campaign.save(update_fields=["status", "updated_at"])


def _mark_campaign_complete(campaign: Campaign, sent: int, failed: int) -> None:
    campaign.status = CAMPAIGN_STATUS_SENT if failed == 0 or sent > 0 else CAMPAIGN_STATUS_FAILED
    campaign.save(update_fields=["status", "updated_at"])


def process_campaign(campaign_id: int) -> dict:
    """
    Execute the full email delivery pipeline for a campaign.

    Returns:
        dict with keys: success, sent, failed, total
    """
    logger.info("Processing campaign_id=%s", campaign_id)

    try:
        campaign = _load_campaign(campaign_id)
    except Campaign.DoesNotExist:
        logger.error("Campaign %s not found", campaign_id)
        return {"success": False, "sent": 0, "failed": 0, "total": 0, "message": "Campaign not found."}

    # Transition → sending
    with transaction.atomic():
        _mark_campaign_sending(campaign)

    template_name = resolve_template_name(campaign.template_name)
    survey = campaign.survey
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@insightflow.ai")
    survey_link = get_survey_link(survey)

    recipients = collect_recipients(campaign)
    if not recipients:
        campaign.status = CAMPAIGN_STATUS_FAILED
        campaign.save(update_fields=["status", "updated_at"])
        return {"success": False, "sent": 0, "failed": 0, "total": 0, "message": "No valid recipients found."}

    sent_count = 0
    failed_count = 0

    for recipient in recipients:
        tracking_token = create_tracking_token(campaign, recipient, survey_link)
        tracking_urls = build_tracking_urls(tracking_token)
        context = build_email_context(
            recipient_email=recipient.email,
            first_name=recipient.first_name,
            survey_link=tracking_urls["click_url"],
            campaign_name=campaign.title,
            extra={
                "tracking_pixel_url": tracking_urls["open_url"],
                "tracking_token": str(tracking_token.token),
            },
        )

        # Create delivery log entry (pending)
        log = create_pending_log(campaign, recipient.email, recipient.first_name)

        try:
            html_body, text_body = render_email(template_name, context)
        except RuntimeError as exc:
            log.status = "failed"
            log.error_message = str(exc)
            log.save(update_fields=["status", "error_message", "updated_at"])
            failed_count += 1
            logger.error("Render failed for %s: %s", recipient.email, exc)
            continue

        send_request = SendEmailRequest(
            to=recipient.email,
            subject=campaign.subject,
            html_body=html_body,
            text_body=text_body,
            from_email=from_email,
        )

        result = send_email(send_request)
        record_send_result(log, result)

        if result.success:
            sent_count += 1
            record_send_event(campaign.pk, recipient.email, result.provider_message_id)
        else:
            failed_count += 1
            logger.warning("Delivery failed for %s: %s", recipient.email, result.error_message)

    # Transition → sent or failed
    _mark_campaign_complete(campaign, sent_count, failed_count)

    summary = get_campaign_delivery_summary(campaign)
    logger.info(
        "Campaign %s complete — sent=%s failed=%s",
        campaign_id,
        sent_count,
        failed_count,
    )

    return {
        "success": True,
        "sent": sent_count,
        "failed": failed_count,
        "total": len(recipients),
    }


def process_test_send(campaign_id: int, test_email_address: str) -> dict:
    """
    Send a single test email to verify template rendering and delivery.

    The test email uses dummy placeholder values for personalization
    variables and does not alter campaign state.
    """
    logger.info("Test send — campaign_id=%s to=%s", campaign_id, test_email_address)

    try:
        campaign = _load_campaign(campaign_id)
    except Campaign.DoesNotExist:
        return {"success": False, "message": "Campaign not found."}

    template_name = resolve_template_name(campaign.template_name)
    survey_link = get_survey_link(campaign.survey)
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@insightflow.ai")

    context = build_email_context(
        recipient_email=test_email_address,
        first_name="Preview User",
        survey_link=survey_link,
        campaign_name=campaign.title,
    )

    try:
        html_body, text_body = render_email(template_name, context)
    except RuntimeError as exc:
        return {"success": False, "message": str(exc)}

    subject = f"[TEST] {campaign.subject}" if campaign.subject else "[TEST] Email Preview"

    send_request = SendEmailRequest(
        to=test_email_address,
        subject=subject,
        html_body=html_body,
        text_body=text_body,
        from_email=from_email,
    )

    result = send_email(send_request)
    if result.success:
        return {"success": True, "message": f"Test email sent to {test_email_address}."}
    return {"success": False, "message": result.error_message}
