import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";
import { cn } from "@/lib/utils";

type CTAVariant = "mid" | "final";

type CTASectionProps = {
  variant?: CTAVariant;
  className?: string;
};

const content = {
  mid: {
    eyebrow: "Ready to begin?",
    headingStart: "Start Building ",
    headingAccent: "Smarter Surveys",
    body: "Join researchers and analysts who use InsightFlow to collect better data, reach wider audiences, and generate insights that actually move the needle.",
    primaryLabel: "Get Started Free",
    secondaryLabel: "See How It Works",
    secondaryHref: "#workflow",
  },
  final: {
    eyebrow: "Launch today",
    headingStart: "Launch Your First ",
    headingAccent: "Intelligent Survey",
    body: "Your research deserves more than a form builder. InsightFlow gives you the distribution engine, analytics layer, and AI intelligence to make every survey count.",
    primaryLabel: "Create Your Account",
    secondaryLabel: "Log in",
    secondaryHref: "/login",
  },
};

export function CTASection({ variant = "mid", className }: CTASectionProps) {
  const c = content[variant];
  const isFinal = variant === "final";

  return (
    <section
      className={cn(
        "py-16 sm:py-24",
        isFinal ? "bg-gradient-to-br from-primary-400 to-primary-600" : "bg-muted/30",
        className
      )}
      aria-labelledby={`cta-${variant}-heading`}
    >
      <ScrollReveal className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <span
          className={cn(
            "mb-5 inline-block border-b-2 pb-1 text-base font-semibold",
            isFinal ? "border-white text-white" : "border-primary text-primary"
          )}
        >
          {c.eyebrow}
        </span>

        <h2
          id={`cta-${variant}-heading`}
          className={cn(
            "text-4xl font-bold tracking-tight sm:text-5xl",
            isFinal ? "text-white" : "text-foreground"
          )}
        >
          {c.headingStart}
          <span className={isFinal ? "font-extrabold text-white" : "text-primary-500"}>
            {c.headingAccent}
          </span>
        </h2>

        <p
          className={cn(
            "mx-auto mt-5 max-w-2xl text-lg leading-relaxed",
            isFinal ? "text-white" : "text-foreground"
          )}
        >
          {c.body}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className={cn(
              "group px-6 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95",
              isFinal ? "bg-white text-primary-700 hover:bg-white/90" : ""
            )}
          >
            <Link to="/register">
              {c.primaryLabel}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          {c.secondaryHref.startsWith("#") ? (
            <Button
              asChild
              variant={isFinal ? "ghost" : "outline"}
              size="lg"
              className={cn(
                "px-6 transition-all duration-200 hover:scale-105 active:scale-95",
                isFinal && "text-white hover:bg-white/10 hover:text-white"
              )}
            >
              <a
                href={c.secondaryHref}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(c.secondaryHref)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {c.secondaryLabel}
              </a>
            </Button>
          ) : (
            <Button
              asChild
              variant={isFinal ? "ghost" : "outline"}
              size="lg"
              className={cn(
                "px-6 transition-all duration-200 hover:scale-105 active:scale-95",
                isFinal && "text-white hover:bg-white/10 hover:text-white"
              )}
            >
              <Link to={c.secondaryHref}>{c.secondaryLabel}</Link>
            </Button>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
