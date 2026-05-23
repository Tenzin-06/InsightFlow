import base64
import logging

from django.http import Http404, HttpResponse
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.engagement.serializers import EngagementEventCreateSerializer
from apps.engagement.services.tracking_service import (
    record_email_open,
    record_link_click,
    record_public_event,
)
from apps.engagement.utils import error_response, is_safe_survey_redirect, success_response

logger = logging.getLogger(__name__)

TRANSPARENT_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII="
)


class EmailOpenTrackingView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "engagement"

    def get(self, request, tracking_id):
        try:
            record_email_open(tracking_id, request=request)
        except Exception as exc:
            logger.warning("Open tracking failed for %s: %s", tracking_id, exc)
        return HttpResponse(TRANSPARENT_PNG, content_type="image/png")


class LinkClickTrackingView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "engagement"

    def get(self, request, tracking_id):
        try:
            _, tracking_token = record_link_click(tracking_id, request=request)
        except Exception as exc:
            logger.warning("Click tracking failed for %s: %s", tracking_id, exc)
            raise Http404("Tracking link not found.")

        if not tracking_token:
            raise Http404("Tracking link not found.")

        destination = tracking_token.destination_url
        if not is_safe_survey_redirect(destination):
            logger.warning("Blocked unsafe tracking redirect: %s", destination)
            return error_response(
                "Tracking destination is not allowed.",
                code="UNSAFE_REDIRECT",
                status=status.HTTP_400_BAD_REQUEST,
            )
        return redirect(destination)


class EngagementEventCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "engagement"

    def post(self, request):
        serializer = EngagementEventCreateSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))
            message = first_error[0] if isinstance(first_error, list) else str(first_error)
            return error_response(message, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = record_public_event(serializer.validated_data, request=request)
        except Exception as exc:
            logger.warning("Engagement event persistence failed: %s", exc)
            return error_response(
                "Unable to record engagement event.",
                code="EVENT_PERSISTENCE_FAILED",
                status=status.HTTP_400_BAD_REQUEST,
            )

        return success_response(data, status=status.HTTP_201_CREATED)
