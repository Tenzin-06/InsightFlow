import type { Audience } from "@/features/audiences/types";
import type { Survey } from "@/features/surveys/types";

export type CampaignStatus = "draft" | "ready" | "scheduled" | "sent";

export type ScheduleMode = "now" | "scheduled";

export type PreviewMode = "desktop" | "mobile";

export type EmailTemplateKey = "minimal_invite" | "academic_survey" | "reminder_placeholder";

export type PersonalizationVariable = {
  key: string;
  label: string;
  example: string;
};

export type EmailCampaignDraft = {
  name: string;
  surveyId: string;
  audienceIds: string[];
  subject: string;
  previewText: string;
  internalNotes: string;
  senderName: string;
  replyTo: string;
  templateKey: EmailTemplateKey;
  bodyHtml: string;
  scheduleMode: ScheduleMode;
  scheduledDate: string;
  scheduledTime: string;
  status: CampaignStatus;
};

export type EmailCampaignValidationErrors = Partial<
  Record<"name" | "surveyId" | "audienceIds" | "subject" | "schedule", string>
>;

export type CampaignOptionData = {
  surveys: Survey[];
  audiences: Audience[];
};
