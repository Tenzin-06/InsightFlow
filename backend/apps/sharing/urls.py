from django.urls import path
from apps.sharing.views.sharing_views import SurveyShareMetadataView

urlpatterns = [
    path(
        "sharing/surveys/<slug:slug>/",
        SurveyShareMetadataView.as_view(),
        name="survey-share-metadata",
    ),
]
