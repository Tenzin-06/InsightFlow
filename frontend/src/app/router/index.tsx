import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PublicLayout from "@/app/layouts/public-layout";
import DashboardLayout from "@/app/layouts/dashboard-layout";
import AuthenticationLayout from "@/features/auth/layouts/authentication-layout";
import { ProtectedRoute } from "@/routes/protected-route";

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
    children: [{ path: "/", element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense> }],
  },
  {
    element: <AuthenticationLayout />,
    children: [
      { path: "/login", element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: "/register", element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
          { path: "/surveys", element: <Suspense fallback={<PageLoader />}><SurveysPage /></Suspense> },
          { path: "/analytics", element: <Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense> },
          { path: "/campaigns", element: <Suspense fallback={<PageLoader />}><CampaignsPage /></Suspense> },
          { path: "/settings", element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
