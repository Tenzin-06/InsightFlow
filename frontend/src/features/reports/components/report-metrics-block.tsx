import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ReportMetric } from "../types";

type ReportMetricsBlockProps = { title?: string; metrics: ReportMetric[] };

export function ReportMetricsBlock({ title = "Metrics Overview", metrics }: ReportMetricsBlockProps) {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-base font-semibold text-text-primary">{title}</h2>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="list">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            role="listitem"
            className="flex flex-col gap-1.5 rounded-xl border border-border-default bg-white p-4 shadow-sm dark:bg-card"
          >
            <p className="text-2xl font-extrabold leading-none text-text-primary">
              {metric.value}
              {metric.unit && <span className="ml-1 text-sm font-medium text-text-muted">{metric.unit}</span>}
            </p>
            <p className="text-xs text-text-secondary">{metric.label}</p>
            {metric.trend && metric.trend !== "neutral" && (
              <div className="mt-0.5 flex items-center gap-1">
                {metric.trend === "up"
                  ? <TrendingUp className="h-3 w-3 text-success" aria-hidden="true" />
                  : <TrendingDown className="h-3 w-3 text-danger" aria-hidden="true" />}
                {metric.change && (
                  <span className={`text-xs font-medium ${metric.trend === "up" ? "text-success" : "text-danger"}`}>
                    {metric.change}
                  </span>
                )}
              </div>
            )}
            {metric.trend === "neutral" && <Minus className="h-3 w-3 text-text-muted" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}
