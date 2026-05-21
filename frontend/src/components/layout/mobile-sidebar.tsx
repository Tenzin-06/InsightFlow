import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarItem } from "@/components/layout/sidebar-item";
import { mainNavRoutes, settingsRoute } from "@/routes/route-config";
import logoSrc from "@/assets/logo-bg.png";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5 text-text-secondary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-bg-primary border-r border-border-default">
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <div className="flex h-16 items-center gap-2.5 px-5">
          <img src={logoSrc} alt="InsightFlow logo" className="h-22 w-22 object-contain" />
          <span className="text-base font-bold tracking-tight text-text-primary">InsightFlow</span>
        </div>

        <div className="flex h-[calc(100%-4rem)] flex-col">
          <nav className="flex-1 space-y-0.5 px-3 py-4" aria-label="Mobile navigation">
            {mainNavRoutes.map((route) => (
              <SidebarItem key={route.path} {...route} onClick={() => setOpen(false)} />
            ))}
          </nav>
          <div className="border-t border-border-default px-3 py-4">
            <SidebarItem {...settingsRoute} onClick={() => setOpen(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
