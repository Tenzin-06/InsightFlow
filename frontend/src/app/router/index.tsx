import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PublicLayout from "@/app/layouts/public-layout";
import DashboardLayout from "@/app/layouts/dashboard-layout";
import AuthenticationLayout from "@/features/auth/layouts/authentication-layout";

const LandingPage = lazy(() => import("@/features/marketing/pages/landing-page"));
const LoginPage = lazy(() => import("@/features/auth/pages/login-page"));
const RegisterPage = lazy(() => import("@/features/auth/pages/register-page"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/dashboard-page"));
const SurveysPage = lazy(() => import("@/features/surveys/pages/surveys-page"));
const AnalyticsPage = lazy(() => import("@/features/analytics/pages/analytics-page"));
const CampaignsPage = lazy(() => import("@/features/campaigns/pages/campaigns-page"));
const SettingsPage = lazy(() => import("@/features/dashboard/pages/settings-page"));

const PageLoader = () => (
  <div role="status" aria-live="polite" className="flex h-screen items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" aria-hidden="true" />
    <span className="sr-only">Loading…</span>
  </div>
);

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ path: "/", element: <LandingPage /> }],
  },
  {
    element: <AuthenticationLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/surveys", element: <SurveysPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
      { path: "/campaigns", element: <CampaignsPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
