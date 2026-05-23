from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.surveys.views.survey_views import SurveyViewSet
from apps.surveys.views.question_views import QuestionViewSet
from apps.surveys.views.public_survey_view import PublicSurveyView

router = DefaultRouter()
router.register("surveys", SurveyViewSet, basename="survey")
router.register("questions", QuestionViewSet, basename="question")

question_list_create = QuestionViewSet.as_view({"get": "list", "post": "create"})

urlpatterns = router.urls + [
    path("surveys/<int:survey_pk>/questions/", question_list_create, name="survey-questions"),
    # Public endpoint — no auth required, published surveys only
    path("surveys/<int:pk>/public/", PublicSurveyView.as_view(), name="survey-public"),
]
