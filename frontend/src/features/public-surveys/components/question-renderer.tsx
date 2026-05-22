import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { ShortTextQuestion } from "../question-components/short-text-question";
import { LongTextQuestion } from "../question-components/long-text-question";
import { MultipleChoiceQuestion } from "../question-components/multiple-choice-question";
import { CheckboxQuestion } from "../question-components/checkbox-question";
import { RatingQuestion } from "../question-components/rating-question";
import type { PublicQuestion } from "../types";

interface QuestionRendererProps {
  question: PublicQuestion;
  index: number;
}

/**
 * Maps a question's type to the appropriate interactive component.
 * Wraps each question in a consistent card with label, required indicator,
 * and validation state.
 */
export function QuestionRenderer({ question, index }: QuestionRendererProps) {
  const labelId = `label-${question.id}`;

  return (
    <div
      className={cn(
        "rounded-xl bg-bg-secondary p-6 shadow-sm transition-shadow hover:shadow-md"
      )}
    >
      {/* Question header */}
      <div className="mb-4 flex items-start gap-2">
        <span
          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700"
          aria-hidden="true"
        >
          {index + 1}
        </span>

        <label
          id={labelId}
          htmlFor={`field-${question.id}`}
          className="text-sm font-semibold leading-snug text-text-primary"
        >
          {question.question_text}
          {question.is_required && (
            <span
              className="ml-1 text-danger"
              aria-label="required"
              title="This question is required"
            >
              *
            </span>
          )}
        </label>
      </div>

      {/* Question component */}
      <QuestionComponent question={question} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal dispatcher — maps question type → component
// ---------------------------------------------------------------------------

function QuestionComponent({ question }: { question: PublicQuestion }) {
  switch (question.question_type) {
    case "short_text":
      return <ShortTextQuestion question={question} />;
    case "long_text":
      return <LongTextQuestion question={question} />;
    case "multiple_choice":
      return <MultipleChoiceQuestion question={question} />;
    case "checkbox":
      return <CheckboxQuestion question={question} />;
    case "rating":
      return <RatingQuestion question={question} />;
    default:
      return (
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <AlertCircle className="h-4 w-4 text-warning" aria-hidden="true" />
          <span>Unsupported question type.</span>
        </div>
      );
  }
}
