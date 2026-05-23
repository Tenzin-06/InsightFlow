from rest_framework import serializers


# ─── Time-series / chart primitives ──────────────────────────────────────────

class TimeSeriesPointSerializer(serializers.Serializer):
    date = serializers.CharField()
    value = serializers.FloatField()


class FunnelStepSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.IntegerField()
    percentage = serializers.FloatField()


class CategoryPointSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.FloatField()
    fill = serializers.CharField(allow_null=True, required=False)


# ─── Survey analytics ─────────────────────────────────────────────────────────

class QuestionEngagementSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    question_text = serializers.CharField()
    answer_count = serializers.IntegerField()
    engagement_rate = serializers.FloatField()
    order = serializers.IntegerField()


class SurveyMetricsSerializer(serializers.Serializer):
    total_responses = serializers.FloatField()
    completion_rate = serializers.FloatField()
    drop_off_rate = serializers.FloatField()
    question_count = serializers.FloatField()


class SurveyChartsSerializer(serializers.Serializer):
    response_trend = TimeSeriesPointSerializer(many=True)
    question_engagement = QuestionEngagementSerializer(many=True)


class SurveyAnalyticsSerializer(serializers.Serializer):
    metrics = SurveyMetricsSerializer()
    charts = SurveyChartsSerializer()
    funnel = FunnelStepSerializer(many=True)


# ─── Campaign analytics ───────────────────────────────────────────────────────

class CampaignMetricsSerializer(serializers.Serializer):
    emails_sent = serializers.FloatField()
    emails_failed = serializers.FloatField()
    delivery_rate = serializers.FloatField()
    response_rate = serializers.FloatField()
    total_responses = serializers.FloatField()


class CampaignChartsSerializer(serializers.Serializer):
    delivery_trend = TimeSeriesPointSerializer(many=True)


class CampaignAnalyticsSerializer(serializers.Serializer):
    metrics = CampaignMetricsSerializer()
    charts = CampaignChartsSerializer()
    funnel = FunnelStepSerializer(many=True)


# ─── Engagement analytics ─────────────────────────────────────────────────────

class EngagementMetricsSerializer(serializers.Serializer):
    total_sent = serializers.FloatField()
    total_responses = serializers.FloatField()
    total_campaigns = serializers.FloatField()
    overall_response_rate = serializers.FloatField()


class DropOffItemSerializer(serializers.Serializer):
    survey_id = serializers.IntegerField()
    title = serializers.CharField()
    emails_sent = serializers.IntegerField()
    responses = serializers.IntegerField()
    response_rate = serializers.FloatField()
    drop_off_rate = serializers.FloatField()


class EngagementChartsSerializer(serializers.Serializer):
    funnel = FunnelStepSerializer(many=True)
    drop_off = DropOffItemSerializer(many=True)
    timeline = TimeSeriesPointSerializer(many=True)
    segments = CategoryPointSerializer(many=True)


class EngagementAnalyticsSerializer(serializers.Serializer):
    metrics = EngagementMetricsSerializer()
    charts = EngagementChartsSerializer()
    funnel = FunnelStepSerializer(many=True)


# ─── Dashboard analytics ──────────────────────────────────────────────────────

class TopSurveySerializer(serializers.Serializer):
    survey_id = serializers.IntegerField()
    title = serializers.CharField()
    response_count = serializers.IntegerField()


class DashboardMetricsSerializer(serializers.Serializer):
    total_surveys = serializers.FloatField()
    total_responses = serializers.FloatField()
    total_campaigns = serializers.FloatField()
    total_emails_sent = serializers.FloatField()
    overall_response_rate = serializers.FloatField()


class DashboardChartsSerializer(serializers.Serializer):
    response_trend = TimeSeriesPointSerializer(many=True)
    top_surveys = TopSurveySerializer(many=True)


class DashboardSegmentsSerializer(serializers.Serializer):
    top_surveys = TopSurveySerializer(many=True)


class DashboardAnalyticsSerializer(serializers.Serializer):
    metrics = DashboardMetricsSerializer()
    charts = DashboardChartsSerializer()
    segments = DashboardSegmentsSerializer()
