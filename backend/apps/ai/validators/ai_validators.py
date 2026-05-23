"""
AI input validators — protect the AI pipeline from unsafe or malformed inputs.

Security goals (from spec):
    - sanitize prompts to reduce prompt-injection risk
    - validate structured outputs before they reach application logic
    - restrict unsafe execution paths
    - prevent excessively large payloads
"""

from django.core.exceptions import ValidationError


# ---------------------------------------------------------------------------
# Prompt validators
# ---------------------------------------------------------------------------

def validate_prompt_not_empty(prompt: str) -> None:
    """Raise ValidationError if *prompt* is blank or whitespace-only."""
    if not prompt or not prompt.strip():
        raise ValidationError("AI prompt cannot be empty.")


def validate_prompt_length(prompt: str, max_chars: int = 100_000) -> None:
    """
    Raise ValidationError if *prompt* exceeds *max_chars*.

    Default limit of 100 000 characters prevents runaway API costs and
    provider timeouts on single requests.
    """
    if len(prompt) > max_chars:
        raise ValidationError(
            f"Prompt exceeds the maximum allowed length of "
            f"{max_chars:,} characters (got {len(prompt):,})."
        )


def validate_prompt(prompt: str) -> None:
    """Convenience validator: runs both empty and length checks."""
    validate_prompt_not_empty(prompt)
    validate_prompt_length(prompt)


# ---------------------------------------------------------------------------
# Payload validator
# ---------------------------------------------------------------------------

def validate_job_payload(payload: object) -> None:
    """Raise ValidationError if *payload* is not a dict."""
    if not isinstance(payload, dict):
        raise ValidationError(
            f"AI job payload must be a JSON object (dict), "
            f"got {type(payload).__name__}."
        )


# ---------------------------------------------------------------------------
# Sanitisation
# ---------------------------------------------------------------------------

def sanitize_prompt(prompt: str) -> str:
    """
    Lightly sanitise user-supplied text before embedding it in a prompt.

    Removes null bytes (a common prompt-injection vector), strips leading/
    trailing whitespace, and collapses runs of internal whitespace so that
    the token count estimate stays accurate.
    """
    # Strip null bytes
    prompt = prompt.replace("\x00", "")
    # Normalise whitespace without collapsing intentional newlines
    lines = [" ".join(line.split()) for line in prompt.splitlines()]
    return "\n".join(lines).strip()
