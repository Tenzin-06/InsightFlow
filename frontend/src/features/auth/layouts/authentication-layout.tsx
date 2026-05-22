import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/context/auth-context";
import brandImage from "@/assets/brand_image-bg.png";

export default function AuthenticationLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-16 py-12 bg-[#EEF4FF]">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-bold text-text-primary">Welcome!</h2>
            <p className="text-sm text-text-secondary">
              You can sign in to access with your existing account
            </p>
          </div>
          <img
            src={brandImage}
            alt="InsightFlow brand illustration"
            className="w-full max-w-sm mx-auto drop-shadow-sm"
          />
          <h3 className="text-xl font-bold text-text-primary leading-snug text-center">
            Smarter Surveys. Better Insights.
          </h3>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <Outlet />
      </div>
    </div>
  );
}
