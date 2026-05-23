from django.urls import path

from apps.engagement_optimization.views.internal_views import (
    InternalEvaluateOptRulesView,
    InternalGenerateSegmentsView,
    InternalProcessNonrespondentsView,
    InternalTriggerFollowupsView,
)
from apps.engagement_optimization.views.optimization_views import (
    OptimizationEventListView,
    OptimizationRuleListCreateView,
    OptimizationRunView,
)

urlpatterns = [
    # Public endpoints
    path("optimization/rules/", OptimizationRuleListCreateView.as_view(), name="optimization-rules"),
    path("optimization/events/", OptimizationEventListView.as_view(), name="optimization-events"),
    path("optimization/run/", OptimizationRunView.as_view(), name="optimization-run"),
    # Internal endpoints (Trigger.dev workers only)
    path(
        "internal/optimization/process-nonrespondents/",
        InternalProcessNonrespondentsView.as_view(),
        name="internal-opt-process-nonrespondents",
    ),
    path(
        "internal/optimization/evaluate-rules/",
        InternalEvaluateOptRulesView.as_view(),
        name="internal-opt-evaluate-rules",
    ),
    path(
        "internal/optimization/trigger-followups/",
        InternalTriggerFollowupsView.as_view(),
        name="internal-opt-trigger-followups",
    ),
    path(
        "internal/optimization/generate-segments/",
        InternalGenerateSegmentsView.as_view(),
        name="internal-opt-generate-segments",
    ),
]
