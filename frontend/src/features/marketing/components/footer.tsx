import { Link } from "react-router-dom";
import { Code2, Briefcase, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import logoSrc from "@/assets/logo-bg.png";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Analytics", href: "#analytics" },
];

const authLinks = [
  { label: "Log in", to: "/login" },
  { label: "Get Started", to: "/register" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "#" },
  { label: "Terms of Service", to: "#" },
];

const socialLinks = [
  { label: "GitHub", href: "#", icon: Code2 },
  { label: "LinkedIn", href: "#", icon: Briefcase },
  { label: "Twitter / X", href: "#", icon: MessageCircle },
];

function scrollTo(href: string) {
  if (href.startsWith("#")) {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }
}

export function Footer() {
  return (
    <footer className="bg-background" role="contentinfo">
      <Separator />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Branding */}
            <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
              <Link
                to="/"
                className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="InsightFlow home"
              >
                <img src={logoSrc} alt="" className="h-[100px] w-[100px] object-contain" />
                <span className="text-lg font-bold tracking-tight text-foreground">InsightFlow</span>
              </Link>
              <p className="max-w-xs text-base leading-relaxed text-foreground">
                AI-powered survey intelligence and distribution platform built for modern research
                teams, analysts, and organizations.
              </p>
            </div>

            {/* Navigation */}
            <nav aria-label="Footer navigation">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Product
              </p>
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(link.href);
                      }}
                      className="text-base text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {authLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-base text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Legal */}
            <nav aria-label="Legal links">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Legal
              </p>
              <ul className="flex flex-col gap-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-base text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social */}
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Connect
              </p>
              <ul className="flex flex-col gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className="inline-flex items-center gap-2 text-base text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-base text-foreground">
            &copy; {new Date().getFullYear()} InsightFlow. All rights reserved.
          </p>
          <p className="text-sm text-foreground">
            AI-Powered Survey Intelligence Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
