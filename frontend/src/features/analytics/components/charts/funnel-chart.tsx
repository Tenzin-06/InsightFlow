import { CHART_COLORS } from "@/features/analytics/constants";
import type { FunnelStep } from "@/features/analytics/types";

type Props = {
  data: FunnelStep[];
};

/**
 * Custom funnel chart rendered as progressively narrower horizontal bars.
 * Recharts' built-in Funnel component requires specific setup; this
 * lightweight implementation keeps the visual clear and avoids complexity.
 */
export function AnalyticsFunnelChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3" role="list" aria-label="Engagement funnel">
      {data.map((step, index) => {
        const barWidth = Math.max(20, Math.round((step.value / max) * 100));
        const opacity = 1 - index * 0.14;

        return (
          <div key={step.label} className="flex items-center gap-3" role="listitem">
            {/* Step number */}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">
              {index + 1}
            </span>

            {/* Bar + label */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-text-primary">{step.label}</span>
                <span className="tabular-nums text-text-secondary">
                  {step.value.toLocaleString()} · {step.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: CHART_COLORS.primary,
                    opacity,
                  }}
                  aria-label={`${step.percentage.toFixed(1)}% completion`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
