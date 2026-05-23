import { cn } from "@/lib/utils";
import { DEFAULT_RATING_MIN, DEFAULT_RATING_MAX } from "../constants";
import type { PublicQuestion, AnswerValue } from "../types";

interface ConversationalRatingProps {
  question: PublicQuestion;
  validationError: string | null;
  isDisabled: boolean;
  onSubmit: (value: AnswerValue) => void;
}

/**
 * ConversationalRating
 *
 * Numeric scale buttons that auto-advance on tap — no "Send" needed.
 * Large touch-friendly buttons arranged in a row.
 * Scale range driven by question.metadata (defaults to 1–5).
 */
export function ConversationalRating({
  question,
  isDisabled,
  onSubmit,
}: ConversationalRatingProps) {
  const min: number = question.metadata?.min_rating ?? DEFAULT_RATING_MIN;
  const max: number = question.metadata?.max_rating ?? DEFAULT_RATING_MAX;
  const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-2">
      {/* Scale labels */}
      <div className="flex justify-between text-xs text-text-muted">
        <span>Not at all</span>
        <span>Extremely</span>
      </div>

      {/* Rating buttons */}
      <div
        role="radiogroup"
        aria-label={`Rating scale ${min} to ${max}`}
        className="flex flex-wrap gap-2"
      >
        {ratings.map((rating) => (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={false}
            aria-label={`${rating} out of ${max}`}
            onClick={() => !isDisabled && onSubmit(rating)}
            disabled={isDisabled}
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border-default bg-bg-primary",
              "text-sm font-semibold text-text-secondary transition-all",
              "hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
              "active:bg-primary-100 active:border-primary-500",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}
