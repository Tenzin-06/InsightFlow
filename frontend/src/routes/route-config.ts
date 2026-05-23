import { LayoutDashboard, ClipboardList, BarChart3, Send, Settings, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type RouteConfig = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const mainNavRoutes: RouteConfig[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Surveys", path: "/surveys", icon: ClipboardList },
  { label: "Audiences", path: "/dashboard/audiences", icon: Users },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Campaigns", path: "/dashboard/campaigns", icon: Send },
];

export const settingsRoute: RouteConfig = {
  label: "Settings",
  path: "/settings",
  icon: Settings,
};

export const allDashboardRoutes: RouteConfig[] = [...mainNavRoutes, settingsRoute];
