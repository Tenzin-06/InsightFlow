from django.urls import path
from apps.email_campaigns.views.send_views import CampaignSendView, CampaignTestSendView
from apps.email_campaigns.views.preview_views import CampaignPreviewView
from apps.email_campaigns.views.campaign_views import CampaignDeliveryLogView
from apps.email_campaigns.views.internal_views import (
    InternalCampaignProcessView,
    InternalCampaignTestProcessView,
    InternalJobCleanupView,
)

urlpatterns = [
    # ------------------------------------------------------------------ #
    # Public campaign endpoints (user-facing, JWT-authenticated)          #
    # ------------------------------------------------------------------ #

    # POST /api/v1/campaigns/:pk/send/
    path("campaigns/<int:pk>/send/", CampaignSendView.as_view(), name="campaign-send"),

    # POST /api/v1/campaigns/:pk/test/
    path("campaigns/<int:pk>/test/", CampaignTestSendView.as_view(), name="campaign-test-send"),

    # GET /api/v1/campaigns/:pk/preview/
    path("campaigns/<int:pk>/preview/", CampaignPreviewView.as_view(), name="campaign-preview"),

    # GET /api/v1/campaigns/:pk/delivery-logs/
    path("campaigns/<int:pk>/delivery-logs/", CampaignDeliveryLogView.as_view(), name="campaign-delivery-logs"),

    # ------------------------------------------------------------------ #
    # Internal endpoints (Trigger.dev worker-facing, secret-protected)    #
    # ------------------------------------------------------------------ #

    # POST /api/v1/internal/campaigns/:pk/process/
    path(
        "internal/campaigns/<int:pk>/process/",
        InternalCampaignProcessView.as_view(),
        name="internal-campaign-process",
    ),

    # POST /api/v1/internal/campaigns/:pk/test-process/
    path(
        "internal/campaigns/<int:pk>/test-process/",
        InternalCampaignTestProcessView.as_view(),
        name="internal-campaign-test-process",
    ),

    # POST /api/v1/internal/jobs/cleanup/
    path(
        "internal/jobs/cleanup/",
        InternalJobCleanupView.as_view(),
        name="internal-jobs-cleanup",
    ),
]
