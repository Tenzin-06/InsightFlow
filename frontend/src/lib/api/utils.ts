import { apiClient } from "./client";

export async function getRequest<T>(url: string): Promise<T> {
  const response = await apiClient.get<T>(url);
  return response.data;
}

export async function postRequest<T, B = unknown>(url: string, body: B): Promise<T> {
  const response = await apiClient.post<T>(url, body);
  return response.data;
}

export async function patchRequest<T, B = unknown>(url: string, body: B): Promise<T> {
  const response = await apiClient.patch<T>(url, body);
  return response.data;
}

export async function deleteRequest<T>(url: string): Promise<T> {
  const response = await apiClient.delete<T>(url);
  return response.data;
}
