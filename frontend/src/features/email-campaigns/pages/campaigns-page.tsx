import { Link } from "react-router-dom";
import { MailPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/email-campaigns/components/empty-state";

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Email Campaigns</h1>
          <p className="text-sm text-text-secondary">Create and prepare survey outreach campaigns.</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/campaigns/new">
            <MailPlus className="h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>
      <EmptyState
        title="Create your first email campaign"
        description="Campaign delivery, analytics, and automation will connect in future units."
        action={
          <Button asChild>
            <Link to="/dashboard/campaigns/new">Create Campaign</Link>
          </Button>
        }
      />
    </div>
  );
}
