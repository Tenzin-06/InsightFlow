import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  /** 1-based current question number for display ("Question N of M") */
  displayNumber: number;
  /** Total number of questions */
  total: number;
  /** 0–100 completion percentage */
  percentage: number;
}

/**
 * ProgressIndicator
 *
 * Minimal progress bar shown just below the header.
 * Kept deliberately unobtrusive to preserve conversational immersion.
 *
 * Receives pre-computed values from useConversationProgress so that
 * the percentage accurately reflects completed questions, not just index.
 */
export function ProgressIndicator({
  displayNumber,
  total,
  percentage,
}: ProgressIndicatorProps) {
  return (
    <div
      className="shrink-0 px-4 py-2"
      role="status"
      aria-label={`Question ${displayNumber} of ${total}`}
    >
      <div className="mb-1 flex justify-between text-xs text-text-muted">
        <span>
          Question{" "}
          <span className="font-medium text-text-secondary">{displayNumber}</span>{" "}
          of{" "}
          <span className="font-medium text-text-secondary">{total}</span>
        </span>
        <span className="font-medium text-primary-500">{percentage}%</span>
      </div>
      <Progress value={percentage} aria-hidden="true" />
    </div>
  );
}
