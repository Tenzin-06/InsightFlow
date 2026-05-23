"""
AIPromptTemplate — stores reusable, versioned prompt templates in the database.

Templates are composed of four sections following the layered prompt structure:
    System Context → User Context → Task Instructions → Output Constraints
"""

from django.db import models
from apps.core.models import TimeStampedModel
from apps.ai.constants.ai_constants import PromptCategory


class AIPromptTemplate(TimeStampedModel):
    """
    A versioned, categorised AI prompt template.

    Fields
    ------
    name                    : Unique human-readable identifier.
    category                : Logical category (survey_analysis, summarization, …).
    system_context          : Top-level context describing the AI's role.
    user_context_template   : Template string with {{variable}} placeholders
                              for per-request data injection.
    task_instructions       : What the model should do with the data.
    output_constraints      : Format / length / structure rules for the output.
    is_active               : Soft-disable without deleting.
    version                 : Monotonically increasing version counter.
    """

    name = models.CharField(max_length=100, unique=True, db_index=True)
    category = models.CharField(
        max_length=50,
        choices=PromptCategory.CHOICES,
        db_index=True,
    )
    system_context = models.TextField()
    user_context_template = models.TextField()
    task_instructions = models.TextField()
    output_constraints = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True, db_index=True)
    version = models.PositiveSmallIntegerField(default=1)

    class Meta:
        app_label = "ai"
        db_table = "ai_prompt_templates"
        ordering = ["category", "name"]
        indexes = [
            models.Index(fields=["category", "is_active"]),
        ]

    def __str__(self) -> str:
        return f"AIPromptTemplate({self.name} v{self.version})"

    def build_prompt(self, variables: dict | None = None) -> str:
        """
        Assemble the full prompt string.

        Injects {{key}} placeholders from *variables* into
        user_context_template before assembling all four sections.
        """
        user_context = self.user_context_template
        if variables:
            for key, value in variables.items():
                user_context = user_context.replace(f"{{{{{key}}}}}", str(value))

        parts = [
            self.system_context,
            user_context,
            self.task_instructions,
        ]
        if self.output_constraints:
            parts.append(self.output_constraints)

        return "\n\n".join(part.strip() for part in parts if part.strip())
