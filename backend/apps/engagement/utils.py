import hashlib
from urllib.parse import urlparse

from django.conf import settings


def success_response(data=None, status=200):
    from rest_framework.response import Response

    return Response({"success": True, "data": data, "error": None}, status=status)


def error_response(message, code="ENGAGEMENT_ERROR", status=400):
    from rest_framework.response import Response

    return Response(
        {"success": False, "data": None, "error": {"code": code, "message": message}},
        status=status,
    )


def hash_ip_address(ip_address: str | None) -> str:
    if not ip_address:
        return ""
    return hashlib.sha256(ip_address.encode("utf-8")).hexdigest()


def get_client_ip(request) -> str:
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


def get_public_backend_url() -> str:
    return getattr(settings, "APP_BACKEND_URL", "http://localhost:8000").rstrip("/")


def is_safe_survey_redirect(destination_url: str) -> bool:
    frontend_url = getattr(settings, "APP_FRONTEND_URL", "http://localhost:5173")
    frontend = urlparse(frontend_url)
    destination = urlparse(destination_url)

    if destination.scheme not in {"http", "https"}:
        return False
    if destination.netloc != frontend.netloc:
        return False
    return destination.path.startswith("/s/")

