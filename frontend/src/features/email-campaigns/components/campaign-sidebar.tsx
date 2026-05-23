import { CheckCircle2, Clock, Eye, Mail, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmailCampaignDraft } from "@/features/email-campaigns/types";

const steps = [
  { label: "Campaign setup", icon: Mail },
  { label: "Audience selection", icon: Users },
  { label: "Email preview", icon: Eye },
  { label: "Send or schedule", icon: Clock },
];

export function CampaignSidebar({
  draft,
  recipientCount,
}: {
  draft: EmailCampaignDraft;
  recipientCount: number;
}) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-tertiary text-primary-600">
                <step.icon className="h-4 w-4" />
              </span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-bg-tertiary p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Draft readiness
          </div>
          <dl className="mt-3 space-y-2 text-sm text-text-secondary">
            <div className="flex justify-between gap-3">
              <dt>Audiences</dt>
              <dd>{draft.audienceIds.length}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Recipients</dt>
              <dd>{recipientCount}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Delivery</dt>
              <dd>{draft.scheduleMode === "now" ? "Immediate" : "Scheduled"}</dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
