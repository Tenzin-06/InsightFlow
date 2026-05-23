from django.urls import path

from apps.simulation.views import (
    InternalSimulationCleanupView,
    InternalSimulationExecuteView,
    SimulationHealthView,
    SimulationRunDetailView,
    SimulationRunListCreateView,
)

urlpatterns = [
    path("simulation/health/", SimulationHealthView.as_view(), name="simulation-health"),
    path("simulation/runs/", SimulationRunListCreateView.as_view(), name="simulation-run-list-create"),
    path("simulation/runs/<int:pk>/", SimulationRunDetailView.as_view(), name="simulation-run-detail"),
    path(
        "internal/simulation/runs/<int:pk>/execute/",
        InternalSimulationExecuteView.as_view(),
        name="internal-simulation-execute",
    ),
    path(
        "internal/simulation/runs/<int:pk>/cleanup/",
        InternalSimulationCleanupView.as_view(),
        name="internal-simulation-cleanup",
    ),
]
