from django.urls import path
from apps.analytics.views import (
    DashboardAnalyticsView,
    EngagementAnalyticsView,
    SurveyAnalyticsView,
    CampaignAnalyticsView,
)

urlpatterns = [
    # GET /api/v1/analytics/dashboard/
    path("dashboard/", DashboardAnalyticsView.as_view(), name="analytics-dashboard"),

    # GET /api/v1/analytics/surveys/<pk>/
    path("surveys/<int:pk>/", SurveyAnalyticsView.as_view(), name="analytics-survey"),

    # GET /api/v1/analytics/campaigns/<pk>/
    path("campaigns/<int:pk>/", CampaignAnalyticsView.as_view(), name="analytics-campaign"),

    # GET /api/v1/analytics/engagement/
    path("engagement/", EngagementAnalyticsView.as_view(), name="analytics-engagement"),
]
