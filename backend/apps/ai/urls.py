"""
AI app URL configuration.

Public routes (JWT-authenticated):
    GET  /api/v1/ai/health/      — provider health check
    POST /api/v1/ai/jobs/        — create / enqueue an AI job
    GET  /api/v1/ai/jobs/{id}/   — retrieve AI job status

Internal routes (Trigger.dev workers, internal secret auth):
    POST /api/v1/internal/ai/jobs/{id}/execute/ — execute a queued AI job
"""

from django.urls import path

from apps.ai.views.ai_views import (
    AIHealthView,
    AIJobDetailView,
    AIJobListCreateView,
    InternalAIJobExecuteView,
)

urlpatterns = [
    # Public
    path("ai/health/", AIHealthView.as_view(), name="ai-health"),
    path("ai/jobs/", AIJobListCreateView.as_view(), name="ai-job-list-create"),
    path("ai/jobs/<int:pk>/", AIJobDetailView.as_view(), name="ai-job-detail"),

    # Internal (Trigger.dev workers only)
    path(
        "internal/ai/jobs/<int:pk>/execute/",
        InternalAIJobExecuteView.as_view(),
        name="ai-job-internal-execute",
    ),
]
