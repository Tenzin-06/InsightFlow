import axios from "axios";
import { API_CONFIG } from "@/lib/api/config";
import type { ApiResponse } from "@/lib/api/types";
import type { ShareMetadata } from "../types";

const sharingClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: { "Content-Type": "application/json" },
});

sharingClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string =
      error?.response?.data?.error?.message ??
      error?.message ??
      "Unknown error";
    return Promise.reject({ message, status: error?.response?.status });
  }
);

export async function getSurveyShareMetadata(slug: string): Promise<ShareMetadata> {
  const res = await sharingClient.get<ApiResponse<ShareMetadata>>(
    `/sharing/surveys/${slug}/`
  );
  return res.data.data;
}
