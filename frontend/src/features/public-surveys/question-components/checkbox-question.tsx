import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PublicQuestion, SurveyFormValues } from "../types";

interface CheckboxQuestionProps {
  question: PublicQuestion;
}

/**
 * Multi-select checkbox group.
 * Manages an array of selected choice strings via setValue/watch.
 */
export function CheckboxQuestion({ question }: CheckboxQuestionProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  const choices: string[] = question.metadata.choices ?? [];
  const selectedValues: string[] = (watch(question.id) as string[]) ?? [];
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
          <Label
            key={choice}
            htmlFor={optionId}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm font-normal transition-colors",
              isChecked
                ? "border-primary-500 bg-primary-50 text-text-primary"
                : "border-border-default bg-bg-secondary text-text-secondary hover:border-primary-300 hover:bg-bg-hover"
            )}
          >
            <Checkbox
              id={optionId}
              checked={isChecked}
              onCheckedChange={(checked) => handleToggle(choice, !!checked)}
              aria-label={choice}
            />
            <span>{choice}</span>
          </Label>
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
