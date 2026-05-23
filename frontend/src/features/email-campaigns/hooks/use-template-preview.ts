import { useMemo } from "react";
import type { EmailCampaignDraft } from "@/features/email-campaigns/types";

export function useTemplatePreview(draft: EmailCampaignDraft) {
  return useMemo(
    () => ({
      hasSurveyLink: draft.bodyHtml.includes("{{survey_link}}"),
      hasConversationalLink: draft.bodyHtml.includes("{{conversation_link}}"),
      hasFirstName: draft.bodyHtml.includes("{{first_name}}"),
    }),
    [draft.bodyHtml]
  );
}
