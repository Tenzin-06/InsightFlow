from rest_framework import serializers

from apps.reports.constants import (
    REPORT_SECTION_CHOICES,
    REPORT_TEMPLATES,
    REPORT_TEMPLATE_CHOICES,
)
from apps.reports.models import ReportExport


class ReportGenerateSerializer(serializers.Serializer):
    template = serializers.ChoiceField(choices=REPORT_TEMPLATE_CHOICES)
    survey_id = serializers.IntegerField(min_value=1)
    sections = serializers.ListField(
        child=serializers.ChoiceField(choices=[(value, value) for value in REPORT_SECTION_CHOICES]),
        allow_empty=False,
        required=False,
    )

    def validate(self, attrs):
        template = attrs["template"]
        if not attrs.get("sections"):
            attrs["sections"] = REPORT_TEMPLATES[template]["sections"]
        return attrs


class ReportExportSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = ReportExport
        fields = [
            "id",
            "survey_id",
            "template",
            "sections",
            "status",
            "progress",
            "download_url",
            "download_expires_at",
            "error_message",
            "created_at",
            "updated_at",
            "completed_at",
        ]
        read_only_fields = fields

    def get_download_url(self, obj):
        if obj.status != "completed":
            return None
        request = self.context.get("request")
        path = f"/api/v1/reports/{obj.id}/download/"
        return request.build_absolute_uri(path) if request else path


class ReportStatusSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = ReportExport
        fields = [
            "id",
            "status",
            "progress",
            "download_url",
            "download_expires_at",
            "error_message",
            "updated_at",
        ]

    def get_download_url(self, obj):
        if obj.status != "completed":
            return None
        request = self.context.get("request")
        path = f"/api/v1/reports/{obj.id}/download/"
        return request.build_absolute_uri(path) if request else path


class ReportTemplateSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
    sections = serializers.ListField(child=serializers.CharField())

