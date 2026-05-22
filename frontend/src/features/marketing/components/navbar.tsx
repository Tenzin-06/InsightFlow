import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/features/marketing/components/mobile-nav";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo-bg.png";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border bg-background/95 shadow-sm backdrop-blur-sm"
          : "bg-background"
      )}
      role="banner"
    >
      <nav
        className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="InsightFlow home"
        >
          <img
            src={logoSrc}
            alt=""
            className="h-[100px] w-[100px] object-contain transition-transform duration-200 hover:scale-105"
          />
          <span className="text-xl font-bold tracking-tight text-foreground transition-colors duration-200 hover:text-primary-500">
            InsightFlow
          </span>
        </Link>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm" className="text-sm font-medium">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="px-5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
