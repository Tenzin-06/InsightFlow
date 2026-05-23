"""
Pydantic schemas for validating structured AI outputs.

These schemas are used by AIResponseParser.validate_with_schema() to ensure
that AI-generated JSON conforms to the expected shape before it reaches
application logic.

Validation workflow (from spec):
    AI Response → Schema Validation → Normalised Output → Application Consumption
"""

from typing import Any, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Survey Analysis
# ---------------------------------------------------------------------------

class SentimentBreakdown(BaseModel):
    positive: float = Field(default=0.0, ge=0.0, le=100.0)
    neutral: float = Field(default=0.0, ge=0.0, le=100.0)
    negative: float = Field(default=0.0, ge=0.0, le=100.0)


class SurveyAnalysisOutput(BaseModel):
    """
    Expected output shape from the survey analysis AI operation.

    Fields
    ------
    themes          : Recurring topics found in responses.
    sentiment       : Distribution of positive / neutral / negative sentiment.
    insights        : Notable observations.
    recommendations : Suggested actions for the survey owner.
    """

    themes: list[str] = Field(default_factory=list)
    sentiment: SentimentBreakdown = Field(default_factory=SentimentBreakdown)
    insights: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Classification
# ---------------------------------------------------------------------------

class ClassificationOutput(BaseModel):
    """
    Output schema for single-label text classification.

    Fields
    ------
    category   : The assigned category label.
    confidence : Optional confidence score from 0.0 to 1.0.
    """

    category: str
    confidence: Optional[float] = Field(default=None, ge=0.0, le=1.0)


# ---------------------------------------------------------------------------
# Summarisation
# ---------------------------------------------------------------------------

class SummarizationOutput(BaseModel):
    """
    Output schema for text summarisation.

    Fields
    ------
    summary    : The condensed text.
    key_points : Optional list of extracted bullet-point highlights.
    """

    summary: str
    key_points: Optional[list[str]] = Field(default=None)


# ---------------------------------------------------------------------------
# Recommendation
# ---------------------------------------------------------------------------

class RecommendationOutput(BaseModel):
    """
    Output schema for recommendation generation.

    Fields
    ------
    recommendations : Ordered list of actionable recommendation strings.
    """

    recommendations: list[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# API response
# ---------------------------------------------------------------------------

class AIJobStatusResponse(BaseModel):
    """
    Shape returned by the AI job status API endpoint.
    """

    id: int
    job_type: str
    status: str
    result: Optional[Any] = None
    error_message: Optional[str] = None
    created_at: str
    updated_at: str
