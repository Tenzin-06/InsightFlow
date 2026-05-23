import { ArrowLeft, MailPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CampaignStatusBadge } from "@/features/email-campaigns/components/campaign-status-badge";
import type { CampaignStatus } from "@/features/email-campaigns/types";

export function CampaignHeader({ title, subtitle, status }: { title: string; subtitle: string; status: CampaignStatus }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="w-fit px-0 text-text-secondary hover:text-text-primary">
          <Link to="/dashboard/campaigns">
            <ArrowLeft className="h-4 w-4" />
            Campaigns
          </Link>
        </Button>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <MailPlus className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            <CampaignStatusBadge status={status} />
          </div>
          <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
