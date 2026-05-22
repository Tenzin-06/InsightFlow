import { Progress } from "@/components/ui/progress";
import { useSurveyProgress } from "../hooks/use-survey-progress";
import type { PublicQuestion, AnswerValue } from "../types";

interface SurveyProgressProps {
  questions: PublicQuestion[];
  formValues: Record<string, AnswerValue>;
}

/**
 * Displays a labelled progress bar showing answered / total questions.
 * Uses both a numeric counter and a visual bar for clear communication.
 */
export function SurveyProgress({ questions, formValues }: SurveyProgressProps) {
  const { answeredCount, totalCount, percentage } = useSurveyProgress(questions, formValues);

  return (
    <div className="mb-6 rounded-xl bg-bg-secondary p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
        <span>
          <span className="font-semibold text-text-primary">{answeredCount}</span> of{" "}
          <span className="font-semibold text-text-primary">{totalCount}</span>{" "}
          question{totalCount !== 1 ? "s" : ""} answered
        </span>
        <span className="font-medium text-primary-500">{percentage}%</span>
      </div>
      <Progress
        value={percentage}
        aria-label={`${percentage}% of survey completed`}
      />
    </div>
  );
}
