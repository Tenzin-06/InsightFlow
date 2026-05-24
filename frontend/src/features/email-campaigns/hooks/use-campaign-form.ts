import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/** Pull the most useful message out of an Axios/DRF error response. */
function extractErrorMessage(error: unknown, fallback: string): string {
  const e = error as { response?: { data?: { error?: { message?: string } | string; detail?: string } }; message?: string } | null;
  if (!e) return fallback;
  const data = e.response?.data;
  if (data) {
    if (typeof data.error === "string") return data.error;
    if (typeof data.error?.message === "string") return data.error.message;
    if (typeof data.detail === "string") return data.detail;
    // DRF field errors: { field: ["msg"] }
    const fieldErrors = Object.values(data as Record<string, unknown>).flat();
    if (fieldErrors.length) return String(fieldErrors[0]);
  }
  return e.message ?? fallback;
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Audience } from "@/features/audiences/types";
import type { Survey } from "@/features/surveys/types";
import { DEFAULT_CAMPAIGN_DRAFT } from "@/features/email-campaigns/constants";
import type {
  CampaignStatus,
  EmailCampaignDraft,
  EmailCampaignValidationErrors,
  EmailTemplateKey,
} from "@/features/email-campaigns/types";
import {
  createCampaign,
  updateCampaign,
  sendTestEmail,
} from "@/features/email-campaigns/services/campaign-api";
import { getTemplateHtml } from "@/features/email-campaigns/utils/template-utils";
import { getSelectedAudienceCount } from "@/features/email-campaigns/utils/preview-utils";
import { validateSchedule } from "@/features/email-campaigns/hooks/use-schedule-state";

export function useCampaignForm(surveys: Survey[], audiences: Audience[]) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState<EmailCampaignDraft>(DEFAULT_CAMPAIGN_DRAFT);
  const [errors, setErrors] = useState<EmailCampaignValidationErrors>({});
  // Track the saved campaign ID (set after first POST)
  const [savedCampaignId, setSavedCampaignId] = useState<number | null>(null);

  const selectedSurvey = useMemo(
    () => surveys.find((survey) => String(survey.id) === draft.surveyId),
    [draft.surveyId, surveys]
  );

  const selectedRecipientCount = useMemo(
    () => getSelectedAudienceCount(audiences, draft.audienceIds),
    [audiences, draft.audienceIds]
  );

  function updateDraft(patch: Partial<EmailCampaignDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function applyTemplate(templateKey: EmailTemplateKey) {
    updateDraft({ templateKey, bodyHtml: getTemplateHtml(templateKey) });
  }

  function validate(nextStatus: CampaignStatus = "ready") {
    const nextErrors: EmailCampaignValidationErrors = {};

    if (!draft.name.trim()) {
      nextErrors.name = "Campaign name is required.";
    }
    if (!draft.surveyId) {
      nextErrors.surveyId = "Select a survey.";
    }
    if (draft.audienceIds.length === 0) {
      nextErrors.audienceIds = "Select at least one audience.";
    }
    if (!draft.subject.trim()) {
      nextErrors.subject = "Subject line is required.";
    }

    Object.assign(nextErrors, nextStatus === "scheduled" ? validateSchedule(draft) : {});
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  // ── Save Draft mutation ─────────────────────────────────────────────────────

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (savedCampaignId) {
        return updateCampaign(savedCampaignId, draft, "draft");
      }
      return createCampaign(draft, "draft");
    },
    onSuccess: (campaign) => {
      setSavedCampaignId(campaign.id);
      setDraft((d) => ({ ...d, status: "draft" }));
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Draft saved");
      navigate("/dashboard/campaigns");
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error, "Failed to save draft");
      toast.error(msg);
    },
  });

  // ── Prepare / Schedule mutation ────────────────────────────────────────────

  const prepareMutation = useMutation({
    mutationFn: async (status: "draft" | "scheduled") => {
      if (savedCampaignId) {
        return updateCampaign(savedCampaignId, draft, status);
      }
      return createCampaign(draft, status);
    },
    onSuccess: (campaign, status) => {
      setSavedCampaignId(campaign.id);
      setDraft((d) => ({ ...d, status: status === "scheduled" ? "scheduled" : "ready" }));
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success(
        status === "scheduled"
          ? "Campaign scheduled — ready to send"
          : "Campaign saved — review and send from the campaign page"
      );
      navigate(`/dashboard/campaigns/${campaign.id}`);
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error, "Failed to prepare campaign");
      toast.error(msg);
    },
  });

  // ── Test email mutation ────────────────────────────────────────────────────

  const testMutation = useMutation({
    mutationFn: async (testEmail: string) => {
      // Ensure campaign is saved first
      let campaignId = savedCampaignId;
      if (!campaignId) {
        const campaign = await createCampaign(draft, "draft");
        campaignId = campaign.id;
        setSavedCampaignId(campaign.id);
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      }
      return sendTestEmail(campaignId, testEmail);
    },
    onSuccess: (data) => {
      toast.success(`Test email sent to ${data.email}`);
    },
    onError: (error: unknown) => {
      const msg = extractErrorMessage(error, "Failed to send test email");
      toast.error(msg);
    },
  });

  // ── Public API ────────────────────────────────────────────────────────────

  function saveDraft() {
    const nextErrors: EmailCampaignValidationErrors = {};
    if (!draft.name.trim()) nextErrors.name = "Campaign name is required.";
    if (!draft.surveyId) nextErrors.surveyId = "Select a survey before saving.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Fill in the campaign name and select a survey to save.");
      return;
    }
    saveMutation.mutate();
  }

  function markReady(status: CampaignStatus) {
    const backendStatus = status === "scheduled" ? "scheduled" : "draft";
    if (!validate(status)) {
      toast.error("Resolve the highlighted fields before continuing");
      return false;
    }
    prepareMutation.mutate(backendStatus);
    return true;
  }

  function sendTest(testEmail: string) {
    if (!testEmail.trim()) {
      toast.error("Enter a valid email address for the test");
      return;
    }
    testMutation.mutate(testEmail);
  }

  return {
    draft,
    errors,
    selectedSurvey,
    selectedRecipientCount,
    savedCampaignId,
    isSaving: saveMutation.isPending,
    isPreparing: prepareMutation.isPending,
    isSendingTest: testMutation.isPending,
    updateDraft,
    applyTemplate,
    saveDraft,
    markReady,
    sendTest,
  };
}
