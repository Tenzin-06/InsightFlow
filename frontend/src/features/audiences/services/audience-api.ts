import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "@/lib/api/utils";
import type { ApiResponse } from "@/lib/api/types";
import type {
  Audience,
  AudienceRecipientPage,
  CreateAudiencePayload,
  UpdateAudiencePayload,
  UploadContactsPayload,
  UploadSummary,
} from "@/features/audiences/types";

export async function getAudiences(): Promise<Audience[]> {
  const res = await getRequest<ApiResponse<Audience[]>>(API_ENDPOINTS.audiences.list);
  return res.data;
}

export async function getAudienceById(id: string): Promise<Audience> {
  const res = await getRequest<ApiResponse<Audience>>(API_ENDPOINTS.audiences.detail(id));
  return res.data;
}

export async function createAudience(payload: CreateAudiencePayload): Promise<Audience> {
  const res = await postRequest<ApiResponse<Audience>, CreateAudiencePayload>(
    API_ENDPOINTS.audiences.list,
    payload
  );
  return res.data;
}

export async function updateAudience(
  id: string,
  payload: UpdateAudiencePayload
): Promise<Audience> {
  const res = await patchRequest<ApiResponse<Audience>, UpdateAudiencePayload>(
    API_ENDPOINTS.audiences.detail(id),
    payload
  );
  return res.data;
}

export async function deleteAudience(id: string): Promise<void> {
  await deleteRequest(API_ENDPOINTS.audiences.detail(id));
}

/**
 * Upload a batch of contacts to an audience.
 * Returns an upload summary: { uploaded, duplicates, invalid }.
 */
export async function uploadAudienceContacts(
  audienceId: string,
  payload: UploadContactsPayload
): Promise<UploadSummary> {
  const res = await postRequest<ApiResponse<UploadSummary>, UploadContactsPayload>(
    API_ENDPOINTS.audiences.upload(audienceId),
    payload
  );
  return res.data;
}

/**
 * Fetch recipients for an audience with optional search and pagination.
 */
export async function getAudienceRecipients(
  audienceId: string,
  params?: { q?: string; limit?: number; offset?: number }
): Promise<AudienceRecipientPage> {
  const url = API_ENDPOINTS.audiences.recipients(audienceId);
  const searchParams = new URLSearchParams();
  if (params?.q) searchParams.set("q", params.q);
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params?.offset !== undefined) searchParams.set("offset", String(params.offset));

  const queryString = searchParams.toString();
  const res = await getRequest<ApiResponse<AudienceRecipientPage>>(
    queryString ? `${url}?${queryString}` : url
  );
  return res.data;
}
