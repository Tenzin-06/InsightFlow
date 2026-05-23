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

Backward-compatible module-level functions (build_summarization_prompt,
build_sentiment_prompt, build_quality_scoring_prompt,
build_question_insight_prompt) are provided for apps.ai_analytics callers.
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


# ---------------------------------------------------------------------------
# Backward-compatible module-level helpers
# Analytics-specific prompt builders used by apps.ai_analytics services.
# These preserve the original signatures; new code should use PromptBuilder.
# ---------------------------------------------------------------------------

_ANALYTICS_SYSTEM_CONTEXT = (
    "You are an expert survey analyst helping a research team extract insights "
    "from survey responses. Always respond with valid JSON only — no markdown, "
    "no code fences, no explanatory text outside the JSON structure. "
    "Be concise, factual, and grounded in the data provided."
)


def build_summarization_prompt(responses: list[str], survey_title: str = "") -> str:
    """
    Build a prompt that asks Gemini to summarise a collection of
    open-ended survey responses.

    Backward-compatible function for apps.ai_analytics.
    Expected JSON output: {"summary": "...", "themes": ["theme1", ...]}
    """
    responses_block = "\n".join(f"- {r}" for r in responses if r and r.strip())
    survey_part = f' for the survey "{survey_title}"' if survey_title else ""

    return f"""{_ANALYTICS_SYSTEM_CONTEXT}

You are summarising open-ended survey responses{survey_part}.

Responses:
{responses_block}

Task:
1. Write a concise summary (2–3 sentences) capturing the main sentiment and findings.
2. Identify 3–5 recurring themes or topics.

Respond in valid JSON only:
{{"summary": "<2-3 sentence summary>", "themes": ["<theme1>", "<theme2>", ...]}}"""


def build_sentiment_prompt(responses: list[str], survey_title: str = "") -> str:
    """
    Build a prompt that asks Gemini to classify the overall sentiment
    across a collection of survey responses.

    Backward-compatible function for apps.ai_analytics.
    Expected JSON output:
        {
            "sentiment_distribution": {"positive": 0.6, "neutral": 0.25, "negative": 0.15},
            "dominant_sentiment": "positive",
            "confidence": 0.82,
            "reasoning": "..."
        }
    """
    responses_block = "\n".join(f"- {r}" for r in responses if r and r.strip())
    survey_part = f' for the survey "{survey_title}"' if survey_title else ""

    return f"""{_ANALYTICS_SYSTEM_CONTEXT}

Analyse the emotional tone of these survey responses{survey_part}.

Responses:
{responses_block}

Task:
1. Estimate the fraction of responses that are positive, neutral, and negative (must sum to 1.0).
2. Identify the dominant sentiment.
3. Provide a confidence score (0.0–1.0) for your assessment.
4. Write one sentence of reasoning.

Dominant sentiment must be one of: "positive", "neutral", "negative", "mixed".

Respond in valid JSON only:
{{"sentiment_distribution": {{"positive": 0.0, "neutral": 0.0, "negative": 0.0}}, "dominant_sentiment": "<label>", "confidence": 0.0, "reasoning": "<one sentence>"}}"""


def build_quality_scoring_prompt(responses: list[dict]) -> str:
    """
    Build a prompt that asks Gemini to score the quality of each response.

    Backward-compatible function for apps.ai_analytics.
    `responses` items: {"response_id": int, "text": str}
    Expected JSON output:
        {"scores": [{"response_id": 1, "score": 82, "category": "high", "flags": []}]}
    """
    if not responses:
        return ""

    responses_block = "\n".join(
        f"[{r['response_id']}]: {r['text']}" for r in responses
    )

    return f"""{_ANALYTICS_SYSTEM_CONTEXT}

Evaluate the quality of these survey responses. Score each on a 0–100 scale.

Scoring criteria:
- Response length and completeness (is it substantive?)
- Semantic relevance (does it answer the question meaningfully?)
- Consistency (coherent and non-contradictory)
- Engagement quality (thoughtful vs. minimal/spam)

Category thresholds:
- "high": 70–100
- "medium": 40–69
- "low": 0–39
- "suspicious": use when the response appears to be spam, random, or auto-generated

Responses:
{responses_block}

Respond in valid JSON only:
{{"scores": [{{"response_id": <id>, "score": <0-100>, "category": "<high|medium|low|suspicious>", "flags": []}}]}}"""


def build_question_insight_prompt(question_text: str, answers: list[str]) -> str:
    """
    Build a prompt that asks Gemini to analyse answers to a specific question.

    Backward-compatible function for apps.ai_analytics.
    Expected JSON output:
        {
            "themes": ["theme1", "theme2"],
            "sentiment_summary": "...",
            "friction_indicators": ["pain point 1", ...],
            "answer_diversity": {"description": "...", "diversity_level": "high|medium|low"}
        }
    """
    answers_block = "\n".join(f"- {a}" for a in answers if a and str(a).strip())

    return f"""{_ANALYTICS_SYSTEM_CONTEXT}

Analyse the answers to this survey question:
Question: "{question_text}"

Answers:
{answers_block}

Task:
1. List 2–4 common themes or topics that appear across multiple answers.
2. Write a one-sentence sentiment summary for this question.
3. Identify any friction indicators (pain points, complaints, confusion signals).
4. Describe the diversity of answers (how varied are the responses?).

Diversity level must be one of: "high", "medium", "low".

Respond in valid JSON only:
{{"themes": ["<theme>"], "sentiment_summary": "<sentence>", "friction_indicators": ["<issue>"], "answer_diversity": {{"description": "<sentence>", "diversity_level": "<level>"}}}}"""
