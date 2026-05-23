def build_ai_payload(survey_id: int, owner_id: int) -> dict:
    from apps.ai_analytics.models import (
        AISentiment,
        AISummary,
        AIQualityScore,
        AIQuestionInsight,
    )

    summary = AISummary.objects.filter(survey_id=survey_id, owner_id=owner_id).first()
    sentiment = AISentiment.objects.filter(survey_id=survey_id, owner_id=owner_id).first()
    quality = AIQualityScore.objects.filter(survey_id=survey_id, owner_id=owner_id).first()
    question_insights = AIQuestionInsight.objects.filter(
        survey_id=survey_id,
        owner_id=owner_id,
    ).select_related("question")[:20]

    return {
        "label": "AI-Generated Insight",
        "summary": {
            "text": summary.summary if summary else "",
            "themes": summary.themes if summary else [],
            "response_count": summary.response_count if summary else 0,
            "available": bool(summary),
        },
        "sentiment": {
            "distribution": sentiment.sentiment_distribution if sentiment else {},
            "dominant": sentiment.dominant_sentiment if sentiment else "",
            "confidence": sentiment.overall_confidence if sentiment else 0,
            "reasoning": sentiment.reasoning if sentiment else "",
            "available": bool(sentiment),
        },
        "quality": {
            "average_score": quality.average_score if quality else 0,
            "high_quality_count": quality.high_quality_count if quality else 0,
            "medium_quality_count": quality.medium_quality_count if quality else 0,
            "low_quality_count": quality.low_quality_count if quality else 0,
            "suspicious_count": quality.suspicious_count if quality else 0,
            "available": bool(quality),
        },
        "question_insights": [
            {
                "question_text": insight.question_text,
                "themes": insight.themes,
                "sentiment_summary": insight.sentiment_summary,
                "friction_indicators": insight.friction_indicators,
                "answer_count": insight.answer_count,
            }
            for insight in question_insights
        ],
    }

