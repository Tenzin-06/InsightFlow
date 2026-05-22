"""
Public survey validators.

Currently re-exports submission validation from apps.responses for extensibility.

Future validators added here:
- rate-limit checks (django-ratelimit)
- CAPTCHA verification
- spam / abuse detection
- invitation-token validation
"""
from apps.responses.services.validation_service import validate_submission

__all__ = ["validate_submission"]
