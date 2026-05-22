import jwt
from jwt import PyJWKClient
from django.http import JsonResponse
import environ

env = environ.Env()

EXEMPT_PATHS = ["/api/v1/health/", "/admin/"]

_jwks_client: PyJWKClient | None = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        jwks_url = env("CLERK_JWKS_URL")
        _jwks_client = PyJWKClient(jwks_url, cache_keys=True)
    return _jwks_client


class ClerkAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if any(request.path.startswith(p) for p in EXEMPT_PATHS):
            return self.get_response(request)

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return JsonResponse(
                {"success": False, "error": {"message": "Unauthorized"}}, status=401
            )

        token = auth_header.split(" ", 1)[1]
        try:
            signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                options={"verify_aud": False},
            )
        except jwt.ExpiredSignatureError:
            return JsonResponse(
                {"success": False, "error": {"message": "Token expired"}}, status=401
            )
        except Exception:
            return JsonResponse(
                {"success": False, "error": {"message": "Invalid token"}}, status=401
            )

        from apps.authentication.models import AppUser

        clerk_user_id = payload.get("sub", "")
        email = payload.get("email", "")

        user, _ = AppUser.objects.get_or_create(
            clerk_user_id=clerk_user_id,
            defaults={"email": email},
        )
        request.clerk_user = user
        request.user = user
        return self.get_response(request)
