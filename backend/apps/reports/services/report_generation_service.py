"""
Report Generation Service.

Produces a complete, Gemini-generated frontend-ready JSON payload for
the report preview endpoint.  The service:

  1. Fetches real analytics (metrics, response trend, question engagement)
     using the existing analytics_embedder / analytics services.
  2. Fetches existing AI analytics (summary, sentiment, quality, question
     insights) using the existing ai_embedder.
  3. Calls GeminiService.generate_structured_output() to produce a
     professional narrative grounded in the actual survey data:
       - executive_summary   — 3-4 sentence overview
       - key_findings        — 4 data-driven bullet strings
       - conclusions         — 2-3 sentence wrap-up
  4. Assembles and returns a single frontend-ready dict.

Consumers: ReportPreviewDataView (apps.reports.views.report_views)
"""

from __future__ import annotations

import json
import logging

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def generate_report_preview(
    survey_id: int,
    owner_id: int,
    include_ai: bool = True,
) -> dict:
    """
    Build a complete, dynamic report payload for the frontend preview.

    Returns
    -------
    {
        "survey_title":      str,
        "generated_at":      str (ISO-8601),
        "metrics":           { total_responses, completion_rate, drop_off_rate, question_count },
        "chart_data":        { response_trend, sentiment_distribution, question_engagement },
        "executive_summary": str,
        "key_findings":      [str, ...],
        "ai_insights":       [{ id, type, title, body, score|None }, ...],
        "sentiment":         { dominant, distribution, confidence, reasoning },
        "question_breakdown":[{ question_text, engagement_rate, answer_count }, ...],
        "conclusions":       str,
        "data_quality":      "high" | "medium" | "low" | "unknown",
        "ai_generated":      bool,
    }
    """
    from django.utils import timezone
    from apps.reports.services.analytics_embedder import build_analytics_payload
    from apps.reports.services.ai_embedder import build_ai_payload
    from apps.surveys.models.survey import Survey

    # ── Survey title ────────────────────────────────────────────────────────
    try:
        survey = Survey.objects.get(id=survey_id, owner_id=owner_id)
        survey_title = survey.title
    except Survey.DoesNotExist:
        survey_title = "Survey Report"

    # ── Raw data ─────────────────────────────────────────────────────────────
    analytics = build_analytics_payload(survey_id)
    ai_data = build_ai_payload(survey_id, owner_id) if include_ai else {}

    # ── Gemini narrative ─────────────────────────────────────────────────────
    narrative: dict = {}
    if include_ai:
        narrative = _generate_narrative(survey_title, analytics, ai_data)

    # ── Metrics ──────────────────────────────────────────────────────────────
    raw_metrics = analytics.get("metrics", {})
    metrics = {
        "total_responses": int(raw_metrics.get("total_responses", 0)),
        "completion_rate": f"{float(raw_metrics.get('completion_rate', 0)):.0f}%",
        "drop_off_rate":   f"{float(raw_metrics.get('drop_off_rate', 0)):.0f}%",
        "question_count":  int(raw_metrics.get("question_count", 0)),
    }

    # ── Chart data ────────────────────────────────────────────────────────────
    response_trend = analytics.get("charts", {}).get("response_trend", [])
    question_engagement = analytics.get("question_breakdown", [])

    sentiment_raw = ai_data.get("sentiment", {})
    dist = sentiment_raw.get("distribution", {})
    sentiment_chart = [
        {"name": "Positive", "value": round(dist.get("positive", 0) * 100)},
        {"name": "Neutral",  "value": round(dist.get("neutral",  0) * 100)},
        {"name": "Negative", "value": round(dist.get("negative", 0) * 100)},
    ]

    # ── Question breakdown ───────────────────────────────────────────────────
    question_breakdown = [
        {
            "question_text":   q.get("question_text", ""),
            "engagement_rate": round(float(q.get("engagement_rate", 0))),
            "answer_count":    int(q.get("answer_count", 0)),
        }
        for q in question_engagement
    ]

    # ── AI insights array ────────────────────────────────────────────────────
    ai_insights = _build_ai_insights(ai_data, narrative)

    return {
        "survey_title":      survey_title,
        "generated_at":      timezone.now().isoformat(),
        "metrics":           metrics,
        "chart_data": {
            "response_trend":        response_trend,
            "sentiment_distribution": sentiment_chart,
            "question_engagement":   question_engagement,
        },
        "executive_summary": narrative.get(
            "executive_summary",
            _fallback_executive_summary(metrics),
        ),
        "key_findings": narrative.get(
            "key_findings",
            _build_key_findings_fallback(metrics, ai_data),
        ),
        "ai_insights":       ai_insights,
        "sentiment": {
            "dominant":     sentiment_raw.get("dominant", ""),
            "distribution": dist,
            "confidence":   sentiment_raw.get("confidence", 0),
            "reasoning":    sentiment_raw.get("reasoning", ""),
        },
        "question_breakdown": question_breakdown,
        "conclusions": narrative.get(
            "conclusions",
            _fallback_conclusions(metrics),
        ),
        "data_quality":  _derive_data_quality(ai_data),
        "ai_generated":  bool(narrative),
    }


# ---------------------------------------------------------------------------
# Gemini narrative generation
# ---------------------------------------------------------------------------

def _generate_narrative(
    survey_title: str,
    analytics: dict,
    ai_data: dict,
) -> dict:
    """
    Call GeminiService to produce executive_summary, key_findings, conclusions.
    Returns empty dict on any failure so callers always get fallback text.
    """
    try:
        from apps.ai.services.gemini_service import GeminiService

        metrics    = analytics.get("metrics", {})
        summary    = ai_data.get("summary", {})
        sentiment  = ai_data.get("sentiment", {})
        quality    = ai_data.get("quality", {})
        q_insights = ai_data.get("question_insights", [])

        dist = sentiment.get("distribution", {})
        prompt = f"""You are an expert survey data analyst writing a professional analytics report.

Survey title: {survey_title}

QUANTITATIVE DATA:
- Total responses collected: {int(metrics.get('total_responses', 0))}
- Completion rate: {float(metrics.get('completion_rate', 0)):.1f}%
- Drop-off rate:   {float(metrics.get('drop_off_rate', 0)):.1f}%
- Number of survey questions: {int(metrics.get('question_count', 0))}

AI SUMMARY (from prior analysis):
{summary.get('text') or 'Not yet generated.'}

IDENTIFIED THEMES:
{', '.join(summary.get('themes', [])) or 'None identified yet.'}

SENTIMENT ANALYSIS:
- Dominant sentiment: {sentiment.get('dominant') or 'Unknown'}
- Positive: {round(dist.get('positive', 0) * 100)}%
- Neutral:  {round(dist.get('neutral',  0) * 100)}%
- Negative: {round(dist.get('negative', 0) * 100)}%
- Confidence: {float(sentiment.get('confidence', 0)):.2f}

DATA QUALITY:
- Average quality score: {float(quality.get('average_score', 0)):.0f}/100
- High-quality responses: {quality.get('high_quality_count', 0)}
- Suspicious responses:   {quality.get('suspicious_count', 0)}

PER-QUESTION INSIGHTS (first 5):
{_format_question_insights(q_insights[:5])}

Generate a professional report narrative. Respond ONLY with valid JSON — no markdown fences, no explanation:
{{
  "executive_summary": "<3-4 sentence professional overview referencing actual numbers>",
  "key_findings": [
    "<Finding 1 — specific, data-driven>",
    "<Finding 2 — specific, data-driven>",
    "<Finding 3 — specific, data-driven>",
    "<Finding 4 — specific, data-driven>"
  ],
  "conclusions": "<2-3 sentence synthesis and recommended next steps based on the data>"
}}

Rules:
- Reference real numbers from the data above.
- If total responses = 0, acknowledge that and advise distributing the survey.
- Use professional, concise language suitable for a stakeholder report.
- Keep each key finding to one sentence.
"""

        gemini  = GeminiService()
        result  = gemini.generate_structured_output(prompt)
        raw     = result.get("text", "").strip()

        # Strip accidental markdown fences
        if raw.startswith("```"):
            parts = raw.split("```")
            raw = parts[1] if len(parts) > 1 else raw
            if raw.lower().startswith("json"):
                raw = raw[4:]

        parsed = json.loads(raw.strip())

        # Validate shape — must have the expected keys
        if not all(k in parsed for k in ("executive_summary", "key_findings", "conclusions")):
            raise ValueError("Gemini response missing required keys")

        logger.info(
            "report_generation: narrative generated for survey=%s (ai_generated=True)",
            "unknown",
        )
        return parsed

    except Exception as exc:
        logger.warning(
            "report_generation: Gemini narrative failed — using fallback text. Error: %s", exc
        )
        return {}


# ---------------------------------------------------------------------------
# Helper builders
# ---------------------------------------------------------------------------

def _format_question_insights(insights: list) -> str:
    if not insights:
        return "  (no question insights available)"
    lines = []
    for i, ins in enumerate(insights, 1):
        q_text  = (ins.get("question_text") or "")[:80]
        themes  = ", ".join((ins.get("themes") or [])[:3]) or "none"
        sent    = (ins.get("sentiment_summary") or "n/a")[:60]
        lines.append(f"  Q{i}: {q_text} | themes: {themes} | sentiment: {sent}")
    return "\n".join(lines)


def _build_ai_insights(ai_data: dict, narrative: dict) -> list:
    """
    Assemble the ai_insights list consumed by ReportInsightBlock.
    Each item: { id, type, title, body, score }
    """
    insights = []

    # 1. Overall summary
    summary = ai_data.get("summary", {})
    if summary.get("available") and summary.get("text"):
        insights.append({
            "id":    "ai-summary",
            "type":  "summary",
            "title": "Overall Survey Summary",
            "body":  summary["text"][:600],
            "score": None,
        })

    # 2. Sentiment
    sentiment = ai_data.get("sentiment", {})
    if sentiment.get("available") and sentiment.get("reasoning"):
        dist    = sentiment.get("distribution", {})
        pos_pct = round(dist.get("positive", 0) * 100)
        insights.append({
            "id":    "ai-sentiment",
            "type":  "sentiment",
            "title": "Respondent Sentiment Analysis",
            "body":  sentiment["reasoning"][:600],
            "score": pos_pct if pos_pct > 0 else None,
        })

    # 3. Data quality
    quality = ai_data.get("quality", {})
    if quality.get("available"):
        avg_score  = float(quality.get("average_score", 0))
        suspicious = int(quality.get("suspicious_count", 0))
        body = f"Average response quality score: {avg_score:.0f}/100. "
        if suspicious > 0:
            body += (
                f"{suspicious} suspicious response(s) detected — "
                "results may require manual review. "
            )
        body += f"High-quality responses: {quality.get('high_quality_count', 0)}."
        insights.append({
            "id":    "ai-quality",
            "type":  "quality",
            "title": "Data Quality Assessment",
            "body":  body,
            "score": int(avg_score) if avg_score else None,
        })

    # 4. Recommendations (from Gemini key findings)
    key_findings = narrative.get("key_findings", [])
    if key_findings:
        insights.append({
            "id":    "ai-recommendation",
            "type":  "recommendation",
            "title": "Key Recommendations",
            "body":  " ".join(key_findings[:3]),
            "score": None,
        })

    return insights


def _build_key_findings_fallback(metrics: dict, ai_data: dict) -> list[str]:
    """Generate key findings from raw data when Gemini is unavailable."""
    findings: list[str] = []
    total = int(metrics.get("total_responses", 0))
    if total > 0:
        findings.append(f"{total} total responses were collected.")
    completion = float(metrics.get("completion_rate", 0))
    if completion > 0:
        findings.append(f"Completion rate: {completion:.0f}%.")
    sentiment = ai_data.get("sentiment", {})
    if sentiment.get("dominant"):
        findings.append(f"Dominant respondent sentiment: {sentiment['dominant']}.")
    themes = (ai_data.get("summary") or {}).get("themes", [])
    if themes:
        findings.append(f"Top themes: {', '.join(themes[:3])}.")
    return findings or ["No response data yet — distribute the survey to collect insights."]


def _fallback_executive_summary(metrics: dict) -> str:
    total = int(metrics.get("total_responses", 0))
    if total == 0:
        return (
            "This report is based on survey data collected through the InsightFlow platform. "
            "No responses have been collected yet — distribute the survey to begin gathering insights."
        )
    return (
        f"This report summarises analytics for a survey that collected {total} responses. "
        f"The completion rate stands at {metrics.get('completion_rate', '0%')}. "
        "AI-powered insights and data visualisations are presented below to provide a "
        "comprehensive view of survey performance and respondent engagement."
    )


def _fallback_conclusions(metrics: dict) -> str:
    total = int(metrics.get("total_responses", 0))
    if total == 0:
        return (
            "No responses have been collected yet. "
            "Distribute the survey to gather data and produce a complete report."
        )
    return (
        "The survey data collected during this period provides valuable insights into "
        "respondent behaviour and sentiment. "
        "Key findings from the AI analysis should be reviewed with stakeholders for "
        "actionable next steps and follow-up planning."
    )


def _derive_data_quality(ai_data: dict) -> str:
    quality = ai_data.get("quality", {})
    if not quality.get("available"):
        return "unknown"
    avg         = float(quality.get("average_score", 0))
    suspicious  = int(quality.get("suspicious_count", 0))
    total       = max(int(quality.get("response_count", 0)), 1)
    if suspicious / total > 0.3:
        return "low"
    if avg >= 80:
        return "high"
    if avg >= 50:
        return "medium"
    return "low"
