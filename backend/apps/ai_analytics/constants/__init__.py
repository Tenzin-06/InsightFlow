# ── Sentiment categories ──────────────────────────────────────────────────────
SENTIMENT_POSITIVE = "positive"
SENTIMENT_NEUTRAL = "neutral"
SENTIMENT_NEGATIVE = "negative"
SENTIMENT_MIXED = "mixed"

SENTIMENT_CHOICES = [
    (SENTIMENT_POSITIVE, "Positive"),
    (SENTIMENT_NEUTRAL, "Neutral"),
    (SENTIMENT_NEGATIVE, "Negative"),
    (SENTIMENT_MIXED, "Mixed"),
]

# ── Quality score categories ──────────────────────────────────────────────────
QUALITY_CATEGORY_HIGH = "high"
QUALITY_CATEGORY_MEDIUM = "medium"
QUALITY_CATEGORY_LOW = "low"
QUALITY_CATEGORY_SUSPICIOUS = "suspicious"

QUALITY_SCORE_HIGH_THRESHOLD = 70
QUALITY_SCORE_MEDIUM_THRESHOLD = 40

# ── AI processing status ──────────────────────────────────────────────────────
AI_STATUS_PENDING = "pending"
AI_STATUS_PROCESSING = "processing"
AI_STATUS_COMPLETED = "completed"
AI_STATUS_FAILED = "failed"

AI_STATUS_CHOICES = [
    (AI_STATUS_PENDING, "Pending"),
    (AI_STATUS_PROCESSING, "Processing"),
    (AI_STATUS_COMPLETED, "Completed"),
    (AI_STATUS_FAILED, "Failed"),
]

# ── Cache configuration ───────────────────────────────────────────────────────
AI_ANALYTICS_CACHE_TTL = 60 * 60 * 2   # 2 hours — AI outputs are expensive
AI_SUMMARY_CACHE_TTL = 60 * 60 * 4     # 4 hours
AI_SENTIMENT_CACHE_TTL = 60 * 60 * 4   # 4 hours
AI_QUALITY_CACHE_TTL = 60 * 60 * 2     # 2 hours
AI_QUESTION_CACHE_TTL = 60 * 60 * 4    # 4 hours

# ── Processing limits ─────────────────────────────────────────────────────────
# Maximum number of responses to send to Gemini in a single summarisation call
MAX_RESPONSES_PER_SUMMARY = 50
# Maximum number of responses to score in a single quality call
MAX_RESPONSES_PER_QUALITY_BATCH = 20
# Maximum characters per response text sent to Gemini
MAX_RESPONSE_TEXT_LENGTH = 1000

# ── Confidence thresholds ─────────────────────────────────────────────────────
MIN_CONFIDENCE_THRESHOLD = 0.3   # Below this, mark result as low confidence
HIGH_CONFIDENCE_THRESHOLD = 0.75

# ── Minimum data requirements ─────────────────────────────────────────────────
MIN_RESPONSES_FOR_AI = 1   # Generate AI insights even for a single response
