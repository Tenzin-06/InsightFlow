import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title?: string;
  description?: string;
};

export function EmptyAnalyticsState({
  title = "No data yet",
  description = "Collect survey responses to start seeing analytics here.",
}: Props) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
          <BarChart3 className="h-7 w-7 text-primary-400" aria-hidden="true" />
        </span>
        <div>
          <p className="text-base font-semibold text-text-primary">{title}</p>
          <p className="mt-1 text-sm text-text-secondary max-w-xs">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
