from django.db import models
from apps.surveys.models.survey import Survey
from apps.authentication.models import AppUser


class Response(models.Model):
    survey = models.ForeignKey(
        Survey,
        related_name="responses",
        on_delete=models.CASCADE,
    )

    respondent = models.ForeignKey(
        AppUser,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "survey_responses"
        indexes = [
            models.Index(fields=["survey"]),
            models.Index(fields=["submitted_at"]),
        ]
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"Response {self.id} for '{self.survey.title}'"
