import logoSrc from "@/assets/logo-bg.png";
import { mainNavRoutes, settingsRoute } from "@/routes/route-config";
import { SidebarItem } from "@/components/layout/sidebar-item";

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border-default bg-bg-primary">
      <div className="flex h-16 items-center gap-2 px-4">
        <img src={logoSrc} alt="InsightFlow logo" className="h-22 w-22 object-contain" />
        <span className="text-base font-bold tracking-tight text-text-primary">InsightFlow</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4" aria-label="Main navigation">
        {mainNavRoutes.map((route) => (
          <SidebarItem key={route.path} {...route} />
        ))}
      </nav>

      <div className="border-t border-border-default px-3 py-4">
        <SidebarItem {...settingsRoute} />
      </div>
    </aside>
  );
}
