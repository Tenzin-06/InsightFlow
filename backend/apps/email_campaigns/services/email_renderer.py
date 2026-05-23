"""
Email renderer.

Renders Django HTML templates into production-ready email bodies,
then generates a plain-text fallback for non-HTML clients.
"""

import logging
from django.template.loader import render_to_string
from django.template import TemplateDoesNotExist

logger = logging.getLogger(__name__)

# Template path prefix
TEMPLATE_DIR = "email_campaigns"


def render_html(template_name: str, context: dict) -> str:
    """
    Render an HTML email template with the given context.

    Args:
        template_name: Bare template name, e.g. "survey_invitation".
        context: Template variables dict.

    Returns:
        Rendered HTML string.

    Raises:
        RuntimeError if the template cannot be found or rendering fails.
    """
    path = f"{TEMPLATE_DIR}/{template_name}.html"
    try:
        return render_to_string(path, context)
    except TemplateDoesNotExist:
        logger.error("Email template not found: %s", path)
        raise RuntimeError(f"Email template '{template_name}' does not exist.")
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to render template %s: %s", path, exc)
        raise RuntimeError(f"Failed to render email template '{template_name}': {exc}") from exc


def render_plain_text(html: str) -> str:
    """
    Generate a plain-text version from rendered HTML.

    Uses html2text if available, otherwise falls back to basic
    tag stripping so non-HTML clients always receive readable text.
    """
    try:
        import html2text  # type: ignore[import-untyped]

        handler = html2text.HTML2Text()
        handler.ignore_links = False
        handler.ignore_images = True
        handler.body_width = 80
        return handler.handle(html)
    except ImportError:
        return _strip_tags(html)


def _strip_tags(html: str) -> str:
    """Minimal HTML tag stripper used as fallback when html2text is absent."""
    import re

    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s{2,}", "\n", text)
    return text.strip()


def render_email(template_name: str, context: dict) -> tuple[str, str]:
    """
    Render both HTML and plain-text versions of an email.

    Args:
        template_name: Bare template name (e.g. "survey_invitation").
        context: Template variables.

    Returns:
        Tuple of (html_body, text_body).
    """
    html_body = render_html(template_name, context)
    text_body = render_plain_text(html_body)
    return html_body, text_body
