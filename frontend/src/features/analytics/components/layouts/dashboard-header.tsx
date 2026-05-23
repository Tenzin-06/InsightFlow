import { Calendar } from "lucide-react";

type Props = {
  title: string;
  description?: string;
};

export function AnalyticsDashboardHeader({ title, description }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
        )}
      </div>

      {/* Date range selector placeholder — future filtering */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-white px-3 py-2 text-sm text-text-secondary shadow-sm transition-colors hover:bg-slate-50 dark:bg-card dark:hover:bg-muted"
        aria-label="Select date range (coming soon)"
        disabled
      >
        <Calendar className="h-4 w-4" aria-hidden="true" />
        <span>Last 30 days</span>
      </button>
    </div>
  );
}
