import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import logoSrc from "@/assets/logo-bg.png";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Analytics", href: "#analytics" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function handleNavClick(href: string) {
    setOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-background">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <img src={logoSrc} alt="" className="h-7 w-7 object-contain" />
            <span className="text-base font-bold tracking-tight text-foreground">InsightFlow</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.label}>
              <a
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            </SheetClose>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
          <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="w-full" onClick={() => setOpen(false)}>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
