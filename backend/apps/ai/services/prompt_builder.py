"""
PromptBuilder — centralised, reusable AI prompt generation.

All prompt construction goes through this class so that:
    - prompts are separated from business logic
    - the four-section structure (System → User → Task → Output) is enforced
    - variable injection is handled in a single, consistent place
    - future prompt versioning / A-B testing can be layered on top

Categories (from spec):
    survey_analysis  — AI insights from survey responses
    summarization    — data summaries
    classification   — labelling / tagging
    recommendation   — AI suggestions
"""

from typing import Optional


class PromptBuilder:
    """
    Factory for structured AI prompts.

    Every builder method returns a ready-to-send string following the
    four-section structure defined in the spec.
    """

    # Shared system context injected at the top of every prompt
    SYSTEM_CONTEXT = (
        "You are an intelligent survey analytics assistant for InsightFlow. "
        "Your role is to analyse survey data, generate insights, and provide "
        "structured, actionable information. Be concise, factual, and objective."
    )

    # ------------------------------------------------------------------
    # Survey Analysis
    # ------------------------------------------------------------------

    @staticmethod
    def build_survey_analysis_prompt(
        survey_title: str,
        responses: list[str],
        question_text: Optional[str] = None,
    ) -> str:
        """
        Build a prompt that analyses a set of survey responses.

        Returns JSON with keys: themes, sentiment, insights, recommendations.
        """
        responses_block = "\n".join(f"- {r}" for r in responses)

        user_context_parts = [f"Survey: {survey_title}"]
        if question_text:
            user_context_parts.append(f"Question: {question_text}")
        user_context_parts.append(f"\nResponses:\n{responses_block}")

        return "\n\n".join([
            PromptBuilder.SYSTEM_CONTEXT,
            "\n".join(user_context_parts),
            (
                "Task: Analyse the survey responses above and identify:\n"
                "1. Key themes and recurring patterns\n"
                "2. Sentiment distribution (positive / neutral / negative)\n"
                "3. Notable insights worth highlighting\n"
                "4. Recommended actions for the survey owner"
            ),
            (
                "Output: Return a single JSON object with these exact keys:\n"
                '  "themes"          : array of theme strings\n'
                '  "sentiment"       : object with keys positive, neutral, negative (percentages)\n'
                '  "insights"        : array of insight strings\n'
                '  "recommendations" : array of recommendation strings'
            ),
        ])

    # ------------------------------------------------------------------
    # Summarisation
    # ------------------------------------------------------------------

    @staticmethod
    def build_summarization_prompt(
        text: str,
        max_sentences: int = 3,
        context: Optional[str] = None,
    ) -> str:
        """Build a concise summarisation prompt."""
        user_parts = []
        if context:
            user_parts.append(f"Context: {context}")
        user_parts.append(f"Text to summarise:\n\n{text}")

        return "\n\n".join([
            PromptBuilder.SYSTEM_CONTEXT,
            "\n".join(user_parts),
            f"Task: Summarise the text in {max_sentences} sentences or fewer.",
            "Output: A clear, concise plain-text summary with no bullet points.",
        ])

    # ------------------------------------------------------------------
    # Classification
    # ------------------------------------------------------------------

    @staticmethod
    def build_classification_prompt(text: str, categories: list[str]) -> str:
        """Build a classification prompt for the given categories."""
        categories_str = ", ".join(categories)

        return "\n\n".join([
            PromptBuilder.SYSTEM_CONTEXT,
            f"Text: {text}",
            f"Task: Classify the text into exactly one of: {categories_str}",
            "Output: Return ONLY the category name — nothing else.",
        ])

    # ------------------------------------------------------------------
    # Recommendation
    # ------------------------------------------------------------------

    @staticmethod
    def build_recommendation_prompt(
        context: str,
        goal: str,
        data_summary: str,
    ) -> str:
        """Build a recommendation prompt for AI-generated suggestions."""
        return "\n\n".join([
            PromptBuilder.SYSTEM_CONTEXT,
            f"Context: {context}\nGoal: {goal}\nData Summary: {data_summary}",
            "Task: Provide 3–5 specific, actionable recommendations based on the data.",
            (
                "Output: Return a JSON array of recommendation strings, e.g.\n"
                '["Recommendation 1", "Recommendation 2", ...]'
            ),
        ])

    # ------------------------------------------------------------------
    # Template variable injection
    # ------------------------------------------------------------------

    @staticmethod
    def inject_variables(template: str, variables: dict) -> str:
        """
        Replace {{key}} placeholders in *template* with values from *variables*.

        Unknown placeholders are left as-is so partial injection is safe.
        """
        for key, value in variables.items():
            placeholder = f"{{{{{key}}}}}"
            template = template.replace(placeholder, str(value))
        return template

    # ------------------------------------------------------------------
    # Sanitisation
    # ------------------------------------------------------------------

    @staticmethod
    def sanitize(text: str, max_chars: int = 100_000) -> str:
        """
        Basic sanitisation before embedding user content in a prompt.

        - Removes null bytes (prompt injection risk vector).
        - Truncates to max_chars to prevent excessively large payloads.
        """
        text = text.replace("\x00", "")
        return text[:max_chars]
