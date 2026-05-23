from apps.analytics.services.survey_analytics import get_survey_analytics


def build_analytics_payload(survey_id: int) -> dict:
    analytics = get_survey_analytics(survey_id=survey_id)
    metrics = analytics.get("metrics", {})

    return {
        "metrics": metrics,
        "charts": analytics.get("charts", {}),
        "funnel": analytics.get("funnel", []),
        "question_breakdown": analytics.get("charts", {}).get("question_engagement", []),
    }

