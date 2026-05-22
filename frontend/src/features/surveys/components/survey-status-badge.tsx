import { cn } from "@/lib/utils";
import type { SurveyStatus } from "@/features/surveys/types";

type Props = {
  status: SurveyStatus;
};

const statusConfig: Record<
  SurveyStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "border-gray-200 bg-gray-50 text-gray-500",
  },
  published: {
    label: "Published",
    className: "border-emerald-200 bg-emerald-50 text-emerald-600",
  },
  archived: {
    label: "Archived",
    className: "border-amber-200 bg-amber-50 text-amber-600",
  },
};

export function SurveyStatusBadge({ status }: Props) {
  const { label, className } = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}
