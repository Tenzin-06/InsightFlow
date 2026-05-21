import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type SidebarItemProps = {
  label: string;
  path: string;
  icon: LucideIcon;
  onClick?: () => void;
};

export function SidebarItem({ path, label, icon: Icon, onClick }: SidebarItemProps) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
          isActive
            ? "bg-bg-selected text-primary-600 border-l-2 border-primary-500"
            : "text-text-secondary hover:bg-bg-hover hover:text-text-primary border-l-2 border-transparent"
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}
