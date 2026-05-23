from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from apps.sharing.serializers.survey_share_serializer import SurveyShareSerializer
from apps.sharing.services.sharing_validation_service import get_published_survey_by_slug
from apps.sharing.utils import success_response, error_response


class SurveyShareMetadataView(APIView):
    """
    GET /api/v1/sharing/surveys/:slug/

    Returns public share metadata for a published survey.
    Draft and archived surveys return 404.
    No authentication required.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, slug):
        survey = get_published_survey_by_slug(slug)
        serializer = SurveyShareSerializer(survey)
        return success_response(serializer.data)
