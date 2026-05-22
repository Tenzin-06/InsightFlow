import { Send, BarChart3, Brain, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: string;
  accentBar: string;
  number: string;
};

const features: Feature[] = [
  {
    icon: Send,
    title: "Smart Survey Distribution",
    description:
      "Reach the right audiences with targeted distribution campaigns. Optimize outreach workflows and track delivery performance across multiple channels.",
    iconColor: "text-primary-500",
    accentBar: "bg-primary-500",
    number: "01",
  },
  {
    icon: BarChart3,
    title: "AI-Powered Analytics",
    description:
      "Automated insights surface patterns you would otherwise miss. Analyze response quality, track engagement trends, and understand audience behavior at a glance.",
    iconColor: "text-ai-600 dark:text-ai-400",
    accentBar: "bg-ai-500",
    number: "02",
  },
  {
    icon: Brain,
    title: "Survey Intelligence",
    description:
      "Improve data quality with intelligent response optimization. Detect anomalies, analyze behavioral signals, and ensure your research data remains reliable.",
    iconColor: "text-primary-500",
    accentBar: "bg-primary-500",
    number: "03",
  },
  {
    icon: Workflow,
    title: "Research Workflow Automation",
    description:
      "Automate reminders, campaign scheduling, and reporting pipelines. Spend less time on operations and more time interpreting what your data is telling you.",
    iconColor: "text-ai-600 dark:text-ai-400",
    accentBar: "bg-ai-500",
    number: "04",
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-250 hover:-translate-y-1 hover:shadow-lg">
      {/* Top accent bar */}
      <div className={cn("h-1 w-full transition-all duration-300 group-hover:h-1.5", feature.accentBar)} />

      <div className="flex flex-col gap-4 p-6 pt-5">
        {/* Icon row */}
        <div className="flex items-center justify-between">
          <Icon className={cn("h-8 w-8 transition-transform duration-200 group-hover:scale-110", feature.iconColor)} aria-hidden="true" />
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {feature.number}
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
          <p className="text-base leading-relaxed text-foreground">{feature.description}</p>
        </div>
      </div>
    </div>
  );
}

export function FeatureSection() {
  return (
    <section
      id="features"
      className="bg-background py-16 sm:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="mb-5 inline-block border-b-2 border-primary pb-1 text-base font-semibold text-primary">
            Platform Capabilities
          </span>
          <h2
            id="features-heading"
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Everything you need for{" "}
            <span className="text-primary-500">intelligent research</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground">
            InsightFlow combines distribution, analytics, and AI into one cohesive research platform
            built for modern teams.
          </p>
        </ScrollReveal>

        {/* Feature grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 100} direction="up">
              <FeatureCard feature={feature} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
