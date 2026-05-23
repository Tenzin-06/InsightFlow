import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  percentage: number;
  description?: string;
  color?: string;
  className?: string;
};

export function PercentageCard({
  label,
  percentage,
  description,
  color = "#3B82F6",
  className,
}: Props) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <Card className={cn("overflow-hidden", className)} aria-label={`${label}: ${percentage.toFixed(1)}%`}>
      <CardContent className="pt-5 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <span className="text-xl font-bold text-text-primary tabular-nums">
            {percentage.toFixed(1)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${clamped}%`, backgroundColor: color }}
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${percentage.toFixed(1)}%`}
          />
        </div>

        {description && (
          <p className="text-xs text-text-muted">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
