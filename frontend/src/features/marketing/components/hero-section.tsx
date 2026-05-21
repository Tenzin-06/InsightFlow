import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";

export function HeroSection() {
  return (
    <section
      className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-4 py-20 text-center sm:px-6 lg:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-3xl">
        <ScrollReveal direction="up" delay={0}>
          <h1
            id="hero-heading"
            className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="text-primary-500">Smarter Surveys.</span>
            <br />
            <span className="text-foreground">AI-driven Insights.</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={120}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground sm:text-lg">
            The AI-powered survey intelligence platform to distribute surveys at scale,
            track engagement in real time, and generate insights that drive decisions.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={240}>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="px-8 text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
