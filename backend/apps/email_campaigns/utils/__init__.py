from apps.email_campaigns.utils.template_utils import get_survey_link, resolve_template_name
from apps.email_campaigns.utils.personalization_utils import build_email_context
from apps.email_campaigns.utils.recipient_utils import collect_recipients


def success_response(data=None, **extra):
    payload = {"success": True, "data": data, "error": None}
    payload.update(extra)
    return payload


def error_response(message: str, code: str = "ERROR"):
    return {
        "success": False,
        "data": None,
        "error": {"code": code, "message": message},
    }


__all__ = [
    "get_survey_link",
    "resolve_template_name",
    "build_email_context",
    "collect_recipients",
    "success_response",
    "error_response",
]
