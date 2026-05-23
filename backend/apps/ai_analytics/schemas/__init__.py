"""
Pydantic schemas for validating AI-generated analytics outputs.

These schemas enforce structure and type safety on AI responses
before they are persisted or returned via the API.
"""

from __future__ import annotations

from typing import Optional

try:
    from pydantic import BaseModel, Field, field_validator

    class SummarisationOutput(BaseModel):
        summary: str = Field(default="", max_length=2000)
        themes: list[str] = Field(default_factory=list)

        @field_validator("themes")
        @classmethod
        def limit_themes(cls, v: list[str]) -> list[str]:
            return [str(t).strip() for t in v[:10] if t]

    class SentimentDistribution(BaseModel):
        positive: float = Field(default=0.0, ge=0.0, le=1.0)
        neutral: float = Field(default=1.0, ge=0.0, le=1.0)
        negative: float = Field(default=0.0, ge=0.0, le=1.0)

    class SentimentOutput(BaseModel):
        sentiment_distribution: SentimentDistribution = Field(
            default_factory=SentimentDistribution
        )
        dominant_sentiment: str = Field(default="neutral")
        confidence: float = Field(default=0.0, ge=0.0, le=1.0)
        reasoning: str = Field(default="")

        @field_validator("dominant_sentiment")
        @classmethod
        def validate_sentiment(cls, v: str) -> str:
            valid = {"positive", "neutral", "negative", "mixed"}
            return v if v in valid else "neutral"

    class QualityScoreItem(BaseModel):
        response_id: int
        score: int = Field(ge=0, le=100)
        category: str = Field(default="medium")
        flags: list[str] = Field(default_factory=list)

        @field_validator("category")
        @classmethod
        def validate_category(cls, v: str) -> str:
            valid = {"high", "medium", "low", "suspicious"}
            return v if v in valid else "medium"

    class QualityScoringOutput(BaseModel):
        scores: list[QualityScoreItem] = Field(default_factory=list)

    class AnswerDiversity(BaseModel):
        description: str = Field(default="")
        diversity_level: str = Field(default="medium")

        @field_validator("diversity_level")
        @classmethod
        def validate_level(cls, v: str) -> str:
            return v if v in {"high", "medium", "low"} else "medium"

    class QuestionInsightOutput(BaseModel):
        themes: list[str] = Field(default_factory=list)
        sentiment_summary: str = Field(default="")
        friction_indicators: list[str] = Field(default_factory=list)
        answer_diversity: AnswerDiversity = Field(default_factory=AnswerDiversity)

    PYDANTIC_AVAILABLE = True

except ImportError:
    # pydantic not installed — schemas degrade gracefully
    PYDANTIC_AVAILABLE = False

    class SummarisationOutput:  # type: ignore[no-redef]
        pass

    class SentimentOutput:  # type: ignore[no-redef]
        pass

    class QualityScoringOutput:  # type: ignore[no-redef]
        pass

    class QuestionInsightOutput:  # type: ignore[no-redef]
        pass
