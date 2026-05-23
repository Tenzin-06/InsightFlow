import re

_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def is_valid_email(email: str) -> bool:
    """Return True if the email string passes format validation."""
    return bool(_EMAIL_RE.match(email))


def normalize_contact(row: dict) -> tuple[dict | None, str | None]:
    """
    Normalize a single contact row dict.

    Returns (normalized_dict, error_message).
    On success error_message is None; on failure normalized_dict is None.
    """
    raw_email = (row.get("email") or "").strip().lower()

    if not raw_email:
        return None, "Email is required."

    if not is_valid_email(raw_email):
        return None, f"Invalid email format: {raw_email}"

    return {
        "email": raw_email,
        "first_name": (row.get("first_name") or "").strip(),
        "last_name": (row.get("last_name") or "").strip(),
    }, None
