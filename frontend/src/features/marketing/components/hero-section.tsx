import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-4 py-20 text-center sm:px-6 lg:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-3xl">
        {/* Headline — staggered fade-up */}
        <h1
          id="hero-heading"
          className="animate-fade-up text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "0ms" }}
        >
          <span className="text-primary-500">Smarter Surveys.</span>
          <br />
          <span className="text-foreground">AI-driven Insights.</span>
        </h1>

        {/* Description */}
        <p
          className="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          The AI-powered survey intelligence platform to distribute surveys at scale,
          track engagement in real time, and generate insights that drive decisions.
        </p>

        {/* CTA */}
        <div
          className="animate-fade-up mt-10"
          style={{ animationDelay: "240ms" }}
        >
          <Button
            asChild
            size="lg"
            className="px-8 text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
