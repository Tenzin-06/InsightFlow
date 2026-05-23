from django.template.loader import render_to_string
from django.utils import timezone

from apps.reports.constants import REPORT_TEMPLATES
from apps.reports.services.ai_embedder import build_ai_payload
from apps.reports.services.analytics_embedder import build_analytics_payload
from apps.reports.services.chart_renderer import render_report_charts


def build_report_payload(report_export) -> dict:
    analytics = build_analytics_payload(report_export.survey_id)
    ai = build_ai_payload(report_export.survey_id, report_export.owner_id)
    assets = render_report_charts(report_export.id, analytics, ai)

    sections = _compose_sections(report_export.sections, analytics, ai)
    template = REPORT_TEMPLATES[report_export.template]

    payload = {
        "report": report_export,
        "template": template,
        "survey": report_export.survey,
        "generated_at": timezone.now(),
        "sections": sections,
        "analytics": analytics,
        "ai": ai,
        "assets": assets,
    }
    html = render_to_string(
        f"reports/{report_export.template}.html",
        payload,
    )
    payload["html"] = html
    return payload


def _compose_sections(section_keys: list[str], analytics: dict, ai: dict) -> list[dict]:
    composed = []
    for key in section_keys:
        composed.append(
            {
                "key": key,
                "title": _section_title(key),
                "analytics": analytics,
                "ai": ai,
                "enabled": True,
            }
        )
    return composed


def _section_title(key: str) -> str:
    return {
        "metrics": "Metrics Overview",
        "charts": "Charts and Visualizations",
        "engagement": "Engagement Analysis",
        "question_breakdown": "Question-Level Breakdown",
        "ai_insights": "AI Insights",
        "conclusions": "Conclusions",
    }.get(key, key.replace("_", " ").title())

