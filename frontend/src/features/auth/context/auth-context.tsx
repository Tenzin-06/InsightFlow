import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { loginApi, registerApi } from "@/features/auth/services/auth-api";
import type { AuthUser } from "@/features/auth/services/auth-api";

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------
const ACCESS_TOKEN_KEY = "insightflow_access";
const REFRESH_TOKEN_KEY = "insightflow_refresh";
const USER_KEY = "insightflow_user";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  /** true only during the initial localStorage hydration */
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      const userJson = localStorage.getItem(USER_KEY);
      if (token && userJson) {
        const user: AuthUser = JSON.parse(userJson);
        setState({ user, accessToken: token, isAuthenticated: true, isLoading: false });
        return;
      }
    } catch {
      // corrupted storage — clear it
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setState((s) => ({ ...s, isLoading: false }));
  }, []);

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  const persist = useCallback((user: AuthUser, access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState({ user, accessToken: access, isAuthenticated: true, isLoading: false });
  }, []);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
  const login = useCallback(
    async (email: string, password: string) => {
      const { user, access, refresh } = await loginApi(email, password);
      persist(user, access, refresh);
    },
    [persist],
  );

  const register = useCallback(
    async (email: string, password: string, fullName = "") => {
      const { user, access, refresh } = await registerApi(email, password, fullName);
      persist(user, access, refresh);
    },
    [persist],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  // ------------------------------------------------------------------
  // Context value (stable reference)
  // ------------------------------------------------------------------
  const value = useMemo(
    () => ({ ...state, login, register, logout }),
    [state, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// Expose the storage key so the interceptor can read the token directly
export { ACCESS_TOKEN_KEY };
