import { useEffect } from "react";

import { ACCESS_TOKEN_KEY, useAuth } from "@/features/auth/context/auth-context";
import { setTokenGetter } from "@/lib/api/interceptors";

/**
 * Bridges the auth context's access token into the Axios request interceptor.
 * Re-registers the getter whenever the token changes (login / logout / refresh).
 */
export function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();

  useEffect(() => {
    setTokenGetter(async () => localStorage.getItem(ACCESS_TOKEN_KEY));
  }, [accessToken]);

  return <>{children}</>;
}
