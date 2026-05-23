import { Badge } from "@/components/ui/badge";
import type { CampaignStatus } from "@/features/email-campaigns/types";

const statusMeta: Record<CampaignStatus, { label: string; variant: "muted" | "success" | "warning" | "secondary" }> = {
  draft: { label: "Draft", variant: "muted" },
  ready: { label: "Ready", variant: "success" },
  scheduled: { label: "Scheduled", variant: "warning" },
  sent: { label: "Sent", variant: "secondary" },
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const meta = statusMeta[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
