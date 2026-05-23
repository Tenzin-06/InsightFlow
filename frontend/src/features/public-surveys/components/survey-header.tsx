import { Clock } from "lucide-react";

import { estimateCompletionTime } from "../utils";

interface SurveyHeaderProps {
  title: string;
  description: string;
  questionCount: number;
}

/**
 * Displays survey identity: title, description, and estimated completion time.
 * Kept compact to establish context without overwhelming the respondent.
 */
export function SurveyHeader({ title, description, questionCount }: SurveyHeaderProps) {
  const timeEstimate = estimateCompletionTime(questionCount);

  return (
    <div className="mb-6 rounded-xl bg-bg-secondary p-6 shadow-sm">
      {/* Branding accent line */}
      <div className="mb-4 h-1 w-12 rounded-full bg-primary-500" />

      <h1 className="text-2xl font-bold text-text-primary">{title}</h1>

      {description && (
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
      )}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-text-muted">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{timeEstimate} to complete</span>
        <span className="mx-1">·</span>
        <span>{questionCount} question{questionCount !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
