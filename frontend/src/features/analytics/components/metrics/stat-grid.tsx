import { cn } from "@/lib/utils";
import { MetricCard } from "@/features/analytics/components/metrics/metric-card";
import type { MetricCardData } from "@/features/analytics/types";

type Props = {
  metrics: MetricCardData[];
  className?: string;
};

export function StatGrid({ metrics, className }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
      role="region"
      aria-label="Key performance indicators"
    >
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
