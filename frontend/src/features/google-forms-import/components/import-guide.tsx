import { Info, ExternalLink } from "lucide-react";

export function ImportGuide() {
  return (
    <div className="rounded-lg border border-primary-100 bg-primary-50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
        <p className="text-sm font-medium text-primary-700">
          How to get your Google Forms URL
        </p>
      </div>

      <ol className="space-y-1.5 text-sm text-text-secondary list-none pl-0">
        <li className="flex gap-2">
          <span className="shrink-0 font-semibold text-primary-500">1.</span>
          Open your form in Google Forms
        </li>
        <li className="flex gap-2">
          <span className="shrink-0 font-semibold text-primary-500">2.</span>
          Click the <strong>Send</strong> button in the top-right corner
        </li>
        <li className="flex gap-2">
          <span className="shrink-0 font-semibold text-primary-500">3.</span>
          Select the <strong>Link</strong> tab and copy the URL
        </li>
        <li className="flex gap-2">
          <span className="shrink-0 font-semibold text-primary-500">4.</span>
          Paste the URL below and click <strong>Import</strong>
        </li>
      </ol>

      <p className="text-xs text-text-muted flex items-center gap-1">
        <span>Supports text, multiple-choice, checkbox, and rating questions.</span>
        <a
          href="https://support.google.com/docs/answer/2839588"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-primary-500 hover:text-primary-600 hover:underline"
          aria-label="Google Forms help (opens in new tab)"
        >
          Learn more
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
