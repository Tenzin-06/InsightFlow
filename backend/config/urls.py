from django.contrib import admin
from django.urls import path, include
from apps.engagement.urls import tracking_urlpatterns

api_v1_urlpatterns = [
    path("", include("apps.core.urls")),
    path("", include("apps.authentication.urls")),
    path("", include("apps.surveys.urls")),
    path("", include("apps.responses.urls")),
    path("", include("apps.public_surveys.urls")),
    path("", include("apps.campaigns.urls")),
    path("", include("apps.sharing.urls")),
    path("", include("apps.email_campaigns.urls")),
    path("analytics/", include("apps.analytics.urls")),
    path("", include("apps.automation.urls")),
    path("", include("apps.engagement.urls")),
    path("", include("apps.engagement_optimization.urls")),
    path("", include("apps.ai.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(tracking_urlpatterns)),
    path("api/v1/", include(api_v1_urlpatterns)),
]
