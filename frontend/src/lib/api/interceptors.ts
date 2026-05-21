import type { AxiosInstance } from "axios";
import type { ApiError } from "./types";

let tokenGetter: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>): void {
  tokenGetter = fn;
}

export function attachInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(
    async (config) => {
      if (tokenGetter) {
        const token = await tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const normalized: ApiError = {
        message: error?.response?.data?.detail ?? error?.message ?? "Unknown error",
        status: error?.response?.status,
      };
      return Promise.reject(normalized);
    },
  );
}
