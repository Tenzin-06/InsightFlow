import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type SidebarItemProps = {
  label: string;
  path: string;
  icon: LucideIcon;
  onClick?: () => void;
  children?: { label: string; path: string; icon: LucideIcon }[];
};

export function SidebarItem({ path, label, icon: Icon, onClick, children }: SidebarItemProps) {
  const location = useLocation();
  const hasChildren = children && children.length > 0;

  // Auto-expand when a child route is active
  const isChildActive = hasChildren
    ? children.some((c) => location.pathname === c.path || location.pathname.startsWith(c.path + "/"))
    : false;

  const [open, setOpen] = useState(isChildActive);

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
            isChildActive
              ? "bg-bg-secondary text-primary-600 shadow-sm"
              : "text-text-secondary hover:bg-bg-secondary/60 hover:text-text-primary"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 text-left">{label}</span>
          <ChevronDown
            className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="mt-0.5 ml-4 space-y-0.5 border-l border-border-soft pl-3">
            {children.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={onClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary-600 bg-primary-50"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60"
                  )
                }
              >
                <child.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={path}
      end
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
          isActive
            ? "bg-bg-secondary text-primary-600 shadow-sm"
            : "text-text-secondary hover:bg-bg-secondary/60 hover:text-text-primary"
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}
