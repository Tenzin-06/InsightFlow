"""
AI Infrastructure — Shared Constants

Centralises all AI-related status codes, job types, request categories,
and default configuration values used across the ai app.
"""

# ---------------------------------------------------------------------------
# AI Job Statuses
# Mirrors the full lifecycle: pending → processing → completed / failed
# ---------------------------------------------------------------------------

class AIJobStatus:
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

    CHOICES = [
        (PENDING, "Pending"),
        (PROCESSING, "Processing"),
        (COMPLETED, "Completed"),
        (FAILED, "Failed"),
    ]


# ---------------------------------------------------------------------------
# AI Job Types
# High-level categories of AI work the platform can request
# ---------------------------------------------------------------------------

class AIJobType:
    TEXT_ANALYSIS = "text_analysis"
    SUMMARIZATION = "summarization"
    CLASSIFICATION = "classification"
    RECOMMENDATION = "recommendation"

    CHOICES = [
        (TEXT_ANALYSIS, "Text Analysis"),
        (SUMMARIZATION, "Summarization"),
        (CLASSIFICATION, "Classification"),
        (RECOMMENDATION, "Recommendation"),
    ]


# ---------------------------------------------------------------------------
# AI Request Types
# Granular operation types sent to the provider
# ---------------------------------------------------------------------------

class AIRequestType:
    TEXT_GENERATION = "text_generation"
    SUMMARIZATION = "summarization"
    CLASSIFICATION = "classification"
    STRUCTURED_OUTPUT = "structured_output"

    CHOICES = [
        (TEXT_GENERATION, "Text Generation"),
        (SUMMARIZATION, "Summarization"),
        (CLASSIFICATION, "Classification"),
        (STRUCTURED_OUTPUT, "Structured Output"),
    ]


# ---------------------------------------------------------------------------
# Prompt Categories
# Used to organise stored prompt templates
# ---------------------------------------------------------------------------

class PromptCategory:
    SURVEY_ANALYSIS = "survey_analysis"
    SUMMARIZATION = "summarization"
    CLASSIFICATION = "classification"
    RECOMMENDATION = "recommendation"

    CHOICES = [
        (SURVEY_ANALYSIS, "Survey Analysis"),
        (SUMMARIZATION, "Summarization"),
        (CLASSIFICATION, "Classification"),
        (RECOMMENDATION, "Recommendation"),
    ]


# ---------------------------------------------------------------------------
# Provider Defaults
# ---------------------------------------------------------------------------

DEFAULT_GEMINI_MODEL = "gemini-1.5-flash"
DEFAULT_AI_TIMEOUT_SECONDS = 30
DEFAULT_AI_MAX_RETRIES = 3
DEFAULT_AI_ENABLE_LOGGING = True
