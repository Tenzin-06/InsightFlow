"""
DRF serializers for AI analytics API responses.

These serializers transform AI analytics model instances into
frontend-ready JSON payloads.
"""

from rest_framework import serializers


class AISummarySerializer(serializers.Serializer):
    """Read-only serializer for AISummary payloads."""
    available = serializers.BooleanField(default=False)
    summary = serializers.CharField(allow_blank=True, default="")
    themes = serializers.ListField(child=serializers.CharField(), default=list)
    response_count = serializers.IntegerField(default=0)
    generated_at = serializers.DateTimeField(allow_null=True, default=None)
    status = serializers.CharField(default="completed")


class SentimentDistributionSerializer(serializers.Serializer):
    positive = serializers.FloatField(default=0.0)
    neutral = serializers.FloatField(default=0.0)
    negative = serializers.FloatField(default=0.0)


class AISentimentSerializer(serializers.Serializer):
    """Read-only serializer for AISentiment payloads."""
    available = serializers.BooleanField(default=False)
    dominant_sentiment = serializers.CharField(allow_null=True, default=None)
    sentiment_distribution = serializers.DictField(default=dict)
    overall_confidence = serializers.FloatField(default=0.0)
    reasoning = serializers.CharField(allow_blank=True, default="")
    response_count = serializers.IntegerField(default=0)
    generated_at = serializers.DateTimeField(allow_null=True, default=None)


class AIQualityScoreSerializer(serializers.Serializer):
    """Read-only serializer for AIQualityScore payloads."""
    available = serializers.BooleanField(default=False)
    average_score = serializers.FloatField(default=0.0)
    high_quality_count = serializers.IntegerField(default=0)
    medium_quality_count = serializers.IntegerField(default=0)
    low_quality_count = serializers.IntegerField(default=0)
    suspicious_count = serializers.IntegerField(default=0)
    response_count = serializers.IntegerField(default=0)
    generated_at = serializers.DateTimeField(allow_null=True, default=None)


class AnswerDiversitySerializer(serializers.Serializer):
    description = serializers.CharField(allow_blank=True, default="")
    diversity_level = serializers.CharField(default="medium")


class AIQuestionInsightSerializer(serializers.Serializer):
    """Read-only serializer for AIQuestionInsight payloads."""
    question_id = serializers.IntegerField()
    question_text = serializers.CharField()
    themes = serializers.ListField(child=serializers.CharField(), default=list)
    sentiment_summary = serializers.CharField(allow_blank=True, default="")
    friction_indicators = serializers.ListField(child=serializers.CharField(), default=list)
    answer_diversity = serializers.DictField(default=dict)
    answer_count = serializers.IntegerField(default=0)
    generated_at = serializers.DateTimeField(allow_null=True, default=None)


class CombinedInsightsSerializer(serializers.Serializer):
    """Read-only serializer for the fused analytics + AI insights dict."""
    total_responses = serializers.IntegerField(default=0)
    completion_rate = serializers.FloatField(default=0.0)
    key_findings = serializers.ListField(child=serializers.CharField(), default=list)
    data_quality = serializers.CharField(default="unknown")
    sentiment_confidence = serializers.CharField(default="unknown")
    ai_summary_available = serializers.BooleanField(default=False)
    ai_sentiment_available = serializers.BooleanField(default=False)
    ai_quality_available = serializers.BooleanField(default=False)


class AIDashboardSerializer(serializers.Serializer):
    """Top-level serializer for the full AI dashboard payload."""
    ai_summary = AISummarySerializer()
    sentiment = AISentimentSerializer()
    quality = AIQualityScoreSerializer()
    question_insights = AIQuestionInsightSerializer(many=True)
    combined_insights = CombinedInsightsSerializer()
