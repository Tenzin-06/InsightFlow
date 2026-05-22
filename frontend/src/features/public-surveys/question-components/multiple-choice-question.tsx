import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import type { PublicQuestion, SurveyFormValues } from "../types";

interface MultipleChoiceQuestionProps {
  question: PublicQuestion;
}

/**
 * Single-select radio group.
 *
 * Uses a hidden native <input type="radio"> registered with react-hook-form
 * so form state updates reliably. The visual radio dot and row highlight are
 * driven by `watch`, which re-renders correctly because the field is registered.
 *
 * (Radix RadioGroupPrimitive.Indicator was dropped — its Presence-based
 * mounting only triggers on Radix's internal state, which conflicts with
 * react-hook-form's controlled value flow on unregistered fields.)
 */
export function MultipleChoiceQuestion({ question }: MultipleChoiceQuestionProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  const choices: string[] = question.metadata.choices ?? [];
  // watch re-renders this component whenever the field value changes
  const selectedValue = watch(question.id as never) as string | undefined;
  const error = errors[question.id];

  // Register once — react-hook-form manages the underlying value
  const registration = register(question.id as never);

  return (
    <div
      className="space-y-2"
      role="radiogroup"
      aria-labelledby={`label-${question.id}`}
      aria-describedby={error ? `error-${question.id}` : undefined}
    >
      {choices.map((choice) => {
        const optionId = `${question.id}-${choice}`;
        const isSelected = selectedValue === choice;

        return (
          <label
            key={choice}
            htmlFor={optionId}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm font-normal transition-colors",
              isSelected
                ? "border-primary-500 bg-primary-50 text-text-primary"
                : "border-border-default bg-bg-secondary text-text-secondary hover:border-primary-300 hover:bg-bg-hover"
            )}
          >
            {/* Native radio — visually hidden, react-hook-form registered */}
            <input
              type="radio"
              id={optionId}
              value={choice}
              {...registration}
              className="sr-only"
            />

            {/* Custom radio visual: ring + filled dot when selected */}
            <span
              className={cn(
                "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                isSelected ? "border-primary-500" : "border-border-strong"
              )}
              aria-hidden="true"
            >
              {isSelected && (
                <span className="h-2 w-2 rounded-full bg-primary-500" />
              )}
            </span>

            <span>{choice}</span>
          </label>
        );
      })}

      {error && (
        <p
          id={`error-${question.id}`}
          role="alert"
          className="text-xs font-medium text-danger"
        >
          {String(error.message)}
        </p>
      )}

      {choices.length === 0 && (
        <p className="text-sm text-text-muted">No options defined for this question.</p>
      )}
    </div>
  );
}
