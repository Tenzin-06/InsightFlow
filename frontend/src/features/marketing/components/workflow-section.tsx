import { PlusCircle, Rocket, Activity, MessageSquare, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";

type Step = {
  icon: React.ElementType;
  title: string;
  description: string;
  step: number;
};

const steps: Step[] = [
  {
    step: 1,
    icon: PlusCircle,
    title: "Create Survey",
    description:
      "Design structured surveys with multiple question types, logic branching, and intelligent defaults that guide respondents toward meaningful answers.",
  },
  {
    step: 2,
    icon: Rocket,
    title: "Launch Distribution",
    description:
      "Deploy surveys across targeted channels with campaign management tools built to maximize reach and minimize drop-off.",
  },
  {
    step: 3,
    icon: Activity,
    title: "Track Engagement",
    description:
      "Monitor response rates, completion funnels, and participation trends in real time from a single unified dashboard.",
  },
  {
    step: 4,
    icon: MessageSquare,
    title: "Analyze Responses",
    description:
      "Review individual and aggregate responses with structured data views, filtering tools, and exportable summaries.",
  },
  {
    step: 5,
    icon: Sparkles,
    title: "Generate Insights",
    description:
      "Let AI surface patterns, anomalies, and key findings from your response data — turning raw answers into research intelligence.",
  },
];

export function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="bg-muted/30 py-16 sm:py-24"
      aria-labelledby="workflow-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="mb-5 inline-block border-b-2 border-primary pb-1 text-base font-semibold text-primary">
            How It Works
          </span>
          <h2
            id="workflow-heading"
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            From survey creation to{" "}
            <span className="text-primary-500">insight delivery</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground">
            A streamlined five-step process that takes your research from idea to actionable
            intelligence.
          </p>
        </ScrollReveal>

        {/* Desktop: horizontal timeline */}
        <div className="mt-16 hidden md:block">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-8 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />
            <ol className="relative grid grid-cols-5 gap-4" aria-label="Workflow steps">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <ScrollReveal
                    key={step.step}
                    delay={step.step * 80}
                    direction="up"
                    threshold={0.1}
                  >
                    <li className="flex flex-col items-center text-center">
                      <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm transition-all duration-200 hover:border-primary/60 hover:shadow-md">
                        <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                        <span
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
                          aria-hidden="true"
                        >
                          {step.step}
                        </span>
                      </div>
                      <h3 className="mb-2 text-base font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-foreground">
                        {step.description}
                      </p>
                    </li>
                  </ScrollReveal>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <ol className="mt-12 flex flex-col gap-0 md:hidden" aria-label="Workflow steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <ScrollReveal
                key={step.step}
                delay={index * 80}
                direction="left"
                threshold={0.1}
              >
                <li className="relative flex gap-4">
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="absolute left-6 top-14 h-full w-px bg-border"
                    />
                  )}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm transition-all duration-200 hover:border-primary/60">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white"
                      aria-hidden="true"
                    >
                      {step.step}
                    </span>
                  </div>
                  <div className={isLast ? "pb-0" : "pb-8"}>
                    <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-base leading-relaxed text-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              </ScrollReveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
