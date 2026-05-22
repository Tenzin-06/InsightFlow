import { Navbar } from "@/features/marketing/components/navbar";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { FeatureSection } from "@/features/marketing/components/feature-section";
import { WorkflowSection } from "@/features/marketing/components/workflow-section";
import { AnalyticsSection } from "@/features/marketing/components/analytics-section";
import { CTASection } from "@/features/marketing/components/cta-section";
import { Footer } from "@/features/marketing/components/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col scroll-smooth bg-background">
      <Navbar />

      <main id="main-content" className="flex-1">
        <HeroSection />
        <FeatureSection />
        <CTASection variant="mid" />
        <WorkflowSection />
        <AnalyticsSection />
        <CTASection variant="final" />
      </main>

      <Footer />
    </div>
  );
}
