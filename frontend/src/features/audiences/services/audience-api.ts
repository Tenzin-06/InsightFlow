import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getRequest, patchRequest, postRequest } from "@/lib/api/utils";
import type { ApiResponse } from "@/lib/api/types";
import type {
  Audience,
  CreateAudiencePayload,
  UpdateAudiencePayload,
  UploadContactsPayload,
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

export async function updateAudience(id: string, payload: UpdateAudiencePayload): Promise<Audience> {
  const res = await patchRequest<ApiResponse<Audience>, UpdateAudiencePayload>(
    API_ENDPOINTS.audiences.detail(id),
    payload
  );
  return res.data;
}

export async function uploadAudienceContacts(
  audienceId: string,
  payload: UploadContactsPayload
): Promise<Audience> {
  const res = await postRequest<ApiResponse<Audience>, UploadContactsPayload>(
    API_ENDPOINTS.audiences.upload(audienceId),
    payload
  );
  return res.data;
}
