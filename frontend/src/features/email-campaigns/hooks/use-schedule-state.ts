import type { EmailCampaignDraft, EmailCampaignValidationErrors } from "@/features/email-campaigns/types";

export function validateSchedule(draft: EmailCampaignDraft): Pick<EmailCampaignValidationErrors, "schedule"> {
  if (draft.scheduleMode === "scheduled" && (!draft.scheduledDate || !draft.scheduledTime)) {
    return { schedule: "Choose a date and time before scheduling." };
  }

  return {};
}
