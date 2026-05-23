from django.urls import path

from apps.engagement.views import (
    CampaignEngagementAnalyticsView,
    EmailOpenTrackingView,
    EngagementEventCreateView,
    LinkClickTrackingView,
)

urlpatterns = [
    path("engagement/events/", EngagementEventCreateView.as_view(), name="engagement-event-create"),
    path(
        "engagement/campaigns/<int:pk>/",
        CampaignEngagementAnalyticsView.as_view(),
        name="campaign-engagement-analytics",
    ),
]

tracking_urlpatterns = [
    path("track/open/<uuid:tracking_id>.png", EmailOpenTrackingView.as_view(), name="track-open"),
    path("track/click/<uuid:tracking_id>/", LinkClickTrackingView.as_view(), name="track-click"),
]

