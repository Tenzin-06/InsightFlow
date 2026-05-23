import type {
  EmailCampaignDraft,
  EmailTemplateKey,
  PersonalizationVariable,
} from "@/features/email-campaigns/types";

export const SUBJECT_RECOMMENDED_MAX = 60;

export const PERSONALIZATION_VARIABLES: PersonalizationVariable[] = [
  { key: "first_name", label: "First name", example: "John" },
  { key: "survey_link", label: "Standard survey link", example: "https://app.insightflow.ai/s/123" },
  {
    key: "conversation_link",
    label: "Conversational survey link",
    example: "https://app.insightflow.ai/s/123/chat",
  },
  { key: "campaign_name", label: "Campaign name", example: "Student Outreach" },
];

export const TEMPLATE_LABELS: Record<EmailTemplateKey, string> = {
  minimal_invite: "Minimal Invite",
  academic_survey: "Academic Survey",
  reminder_placeholder: "Reminder Layout",
};

export const TEMPLATE_DESCRIPTIONS: Record<EmailTemplateKey, string> = {
  minimal_invite: "Short, direct survey invitation for broad outreach.",
  academic_survey: "Formal structure for university and research campaigns.",
  reminder_placeholder: "Placeholder layout for future reminder workflows.",
};

export const TEMPLATE_HTML: Record<EmailTemplateKey, string> = {
  minimal_invite:
    "<h2>You are invited to share your feedback</h2><p>Hello {{first_name}},</p><p>We are running {{campaign_name}} and would appreciate your response.</p><p><a href=\"{{survey_link}}\">Start the survey</a></p><p>Thank you for your time.</p>",
  academic_survey:
    "<h2>Research Survey Invitation</h2><p>Dear {{first_name}},</p><p>You are invited to participate in {{campaign_name}}. Your input will help us better understand the research topic and improve future decisions.</p><p>Please use this link to begin: <a href=\"{{survey_link}}\">Open survey</a></p><p>If you prefer a guided experience, use <a href=\"{{conversation_link}}\">the conversational survey</a>.</p><p>Thank you for contributing to this study.</p>",
  reminder_placeholder:
    "<h2>Survey Reminder</h2><p>Hello {{first_name}},</p><p>This is a reminder placeholder for {{campaign_name}}. Reminder delivery logic will be added in a future unit.</p><p><a href=\"{{survey_link}}\">Continue to survey</a></p>",
};

export const DEFAULT_CAMPAIGN_DRAFT: EmailCampaignDraft = {
  name: "",
  surveyId: "",
  audienceIds: [],
  subject: "",
  previewText: "",
  internalNotes: "",
  senderName: "InsightFlow Research Team",
  replyTo: "",
  templateKey: "minimal_invite",
  bodyHtml: TEMPLATE_HTML.minimal_invite,
  scheduleMode: "now",
  scheduledDate: "",
  scheduledTime: "",
  status: "draft",
};
