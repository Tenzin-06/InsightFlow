import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { PublicQuestion, AnswerValue } from "../types";

interface ConversationalCheckboxProps {
  question: PublicQuestion;
  validationError: string | null;
  isDisabled: boolean;
  onSubmit: (value: AnswerValue) => void;
}

/**
 * ConversationalCheckbox
 *
 * Multi-select option list with a "Continue" button to advance.
 * Tapping an option toggles its selection; the Continue button commits.
 * Animated checkmark on each selected item for clear visual feedback.
 */
export function ConversationalCheckbox({
  question,
  isDisabled,
  onSubmit,
}: ConversationalCheckboxProps) {
  const choices: string[] = question.metadata?.choices ?? [];
  const [selected, setSelected] = useState<string[]>([]);

  function toggleChoice(choice: string) {
    setSelected((prev) =>
      prev.includes(choice)
        ? prev.filter((c) => c !== choice)
        : [...prev, choice]
    );
  }

  function handleContinue() {
    onSubmit(selected.length > 0 ? selected : null);
  }

  return (
    <div className="space-y-3">
      <div
        role="group"
        aria-label={question.question_text}
        className="space-y-2"
      >
        {choices.map((choice) => {
          const isChecked = selected.includes(choice);
          return (
            <button
              key={choice}
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              onClick={() => !isDisabled && toggleChoice(choice)}
              disabled={isDisabled}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isChecked
                  ? "border-primary-400 bg-primary-50 text-primary-700"
                  : "border-border-default bg-bg-primary text-text-primary hover:border-primary-300 hover:bg-primary-50"
              )}
            >
              {/* Custom checkbox visual */}
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-2 transition-colors",
                  isChecked
                    ? "border-primary-500 bg-primary-500"
                    : "border-border-strong"
                )}
                aria-hidden="true"
              >
                {isChecked && (
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                )}
              </span>
              <span className="text-left">{choice}</span>
            </button>
          );
        })}

        {choices.length === 0 && (
          <p className="text-sm text-text-muted">No options defined.</p>
        )}
      </div>

      <Button
        type="button"
        onClick={handleContinue}
        disabled={isDisabled}
        className="w-full"
      >
        {selected.length === 0 ? "Skip" : "Continue"}
      </Button>
    </div>
  );
}
