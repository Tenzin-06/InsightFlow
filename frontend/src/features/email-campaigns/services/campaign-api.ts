import { getRequest, postRequest, patchRequest } from "@/lib/api/utils";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getAudiences } from "@/features/audiences/services/audience-api";
import { getSurveys } from "@/features/surveys/services/survey-api";
import type { ApiResponse } from "@/lib/api/types";
import type { CampaignOptionData, EmailCampaignDraft } from "@/features/email-campaigns/types";

// ── Option data for the create form ──────────────────────────────────────────

export async function getCampaignOptions(): Promise<CampaignOptionData> {
  const [surveys, audiences] = await Promise.all([getSurveys(), getAudiences()]);
  return { surveys, audiences };
}

// ── Shape returned by the backend ─────────────────────────────────────────────

export type BackendCampaign = {
  id: number;
  title: string;
  description: string;
  subject: string;
  template_name: string;
  survey: number;
  status: string;
  audiences: number[];
  metadata: Record<string, unknown>;
  response_count: number;
  created_at: string;
  updated_at: string;
};

// ── Template key mapping (frontend → backend choices) ────────────────────────

const TEMPLATE_KEY_MAP: Record<string, string> = {
  minimal_invite: "survey_invitation",
  academic_survey: "survey_invitation",
  reminder_placeholder: "reminder_email",
  // Pass-through if already a backend key
  survey_invitation: "survey_invitation",
  reminder_email: "reminder_email",
  test_email: "test_email",
};

// ── Map frontend draft → backend payload ──────────────────────────────────────

function draftToPayload(draft: EmailCampaignDraft, status: string = "draft") {
  return {
    title: draft.name,
    subject: draft.subject,
    template_name: TEMPLATE_KEY_MAP[draft.templateKey] ?? "survey_invitation",
    survey: draft.surveyId ? Number(draft.surveyId) : undefined,
    audiences: draft.audienceIds.map(Number),
    status,
    metadata: {
      bodyHtml: draft.bodyHtml,
      senderName: draft.senderName,
      replyTo: draft.replyTo,
      previewText: draft.previewText,
      internalNotes: draft.internalNotes,
      scheduleMode: draft.scheduleMode,
      scheduledDate: draft.scheduledDate,
      scheduledTime: draft.scheduledTime,
    },
  };
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function getCampaigns(): Promise<BackendCampaign[]> {
  const res = await getRequest<ApiResponse<BackendCampaign[]>>(API_ENDPOINTS.campaigns.list);
  return res.data;
}

export async function getCampaign(id: number | string): Promise<BackendCampaign> {
  const res = await getRequest<ApiResponse<BackendCampaign>>(API_ENDPOINTS.campaigns.detail(String(id)));
  return res.data;
}

export async function createCampaign(
  draft: EmailCampaignDraft,
  status: string = "draft"
): Promise<BackendCampaign> {
  const res = await postRequest<ApiResponse<BackendCampaign>>(
    API_ENDPOINTS.campaigns.list,
    draftToPayload(draft, status)
  );
  return res.data;
}

export async function updateCampaign(
  id: number | string,
  draft: EmailCampaignDraft,
  status: string = "draft"
): Promise<BackendCampaign> {
  const res = await patchRequest<ApiResponse<BackendCampaign>>(
    API_ENDPOINTS.campaigns.detail(String(id)),
    draftToPayload(draft, status)
  );
  return res.data;
}

// ── Send test email ───────────────────────────────────────────────────────────

export async function sendTestEmail(
  campaignId: number | string,
  email: string
): Promise<{ job_id: string; email: string }> {
  const res = await postRequest<ApiResponse<{ job_id: string; email: string }>>(
    API_ENDPOINTS.campaigns.test(campaignId),
    { email }
  );
  return res.data;
}
