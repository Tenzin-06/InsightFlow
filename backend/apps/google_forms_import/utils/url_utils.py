import re
from urllib.parse import urlparse

from apps.google_forms_import.constants import (
    ALLOWED_SCHEMES,
    ALLOWED_NETLOCS,
    GOOGLE_FORMS_PATH_PREFIX,
)

_PRIVATE_IP_PATTERNS = [
    re.compile(r"^10\."),
    re.compile(r"^172\.(1[6-9]|2[0-9]|3[0-1])\."),
    re.compile(r"^192\.168\."),
    re.compile(r"^127\."),
    re.compile(r"^0\."),
    re.compile(r"^169\.254\."),
    re.compile(r"^::1$"),
    re.compile(r"^fc00:", re.IGNORECASE),
]


def is_valid_google_forms_url(url: str) -> bool:
    if not url or not isinstance(url, str):
        return False
    try:
        parsed = urlparse(url.strip())
    except Exception:
        return False
    if parsed.scheme not in ALLOWED_SCHEMES:
        return False
    if parsed.netloc not in ALLOWED_NETLOCS:
        return False
    if not parsed.path.startswith(GOOGLE_FORMS_PATH_PREFIX):
        return False
    for pattern in _PRIVATE_IP_PATTERNS:
        if pattern.match(parsed.netloc):
            return False
    return True


def normalize_url(url: str) -> str:
    return url.strip()
