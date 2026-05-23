import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { EXPORT_STATUS_LABELS, EXPORT_STATUS_PROGRESS } from "../constants";
import type { ExportStatus } from "../types";

const STAGES: ExportStatus[] = ["preparing", "rendering", "processing_charts", "finalizing", "completed"];

type ExportProgressProps = {
  status: ExportStatus;
  progress: number;
  errorMessage?: string | null;
  fileUrl?: string | null;
};

export function ExportProgress({ status, progress, errorMessage, fileUrl }: ExportProgressProps) {
  if (status === "idle") return null;
  const isFailed = status === "failed";
  const isCompleted = status === "completed";
  const isInProgress = !isFailed && !isCompleted;

  return (
    <div
      role="status"
      aria-live="polite"
      className={["rounded-xl border p-5 shadow-sm", isFailed ? "border-danger/40 bg-danger/5" : isCompleted ? "border-success/40 bg-success/5" : "border-primary-200 bg-primary-50 dark:border-primary-700/30 dark:bg-primary-900/10"].join(" ")}
    >
      <div className="mb-4 flex items-center gap-3">
        {isFailed
          ? <XCircle className="h-5 w-5 text-danger" aria-hidden="true" />
          : isCompleted
          ? <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
          : <Loader2 className="h-5 w-5 animate-spin text-primary-500" aria-hidden="true" />}
        <div>
          <p className={`text-sm font-semibold ${isFailed ? "text-danger" : isCompleted ? "text-success" : "text-primary-700 dark:text-primary-300"}`}>
            {EXPORT_STATUS_LABELS[status]}
          </p>
          {isInProgress && <p className="text-xs text-text-muted">{progress}% complete</p>}
        </div>
      </div>

      {!isFailed && (
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-border-default" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className={["h-full rounded-full transition-all duration-700", isCompleted ? "bg-success" : "bg-primary-500"].join(" ")} style={{ width: `${progress}%` }} />
        </div>
      )}

      {isInProgress && (
        <div className="flex items-center justify-between" role="list">
          {STAGES.filter((s) => s !== "completed").map((stage) => {
            const sp = EXPORT_STATUS_PROGRESS[stage];
            const isDone = progress > sp;
            const isCurrent = stage === status;
            return (
              <div key={stage} role="listitem" className="flex flex-col items-center gap-1">
                <div className={["h-2 w-2 rounded-full transition-colors", isDone ? "bg-primary-500" : isCurrent ? "bg-primary-300 ring-2 ring-primary-200" : "bg-border-strong"].join(" ")} aria-hidden="true" />
                <span className={`hidden text-[10px] sm:block ${isDone || isCurrent ? "text-primary-500" : "text-text-muted"}`}>
                  {stage.replace("_", " ")}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {isCompleted && fileUrl && (
        <a href={fileUrl} download className="mt-2 inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-success/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-success">
          Download PDF Report
        </a>
      )}

      {isFailed && (
        <div>
          {errorMessage && <p className="mb-2 text-xs text-danger">{errorMessage}</p>}
          <p className="text-xs text-text-muted">
            Check your configuration and try again. If the issue persists, reduce sections or disable chart inclusion.
          </p>
        </div>
      )}
    </div>
  );
}
