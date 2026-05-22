from rest_framework.response import Response
from rest_framework import status as http_status


def success_response(data, status=http_status.HTTP_200_OK):
    return Response({"success": True, "data": data, "error": None}, status=status)


def error_response(message, code=None, status=http_status.HTTP_400_BAD_REQUEST):
    return Response(
        {"success": False, "data": None, "error": {"message": message, "code": code}},
        status=status,
    )
