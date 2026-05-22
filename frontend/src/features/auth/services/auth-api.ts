import { apiClient } from "@/lib/api/client";

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: AuthUser;
  access: string;
  refresh: string;
}

// POST /api/v1/auth/register/
export async function registerApi(
  email: string,
  password: string,
  fullName = "",
): Promise<AuthResponse> {
  const res = await apiClient.post<{ success: boolean; data: AuthResponse }>(
    "/auth/register/",
    { email, password, full_name: fullName },
  );
  return res.data.data;
}

// POST /api/v1/auth/login/
export async function loginApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await apiClient.post<{ success: boolean; data: AuthResponse }>(
    "/auth/login/",
    { email, password },
  );
  return res.data.data;
}

// POST /api/v1/auth/token/refresh/
export async function refreshTokenApi(
  refresh: string,
): Promise<AuthTokens> {
  const res = await apiClient.post<{ success: boolean; data: AuthTokens }>(
    "/auth/token/refresh/",
    { refresh },
  );
  return res.data.data;
}
