import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

import brandImage from "@/assets/brand_image-bg.png";

export default function AuthenticationLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (isLoaded && isSignedIn) {
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
              You can sign in to access with your existing accounts
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
