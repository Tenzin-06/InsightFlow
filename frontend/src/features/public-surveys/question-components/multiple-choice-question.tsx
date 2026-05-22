import { useFormContext } from "react-hook-form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PublicQuestion, SurveyFormValues } from "../types";

interface MultipleChoiceQuestionProps {
  question: PublicQuestion;
}

/**
 * Single-select radio group with large, touch-friendly option items.
 * Each option is a fully clickable row for easier mobile interaction.
 */
export function MultipleChoiceQuestion({ question }: MultipleChoiceQuestionProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SurveyFormValues>();

  const choices: string[] = question.metadata.choices ?? [];
  const selectedValue = (watch(question.id) as string) ?? "";
  const error = errors[question.id];

  return (
    <div className="space-y-2" role="group" aria-labelledby={`label-${question.id}`}>
      <RadioGroup
        value={selectedValue}
        onValueChange={(val) => setValue(question.id, val, { shouldValidate: true })}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${question.id}` : undefined}
        className="gap-2"
      >
        {choices.map((choice) => {
          const optionId = `${question.id}-${choice}`;
          const isSelected = selectedValue === choice;

          return (
            <Label
              key={choice}
              htmlFor={optionId}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm font-normal transition-colors",
                isSelected
                  ? "border-primary-500 bg-primary-50 text-text-primary"
                  : "border-border-default bg-bg-secondary text-text-secondary hover:border-primary-300 hover:bg-bg-hover"
              )}
            >
              <RadioGroupItem value={choice} id={optionId} />
              <span>{choice}</span>
            </Label>
          );
        })}
      </RadioGroup>

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
