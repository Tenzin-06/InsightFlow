import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { PublicQuestion, SurveyFormValues } from "../types";

interface ShortTextQuestionProps {
  question: PublicQuestion;
}

/**
 * Single-line text response input.
 * Supports placeholder, required state, and inline validation feedback.
 */
export function ShortTextQuestion({ question }: ShortTextQuestionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  const error = errors[question.id];

  return (
    <div className="space-y-2">
      <Input
        id={`field-${question.id}`}
        type="text"
        placeholder="Your answer…"
        aria-invalid={!!error}
        aria-describedby={error ? `error-${question.id}` : undefined}
        className="h-11 text-base"
        {...register(question.id as never)}
      />
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
