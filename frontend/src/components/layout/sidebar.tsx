import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Send,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/surveys", label: "Surveys", icon: FileText },
  { to: "/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/campaigns", label: "Campaigns", icon: Send },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border-default bg-bg-secondary">
      <div className="flex h-16 items-center gap-2 border-b border-border-default px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-text-primary">InsightFlow</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-bg-selected text-primary-600"
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
