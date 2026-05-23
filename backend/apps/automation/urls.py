from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.automation.views.automation_views import (
    AutomationScheduleViewSet,
    CampaignCancelAutomationView,
    CampaignScheduleView,
)
from apps.automation.views.internal_views import (
    InternalEvaluateFollowupsView,
    InternalExecuteScheduledCampaignView,
    InternalProcessRemindersView,
)

router = DefaultRouter()
router.register("automations", AutomationScheduleViewSet, basename="automation")

urlpatterns = [
    path("campaigns/<int:pk>/schedule/", CampaignScheduleView.as_view(), name="campaign-schedule"),
    path("campaigns/<int:pk>/cancel/", CampaignCancelAutomationView.as_view(), name="campaign-cancel-automation"),
    path("", include(router.urls)),
    path(
        "internal/automations/<int:schedule_id>/execute/",
        InternalExecuteScheduledCampaignView.as_view(),
        name="internal-automation-execute",
    ),
    path(
        "internal/automations/process-reminders/",
        InternalProcessRemindersView.as_view(),
        name="internal-automation-process-reminders",
    ),
    path(
        "internal/automations/evaluate-followups/",
        InternalEvaluateFollowupsView.as_view(),
        name="internal-automation-evaluate-followups",
    ),
]
