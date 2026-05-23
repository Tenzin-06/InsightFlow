from apps.google_forms_import.exceptions import InvalidGoogleFormsURLError
from apps.google_forms_import.utils.url_utils import is_valid_google_forms_url, normalize_url


def validate_google_forms_url(url: str) -> str:
    if not url:
        raise InvalidGoogleFormsURLError("URL is required.")
    normalized = normalize_url(url)
    if not is_valid_google_forms_url(normalized):
        raise InvalidGoogleFormsURLError(
            "Invalid Google Forms URL. Must be a publicly accessible URL from https://docs.google.com/forms/."
        )
    return normalized
