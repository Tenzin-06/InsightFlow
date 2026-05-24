import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Mail, Users, Calendar, Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CampaignHeader } from "@/features/email-campaigns/components/campaign-header";
import { CampaignStatusBadge } from "@/features/email-campaigns/components/campaign-status-badge";
import { getCampaign } from "@/features/email-campaigns/services/campaign-api";

function CampaignDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-5">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CampaignDetailPage() {
  const { campaignId } = useParams<{ campaignId: string }>();

  const { data: campaign, isLoading, isError, refetch } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => getCampaign(campaignId!),
    enabled: !!campaignId,
  });

  if (isLoading) return (
    <div className="space-y-6">
      <CampaignHeader title="Campaign" subtitle="Loading…" status="draft" />
      <CampaignDetailSkeleton />
    </div>
  );

  if (isError || !campaign) return (
    <div className="space-y-6">
      <CampaignHeader title="Campaign" subtitle="Could not load campaign" status="draft" />
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-sm text-text-secondary mb-4">Failed to load campaign data.</p>
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const meta = campaign.metadata ?? {};
  const createdDate = new Date(campaign.created_at).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div className="space-y-6">
      <CampaignHeader
        title={campaign.title}
        subtitle={`Created ${createdDate} · Survey ID ${campaign.survey}`}
        status={campaign.status as never}
      />

      {/* Status + quick actions */}
      <div className="flex flex-wrap items-center gap-3">
        <CampaignStatusBadge status={campaign.status as never} />
        <div className="flex gap-2">
          <Button type="button" variant="outline" asChild>
            <Link to={`/dashboard/analytics/campaigns/${campaign.id}`}>
              <BarChart3 className="h-4 w-4 mr-1.5" />
              View Analytics
            </Link>
          </Button>
          {(campaign.status === "draft") && (
            <Button type="button" asChild>
              <Link to={`/dashboard/campaigns/new`}>
                <Mail className="h-4 w-4 mr-1.5" />
                Edit Campaign
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Key info cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] mb-2">
            <Users className="h-4 w-4 text-[#3B82F6]" />
            Audiences
          </div>
          <p className="text-3xl font-bold text-[#0F172A]">{campaign.audiences.length}</p>
          <p className="text-xs text-[#94A3B8]">audience groups selected</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] mb-2">
            <Send className="h-4 w-4 text-[#14B8A6]" />
            Responses
          </div>
          <p className="text-3xl font-bold text-[#0F172A]">{campaign.response_count ?? 0}</p>
          <p className="text-xs text-[#94A3B8]">survey responses collected</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] mb-2">
            <Calendar className="h-4 w-4 text-[#F97316]" />
            Delivery
          </div>
          <p className="text-sm font-semibold text-[#0F172A]">
            {(meta.scheduleMode as string) === "scheduled" && meta.scheduledDate
              ? `${meta.scheduledDate as string} at ${(meta.scheduledTime as string) || "—"}`
              : "Immediate"}
          </p>
          <p className="text-xs text-[#94A3B8]">scheduled delivery</p>
        </div>
      </div>

      {/* Campaign details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide mb-1">Subject Line</p>
              <p className="text-[#0F172A]">{campaign.subject || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide mb-1">Template</p>
              <p className="text-[#0F172A]">{campaign.template_name}</p>
            </div>
            {(meta.senderName as string) && (
              <div>
                <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide mb-1">Sender Name</p>
                <p className="text-[#0F172A]">{meta.senderName as string}</p>
              </div>
            )}
            {(meta.replyTo as string) && (
              <div>
                <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide mb-1">Reply To</p>
                <p className="text-[#0F172A]">{meta.replyTo as string}</p>
              </div>
            )}
          </div>
          {(meta.internalNotes as string) && (
            <div>
              <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide mb-1">Internal Notes</p>
              <p className="text-[#0F172A]">{meta.internalNotes as string}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next step hint for draft campaigns */}
      {campaign.status === "draft" && (
        <div className="rounded-xl border border-[#C7DDFF] bg-[#EEF4FF] p-4">
          <p className="text-sm font-semibold text-[#1D4ED8]">Ready to send?</p>
          <p className="mt-1 text-xs text-[#475569]">
            Use the <strong>Send</strong> endpoint (<code>POST /api/v1/campaigns/{campaign.id}/send/</code>) to trigger email delivery, or visit the campaign from the Campaigns list.
          </p>
        </div>
      )}
    </div>
  );
}
