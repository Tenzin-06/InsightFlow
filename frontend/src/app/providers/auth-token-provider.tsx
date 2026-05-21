import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { setTokenGetter } from "@/lib/api/interceptors";

export function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return <>{children}</>;
}
