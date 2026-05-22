from django.contrib import admin
from django.urls import path, include

api_v1_urlpatterns = [
    path("", include("apps.core.urls")),
    path("", include("apps.surveys.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_urlpatterns)),
]
