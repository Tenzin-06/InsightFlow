from django.db import models
from .survey import Survey

QUESTION_TYPE_SHORT_TEXT = "short_text"
QUESTION_TYPE_LONG_TEXT = "long_text"
QUESTION_TYPE_MULTIPLE_CHOICE = "multiple_choice"
QUESTION_TYPE_CHECKBOX = "checkbox"
QUESTION_TYPE_RATING = "rating"

QUESTION_TYPES = [
    (QUESTION_TYPE_SHORT_TEXT, "Short Text"),
    (QUESTION_TYPE_LONG_TEXT, "Long Text"),
    (QUESTION_TYPE_MULTIPLE_CHOICE, "Multiple Choice"),
    (QUESTION_TYPE_CHECKBOX, "Checkbox"),
    (QUESTION_TYPE_RATING, "Rating"),
]


class Question(models.Model):
    survey = models.ForeignKey(
        Survey,
        related_name="questions",
        on_delete=models.CASCADE,
    )
    question_text = models.TextField()
    question_type = models.CharField(
        max_length=50,
        choices=QUESTION_TYPES,
    )
    is_required = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "survey_questions"
        ordering = ["order"]

    def __str__(self):
        return f"{self.survey.title} — Q{self.order}: {self.question_text[:60]}"
