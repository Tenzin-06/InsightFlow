import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MetricCardData } from "@/features/analytics/types";

type Props = MetricCardData & {
  className?: string;
};

export function MetricCard({
  label,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  description,
  className,
}: Props) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
        ? "text-red-500"
        : "text-text-muted";

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-shadow duration-200 hover:shadow-md",
        className
      )}
      aria-label={`${label}: ${value}`}
    >
      <CardContent className="pt-5 pb-4">
        {/* Header row: label + optional icon */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          {Icon && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <Icon className="h-4 w-4 text-primary-500" aria-hidden="true" />
            </span>
          )}
        </div>

        {/* Primary value */}
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        {/* Trend row */}
        {(change || description) && (
          <div className="mt-2 flex items-center gap-1.5">
            {change && (
              <>
                <TrendIcon
                  className={cn("h-3.5 w-3.5", trendColor)}
                  aria-hidden="true"
                />
                <span className={cn("text-xs font-semibold", trendColor)}>
                  {change}
                </span>
              </>
            )}
            {description && (
              <span className="text-xs text-text-muted">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
