"""
Centralised AI prompt generation for InsightFlow analytics.

All prompts are defined here to keep them reusable, testable,
and decoupled from business logic.

Usage:
    from apps.ai.services import build_summarization_prompt
    prompt = build_summarization_prompt(responses=["text1", "text2"])
"""

from __future__ import annotations

_SYSTEM_CONTEXT = (
    "You are an expert survey analyst helping a research team extract insights "
    "from survey responses. Always respond with valid JSON only — no markdown, "
    "no code fences, no explanatory text outside the JSON structure. "
    "Be concise, factual, and grounded in the data provided."
)


def build_summarization_prompt(responses: list[str], survey_title: str = "") -> str:
    """
    Build a prompt that asks Gemini to summarise a collection of
    open-ended survey responses.

    Expected JSON output:
        {
            "summary": "...",
            "themes": ["theme1", "theme2", ...]
        }
    """
    responses_block = "\n".join(f"- {r}" for r in responses if r and r.strip())
    survey_part = f" for the survey \"{survey_title}\"" if survey_title else ""

    return f"""{_SYSTEM_CONTEXT}

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

    Expected JSON output:
        {
            "sentiment_distribution": {
                "positive": 0.6,
                "neutral": 0.25,
                "negative": 0.15
            },
            "dominant_sentiment": "positive",
            "confidence": 0.82,
            "reasoning": "..."
        }
    """
    responses_block = "\n".join(f"- {r}" for r in responses if r and r.strip())
    survey_part = f" for the survey \"{survey_title}\"" if survey_title else ""

    return f"""{_SYSTEM_CONTEXT}

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

    `responses` items: {"response_id": int, "text": str}

    Expected JSON output:
        {
            "scores": [
                {"response_id": 1, "score": 82, "category": "high", "flags": []}
            ]
        }
    Category values: "high" (70-100), "medium" (40-69), "low" (0-39), "suspicious"
    """
    if not responses:
        return ""

    responses_block = "\n".join(
        f"[{r['response_id']}]: {r['text']}" for r in responses
    )

    return f"""{_SYSTEM_CONTEXT}

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

    Expected JSON output:
        {
            "themes": ["theme1", "theme2"],
            "sentiment_summary": "...",
            "friction_indicators": ["pain point 1", ...],
            "answer_diversity": {"description": "...", "diversity_level": "high|medium|low"}
        }
    """
    answers_block = "\n".join(f"- {a}" for a in answers if a and str(a).strip())

    return f"""{_SYSTEM_CONTEXT}

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
