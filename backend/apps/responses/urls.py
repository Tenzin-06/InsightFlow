from django.urls import path
from apps.responses.views.submission_views import SurveySubmitView

urlpatterns = [
    path(
        "surveys/<int:survey_pk>/submit/",
        SurveySubmitView.as_view(),
        name="survey-submit",
    ),
]
