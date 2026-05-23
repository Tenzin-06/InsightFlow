import { useMemo, useState } from "react";
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
import { getTemplateHtml } from "@/features/email-campaigns/utils/template-utils";
import { getSelectedAudienceCount } from "@/features/email-campaigns/utils/preview-utils";
import { validateSchedule } from "@/features/email-campaigns/hooks/use-schedule-state";

export function useCampaignForm(surveys: Survey[], audiences: Audience[]) {
  const [draft, setDraft] = useState<EmailCampaignDraft>(DEFAULT_CAMPAIGN_DRAFT);
  const [errors, setErrors] = useState<EmailCampaignValidationErrors>({});

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

  function saveDraft() {
    updateDraft({ status: "draft" });
    setErrors({});
    toast.success("Draft saved locally");
  }

  function markReady(status: CampaignStatus) {
    if (!validate(status)) {
      toast.error("Resolve the highlighted fields before continuing");
      return false;
    }

    updateDraft({ status });
    toast.success(status === "scheduled" ? "Campaign schedule prepared" : "Campaign ready for review");
    return true;
  }

  return {
    draft,
    errors,
    selectedSurvey,
    selectedRecipientCount,
    updateDraft,
    applyTemplate,
    saveDraft,
    markReady,
  };
}
