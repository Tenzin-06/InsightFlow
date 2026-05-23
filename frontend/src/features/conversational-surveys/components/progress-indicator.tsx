import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  current: number;   // 0-based current index
  total: number;
}

/**
 * ProgressIndicator
 *
 * Minimal progress bar shown just below the header.
 * Kept deliberately unobtrusive to preserve conversational immersion.
 */
export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const answered = current; // questions answered so far
  const percentage =
    total === 0 ? 0 : Math.round((answered / total) * 100);

  return (
    <div
      className="shrink-0 px-4 py-2"
      role="status"
      aria-label={`Question ${current + 1} of ${total}`}
    >
      <div className="mb-1 flex justify-between text-xs text-text-muted">
        <span>
          Question{" "}
          <span className="font-medium text-text-secondary">{current + 1}</span>{" "}
          of{" "}
          <span className="font-medium text-text-secondary">{total}</span>
        </span>
        <span className="font-medium text-primary-500">{percentage}%</span>
      </div>
      <Progress value={percentage} aria-hidden="true" />
    </div>
  );
}
