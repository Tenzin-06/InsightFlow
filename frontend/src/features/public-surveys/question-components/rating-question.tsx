import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { DEFAULT_RATING_MIN, DEFAULT_RATING_MAX } from "../constants";
import type { PublicQuestion, SurveyFormValues } from "../types";

interface RatingQuestionProps {
  question: PublicQuestion;
}

/**
 * Numeric scale rating component (1–5 or 1–10 depending on metadata).
 * Large, touch-friendly buttons for quick, accessible interaction.
 */
export function RatingQuestion({ question }: RatingQuestionProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  const min: number = question.metadata.min_rating ?? DEFAULT_RATING_MIN;
  const max: number = question.metadata.max_rating ?? DEFAULT_RATING_MAX;
  const selectedRating = watch(question.id) as number | null | undefined;
  const error = errors[question.id];

  const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-3">
      {/* Scale labels */}
      <div className="flex justify-between text-xs text-text-muted">
        <span>Not at all</span>
        <span>Extremely</span>
      </div>

      {/* Rating buttons */}
      <div
        role="radiogroup"
        aria-label={`Rating scale from ${min} to ${max}`}
        aria-describedby={error ? `error-${question.id}` : undefined}
        className="flex flex-wrap gap-2"
      >
        {ratings.map((rating) => {
          const isSelected = selectedRating === rating;
          return (
            <button
              key={rating}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${rating} out of ${max}`}
              onClick={() =>
                setValue(question.id, isSelected ? null : rating, { shouldValidate: true })
              }
              className={cn(
                "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary-500 bg-primary-500 text-white shadow-sm"
                  : "border-border-default bg-bg-secondary text-text-secondary hover:border-primary-400 hover:bg-primary-50"
              )}
            >
              {rating}
            </button>
          );
        })}
      </div>

      {/* Selected value indicator */}
      {selectedRating != null && (
        <p className="text-xs text-text-secondary">
          Selected:{" "}
          <span className="font-semibold text-primary-500">{selectedRating}</span>
        </p>
      )}

      {error && (
        <p
          id={`error-${question.id}`}
          role="alert"
          className="text-xs font-medium text-danger"
        >
          {String(error.message)}
        </p>
      )}
    </div>
  );
}
