"""
Preview views.

GET /api/v1/campaigns/:pk/preview/

Returns rendered HTML + plain text of a campaign email using
placeholder personalization values. Does not send any email.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.authentication.permissions import IsAuthenticated
from apps.campaigns.models.campaign import Campaign
from apps.email_campaigns.services.email_renderer import render_email
from apps.email_campaigns.utils.template_utils import get_survey_link, resolve_template_name
from apps.email_campaigns.utils.personalization_utils import build_email_context
from apps.email_campaigns.utils import success_response, error_response

logger = logging.getLogger(__name__)


class CampaignPreviewView(APIView):
    """
    GET /api/v1/campaigns/:pk/preview/

    Returns the rendered HTML and plain-text body of a campaign email
    using placeholder values. Useful for QA and design verification.
    Only the campaign owner may preview.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        campaign = get_object_or_404(Campaign, pk=pk, owner=request.user)

        template_name = resolve_template_name(campaign.template_name)
        survey_link = get_survey_link(campaign.survey)
        context = build_email_context(
            recipient_email="preview@example.com",
            first_name="Preview User",
            survey_link=survey_link,
            campaign_name=campaign.title,
        )

        try:
            html_body, text_body = render_email(template_name, context)
        except RuntimeError as exc:
            return Response(
                error_response(str(exc), code="RENDER_ERROR"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            success_response(
                data={
                    "template": template_name,
                    "subject": campaign.subject,
                    "html": html_body,
                    "text": text_body,
                }
            )
        )
