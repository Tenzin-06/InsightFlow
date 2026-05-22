/**
 * Minimal survey footer — shows branding attribution.
 * Kept lightweight to stay distraction-free.
 */
export function SurveyFooter() {
  return (
    <footer className="mt-10 pb-6 text-center text-xs text-text-muted">
      Powered by{" "}
      <span className="font-semibold text-primary-500">InsightFlow</span>
    </footer>
  );
}
