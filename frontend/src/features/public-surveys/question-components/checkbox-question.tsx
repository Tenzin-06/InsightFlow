import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import type { PublicQuestion, SurveyFormValues } from "../types";

interface CheckboxQuestionProps {
  question: PublicQuestion;
}

/**
 * Multi-select checkbox group.
 *
 * Uses hidden native <input type="checkbox"> elements so the browser and
 * react-hook-form both track the field correctly. The visual checkmark and
 * row highlight are rendered based on `watch`, which re-renders when the
 * registered field value changes.
 */
export function CheckboxQuestion({ question }: CheckboxQuestionProps) {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  const choices: string[] = question.metadata.choices ?? [];
  // Ensure field is registered so watch triggers re-renders
  register(question.id as never);
  const selectedValues: string[] = (watch(question.id as never) as string[]) ?? [];
  const error = errors[question.id];

  function handleToggle(choice: string, checked: boolean) {
    const next = checked
      ? [...selectedValues, choice]
      : selectedValues.filter((v) => v !== choice);
    setValue(question.id, next, { shouldValidate: true });
  }

  return (
    <div
      className="space-y-2"
      role="group"
      aria-labelledby={`label-${question.id}`}
      aria-describedby={error ? `error-${question.id}` : undefined}
    >
      {choices.map((choice) => {
        const optionId = `${question.id}-${choice}`;
        const isChecked = selectedValues.includes(choice);

        return (
          <label
            key={choice}
            htmlFor={optionId}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm font-normal transition-colors",
              isChecked
                ? "border-primary-500 bg-primary-50 text-text-primary"
                : "border-border-default bg-bg-secondary text-text-secondary hover:border-primary-300 hover:bg-bg-hover"
            )}
          >
            {/* Native checkbox — hidden; state managed via setValue */}
            <input
              type="checkbox"
              id={optionId}
              checked={isChecked}
              onChange={(e) => handleToggle(choice, e.target.checked)}
              className="sr-only"
            />

            {/* Custom checkbox visual */}
            <span
              className={cn(
                "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border-2 transition-colors",
                isChecked
                  ? "border-primary-500 bg-primary-500"
                  : "border-border-strong bg-transparent"
              )}
              aria-hidden="true"
            >
              {isChecked && (
                // Checkmark drawn as two CSS borders (classic tick)
                <svg
                  viewBox="0 0 10 10"
                  className="h-3 w-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1.5,5 4,7.5 8.5,2.5" />
                </svg>
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
