import { useQuery } from "@tanstack/react-query";
import { CampaignForm } from "@/features/email-campaigns/components/campaign-form";
import { CampaignHeader } from "@/features/email-campaigns/components/campaign-header";
import { CampaignPreview } from "@/features/email-campaigns/components/campaign-preview";
import { CampaignSidebar } from "@/features/email-campaigns/components/campaign-sidebar";
import { AudienceSelector } from "@/features/email-campaigns/components/audience-selector";
import { LoadingState } from "@/features/email-campaigns/components/loading-state";
import { SchedulePanel } from "@/features/email-campaigns/components/schedule-panel";
import { SendActions } from "@/features/email-campaigns/components/send-actions";
import { SenderSettings } from "@/features/email-campaigns/components/sender-settings";
import { SubjectLineInput } from "@/features/email-campaigns/components/subject-line-input";
import { TemplateEditor } from "@/features/email-campaigns/components/template-editor";
import { useCampaignForm } from "@/features/email-campaigns/hooks/use-campaign-form";
import { getCampaignOptions } from "@/features/email-campaigns/services/campaign-api";

function CreateCampaignContent() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["email-campaign-options"],
    queryFn: getCampaignOptions,
  });

  const options = data ?? { surveys: [], audiences: [] };
  const form = useCampaignForm(options.surveys, options.audiences);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-danger/30 bg-bg-secondary p-6">
        <h2 className="text-base font-semibold text-text-primary">Unable to load campaign setup data</h2>
        <p className="mt-1 text-sm text-text-secondary">Preserve your draft and retry loading surveys or audiences.</p>
        <button type="button" onClick={() => void refetch()} className="mt-4 text-sm font-medium text-primary-600">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-6">
        <CampaignForm
          draft={form.draft}
          surveys={options.surveys}
          errors={form.errors}
          onChange={form.updateDraft}
        />
        <AudienceSelector
          audiences={options.audiences}
          selectedIds={form.draft.audienceIds}
          error={form.errors.audienceIds}
          onChange={(audienceIds) => form.updateDraft({ audienceIds })}
        />
        <SenderSettings draft={form.draft} onChange={form.updateDraft} />
        <SubjectLineInput draft={form.draft} error={form.errors.subject} onChange={form.updateDraft} />
        <TemplateEditor draft={form.draft} onChange={form.updateDraft} onTemplateChange={form.applyTemplate} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <SchedulePanel draft={form.draft} error={form.errors.schedule} onChange={form.updateDraft} />
          <CampaignPreview draft={form.draft} survey={form.selectedSurvey} />
        </div>
        <SendActions
          draft={form.draft}
          survey={form.selectedSurvey}
          onSaveDraft={form.saveDraft}
          onPrepare={() => form.markReady("ready")}
          onSchedule={() => form.markReady("scheduled")}
          onSendTest={form.sendTest}
          isSaving={form.isSaving}
          isPreparing={form.isPreparing}
          isSendingTest={form.isSendingTest}
        />
      </div>
      <aside className="hidden xl:block">
        <CampaignSidebar draft={form.draft} recipientCount={form.selectedRecipientCount} />
      </aside>
    </div>
  );
}

export default function CreateCampaignPage() {
  return (
    <div className="space-y-6">
      <CampaignHeader
        title="Create Email Campaign"
        subtitle="Configure audience targeting, compose the invitation, and prepare delivery."
        status="draft"
      />
      <CreateCampaignContent />
    </div>
  );
}
