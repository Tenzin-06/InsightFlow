import type { Audience } from "@/features/audiences/types";
import type { Survey } from "@/features/surveys/types";
import type { EmailCampaignDraft } from "@/features/email-campaigns/types";
import { replaceVariables } from "@/features/email-campaigns/utils/variable-utils";

export function buildSurveyLink(survey?: Survey, mode: "standard" | "conversation" = "standard"): string {
  if (!survey) {
    return "{{survey_link}}";
  }

  const identifier = survey.slug || survey.id;
  return mode === "conversation" ? `/s/${identifier}/chat` : `/s/${identifier}`;
}

export function buildPreviewHtml(draft: EmailCampaignDraft, survey?: Survey): string {
  return replaceVariables(draft.bodyHtml, {
    first_name: "John",
    survey_link: buildSurveyLink(survey, "standard"),
    conversation_link: buildSurveyLink(survey, "conversation"),
    campaign_name: draft.name || "Student Outreach",
  });
}

export function getSelectedAudienceCount(audiences: Audience[], selectedIds: string[]): number {
  return audiences
    .filter((audience) => selectedIds.includes(String(audience.id)))
    .reduce((total, audience) => total + audience.recipient_count, 0);
}

export function formatAudienceDate(date: string): string {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(date)
  );
}
