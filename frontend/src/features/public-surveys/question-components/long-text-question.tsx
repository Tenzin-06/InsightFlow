import { useFormContext } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import type { PublicQuestion, SurveyFormValues } from "../types";

interface LongTextQuestionProps {
  question: PublicQuestion;
}

/**
 * Multi-line paragraph response textarea.
 * Auto-grows via CSS to accommodate longer answers without forcing scroll.
 */
export function LongTextQuestion({ question }: LongTextQuestionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  const error = errors[question.id];

  return (
    <div className="space-y-2">
      <Textarea
        id={`field-${question.id}`}
        placeholder="Your answer…"
        rows={4}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${question.id}` : undefined}
        className="resize-none text-base leading-relaxed"
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
