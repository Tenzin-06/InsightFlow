import type { AxiosInstance } from "axios";
import type { ApiError } from "./types";

export function attachInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const normalized: ApiError = {
        message: error?.response?.data?.detail ?? error.message ?? "Unknown error",
        status: error?.response?.status,
      };

      if (normalized.status === 401) {
        // placeholder: redirect to login when auth is implemented
      }

      return Promise.reject(normalized);
    },
  );
}
