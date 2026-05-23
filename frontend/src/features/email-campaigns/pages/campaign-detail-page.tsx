import { Link, useParams } from "react-router-dom";
import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignHeader } from "@/features/email-campaigns/components/campaign-header";
import { CampaignStatusBadge } from "@/features/email-campaigns/components/campaign-status-badge";

export default function CampaignDetailPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <CampaignHeader
        title="Campaign Detail"
        subtitle="Campaign persistence will be connected in a future backend unit."
        status="draft"
      />
      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Draft campaign</CardTitle>
            <p className="mt-1 text-sm text-text-secondary">Reference ID: {id}</p>
          </div>
          <CampaignStatusBadge status="draft" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            This screen reserves the detail route for campaign management while Unit 23 focuses on visual workflows and
            local state.
          </p>
          <Button asChild>
            <Link to={`/dashboard/campaigns/${id}/edit`}>
              <Edit3 className="h-4 w-4" />
              Edit Campaign
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
