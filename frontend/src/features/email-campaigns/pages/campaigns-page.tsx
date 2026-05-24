import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  MailPlus,
  FileText,
  Users,
  Calendar,
  ArrowRight,
  RefreshCw,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCampaigns } from "@/features/email-campaigns/services/campaign-api";
import type { BackendCampaign } from "@/features/email-campaigns/services/campaign-api";
import { cn } from "@/lib/utils";

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; classes: string }> = {
  draft:     { label: "Draft",     classes: "bg-[#F1F5F9] text-[#64748B]" },
  ready:     { label: "Ready",     classes: "bg-[#F0FDF4] text-[#16A34A]" },
  scheduled: { label: "Scheduled", classes: "bg-[#FFF7ED] text-[#EA580C]" },
  active:    { label: "Active",    classes: "bg-[#EEF4FF] text-[#2563EB]" },
  sending:   { label: "Sending",   classes: "bg-[#EEF4FF] text-[#2563EB]" },
  sent:      { label: "Sent",      classes: "bg-[#F0FDFA] text-[#0D9488]" },
  completed: { label: "Completed", classes: "bg-[#F0FDFA] text-[#0D9488]" },
  failed:    { label: "Failed",    classes: "bg-[#FEF2F2] text-[#DC2626]" },
  archived:  { label: "Archived",  classes: "bg-[#F8FAFC] text-[#94A3B8]" },
};

function StatusPill({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, classes: "bg-[#F1F5F9] text-[#64748B]" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", meta.classes)}>
      {meta.label}
    </span>
  );
}

// ── Campaign row ──────────────────────────────────────────────────────────────

function CampaignRow({ campaign }: { campaign: BackendCampaign }) {
  const createdDate = new Date(campaign.created_at).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
  const meta = campaign.metadata ?? {};

  return (
    <Link
      to={`/dashboard/campaigns/${campaign.id}`}
      className="group flex items-center gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors"
    >
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF]">
        <Send className="h-4 w-4 text-[#3B82F6]" />
      </div>

      {/* Title + subject */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
          {campaign.title}
        </p>
        <p className="truncate text-xs text-[#94A3B8]">
          {campaign.subject || "No subject line"}
        </p>
      </div>

      {/* Status */}
      <div className="hidden shrink-0 sm:block">
        <StatusPill status={campaign.status} />
      </div>

      {/* Audiences */}
      <div className="hidden shrink-0 items-center gap-1 md:flex">
        <Users className="h-3.5 w-3.5 text-[#94A3B8]" />
        <span className="text-xs text-[#475569]">{campaign.audiences.length} audience{campaign.audiences.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Responses */}
      <div className="hidden shrink-0 items-center gap-1 md:flex">
        <FileText className="h-3.5 w-3.5 text-[#94A3B8]" />
        <span className="text-xs text-[#475569]">{campaign.response_count ?? 0} responses</span>
      </div>

      {/* Date */}
      <div className="hidden shrink-0 items-center gap-1 lg:flex">
        <Calendar className="h-3.5 w-3.5 text-[#94A3B8]" />
        <span className="text-xs text-[#94A3B8]">
          {(meta.scheduleMode as string) === "scheduled" && meta.scheduledDate
            ? `Scheduled ${meta.scheduledDate as string}`
            : createdDate}
        </span>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-[#CBD5E1] transition-colors group-hover:text-[#3B82F6]" />
    </Link>
  );
}

function CampaignRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="hidden h-5 w-16 rounded-full sm:block" />
      <Skeleton className="hidden h-4 w-20 md:block" />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const { data: campaigns = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["campaigns"],
    queryFn: getCampaigns,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Email Campaigns</h1>
          <p className="text-sm text-[#94A3B8]">
            {isLoading ? "Loading…" : `${campaigns.length} campaign${campaigns.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button asChild className="bg-[#3B82F6] hover:bg-[#2563EB]">
          <Link to="/dashboard/campaigns/new">
            <MailPlus className="h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      {!isLoading && campaigns.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Total", value: campaigns.length, color: "text-[#0F172A]" },
            { label: "Drafts", value: campaigns.filter(c => c.status === "draft").length, color: "text-[#64748B]" },
            { label: "Scheduled", value: campaigns.filter(c => c.status === "scheduled").length, color: "text-[#EA580C]" },
            { label: "Sent", value: campaigns.filter(c => ["sent", "completed"].includes(c.status)).length, color: "text-[#0D9488]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-[#94A3B8]">{label}</p>
              <p className={cn("mt-1 text-2xl font-bold", color)}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        {/* Column headers */}
        {!isLoading && campaigns.length > 0 && (
          <div className="hidden items-center gap-4 border-b border-[#F1F5F9] bg-[#F8FAFC] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#94A3B8] sm:flex">
            <div className="w-9 shrink-0" />
            <div className="flex-1">Campaign</div>
            <div className="hidden w-20 shrink-0 sm:block">Status</div>
            <div className="hidden w-24 shrink-0 md:block">Audiences</div>
            <div className="hidden w-24 shrink-0 md:block">Responses</div>
            <div className="hidden w-28 shrink-0 lg:block">Date</div>
            <div className="w-4 shrink-0" />
          </div>
        )}

        {isLoading ? (
          <div className="divide-y divide-[#F1F5F9]">
            {Array.from({ length: 4 }).map((_, i) => <CampaignRowSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <p className="text-sm font-medium text-[#0F172A]">Could not load campaigns</p>
            <p className="text-xs text-[#94A3B8]">Make sure the backend server is running.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F5F9]">
              <Send className="h-6 w-6 text-[#94A3B8]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">No campaigns yet</p>
              <p className="mt-0.5 text-xs text-[#94A3B8]">
                Create a campaign to send survey invitations to your audiences.
              </p>
            </div>
            <Link
              to="/dashboard/campaigns/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B82F6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2563EB]"
            >
              <MailPlus className="h-3.5 w-3.5" />
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {campaigns.map((c) => <CampaignRow key={c.id} campaign={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
