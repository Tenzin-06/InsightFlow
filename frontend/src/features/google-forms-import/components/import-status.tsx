import { Badge } from "@/components/ui/badge";
import { IMPORT_STATUS_LABELS } from "@/features/google-forms-import/constants";
import type { ImportStatus } from "@/features/google-forms-import/types";

type Props = {
  status: ImportStatus;
};

const STATUS_VARIANTS: Record<
  ImportStatus,
  "default" | "success" | "destructive" | "outline" | "warning"
> = {
  idle: "outline",
  validating: "default",
  importing: "default",
  success: "success",
  error: "destructive",
};

export function ImportStatus({ status }: Props) {
  const variant = STATUS_VARIANTS[status];
  const label = IMPORT_STATUS_LABELS[status] ?? status;

  if (status === "idle") return null;

  return (
    <Badge variant={variant} className="text-xs font-medium">
      {label}
    </Badge>
  );
}
