from django.db import models
from apps.surveys.models.question import Question
from .response import Response


class Answer(models.Model):
    response = models.ForeignKey(
        Response,
        related_name="answers",
        on_delete=models.CASCADE,
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
    )

    value = models.JSONField()

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    class Meta:
        db_table = "survey_answers"
        indexes = [
            models.Index(fields=["question"]),
        ]

    def __str__(self):
        return f"Answer {self.id} — Response {self.response_id} / Question {self.question_id}"
