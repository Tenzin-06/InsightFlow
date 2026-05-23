import { cn } from "@/lib/utils";
import type { PublicQuestion, AnswerValue } from "../types";

interface ConversationalMultipleChoiceProps {
  question: PublicQuestion;
  validationError: string | null;
  isDisabled: boolean;
  onSubmit: (value: AnswerValue) => void;
}

/**
 * ConversationalMultipleChoice
 *
 * Tap-to-select option list that auto-advances immediately on selection.
 * No "Send" button needed — tapping a choice is the commit action.
 * Uses full-width pill buttons with large touch targets for mobile.
 */
export function ConversationalMultipleChoice({
  question,
  isDisabled,
  onSubmit,
}: ConversationalMultipleChoiceProps) {
  const choices: string[] = question.metadata?.choices ?? [];

  return (
    <div
      role="radiogroup"
      aria-label={question.question_text}
      className="space-y-2"
    >
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          role="radio"
          aria-checked={false}
          onClick={() => !isDisabled && onSubmit(choice)}
          disabled={isDisabled}
          className={cn(
            "w-full rounded-xl border border-border-default bg-bg-primary px-4 py-3 text-left text-sm font-medium text-text-primary transition-colors",
            "hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "active:bg-primary-100"
          )}
        >
          {choice}
        </button>
      ))}

      {choices.length === 0 && (
        <p className="text-sm text-text-muted">No options defined.</p>
      )}
    </div>
  );
}
