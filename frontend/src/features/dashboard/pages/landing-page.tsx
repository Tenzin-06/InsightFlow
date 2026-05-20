import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-4">
      <div className="max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
            AI-Powered Survey Intelligence
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            Smarter surveys.{" "}
            <span className="text-primary-500">Better insights.</span>
          </h1>
          <p className="text-lg text-text-secondary">
            InsightFlow helps researchers and organizations distribute surveys, track engagement,
            and generate AI-powered analytics — all in one platform.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/register">Get started free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
