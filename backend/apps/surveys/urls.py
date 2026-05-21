from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.surveys.views.survey_views import SurveyViewSet
from apps.surveys.views.question_views import QuestionViewSet

router = DefaultRouter()
router.register("surveys", SurveyViewSet, basename="survey")
router.register("questions", QuestionViewSet, basename="question")

question_create = QuestionViewSet.as_view({"post": "create"})

urlpatterns = router.urls + [
    path("surveys/<int:survey_pk>/questions/", question_create, name="survey-questions-create"),
]
