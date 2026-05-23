import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.permissions import IsAuthenticated
from apps.google_forms_import.exceptions import (
    FormParsingError,
    FormRetrievalError,
    GoogleFormsImportError,
    InvalidGoogleFormsURLError,
    SurveyCreationError,
)
from apps.google_forms_import.serializers.import_serializer import GoogleFormsImportSerializer
from apps.google_forms_import.services.import_service import import_google_form

logger = logging.getLogger(__name__)


def _success(data, http_status=status.HTTP_200_OK):
    return Response({"success": True, "data": data, "error": None}, status=http_status)


def _error(message: str, http_status=status.HTTP_400_BAD_REQUEST):
    return Response(
        {"success": False, "data": None, "error": {"message": message}},
        status=http_status,
    )


class GoogleFormsImportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GoogleFormsImportSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))[0]
            return _error(str(first_error), status.HTTP_400_BAD_REQUEST)

        url = serializer.validated_data["url"]
        try:
            result = import_google_form(url, request.user)
        except InvalidGoogleFormsURLError as exc:
            return _error(str(exc), status.HTTP_400_BAD_REQUEST)
        except FormRetrievalError as exc:
            return _error(str(exc), status.HTTP_502_BAD_GATEWAY)
        except FormParsingError as exc:
            logger.warning("Form parsing failed url=%s: %s", url, exc)
            return _error(str(exc), status.HTTP_422_UNPROCESSABLE_ENTITY)
        except SurveyCreationError as exc:
            logger.error("Survey creation failed url=%s: %s", url, exc)
            return _error(
                "Failed to save the imported survey. Please try again.",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except GoogleFormsImportError as exc:
            logger.error("Unexpected import error url=%s: %s", url, exc)
            return _error(
                "Import failed due to an unexpected error.",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return _success(result, status.HTTP_201_CREATED)
