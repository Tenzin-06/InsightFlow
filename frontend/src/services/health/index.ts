import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const getHealthStatus = async () => {
  const response = await apiClient.get(API_ENDPOINTS.health);
  return response.data;
};
