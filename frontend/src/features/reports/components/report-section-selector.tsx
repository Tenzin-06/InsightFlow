import { Check } from "lucide-react";
import { REPORT_SECTION_LABELS, REPORT_SECTION_DESCRIPTIONS, OPTIONAL_SECTIONS } from "../constants";
import type { ReportSectionKey } from "../types";

const CANONICAL_ORDER: ReportSectionKey[] = [
  "cover", "executive_summary", "metrics_overview", "charts_analytics",
  "ai_insights", "sentiment_analysis", "question_breakdown", "conclusions",
];

type ReportSectionSelectorProps = {
  selectedSections: ReportSectionKey[];
  onChange: (sections: ReportSectionKey[]) => void;
};

export function ReportSectionSelector({ selectedSections, onChange }: ReportSectionSelectorProps) {
  const toggle = (key: ReportSectionKey) => {
    if (selectedSections.includes(key)) {
      onChange(selectedSections.filter((s) => s !== key));
    } else {
      onChange(CANONICAL_ORDER.filter((s) => s === "cover" || selectedSections.includes(s) || s === key));
    }
  };

  return (
    <fieldset aria-label="Report sections">
      <legend className="mb-1 text-sm font-semibold text-text-primary">Include Sections</legend>
      <p className="mb-4 text-xs text-text-muted">
        The Cover Page is always included. Toggle remaining sections on or off.
      </p>

      {/* Cover — locked */}
      <div className="mb-2 flex items-start gap-3 rounded-xl border border-border-soft bg-bg-muted px-4 py-3 opacity-70">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-primary-500 bg-primary-500">
          <Check className="h-3 w-3 text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">Cover Page</p>
          <p className="text-xs text-text-muted">Always included — cannot be removed</p>
        </div>
      </div>

      <div className="space-y-2">
        {OPTIONAL_SECTIONS.map((key) => {
          const isChecked = selectedSections.includes(key);
          return (
            <label
              key={key}
              className={[
                "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
                isChecked
                  ? "border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/10"
                  : "border-border-default bg-white hover:bg-bg-tertiary dark:bg-card",
              ].join(" ")}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={() => toggle(key)}
                aria-label={`Include ${REPORT_SECTION_LABELS[key]}`}
              />
              <div
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                  isChecked ? "border-primary-500 bg-primary-500" : "border-border-strong bg-white dark:bg-card",
                ].join(" ")}
                aria-hidden="true"
              >
                {isChecked && <Check className="h-3 w-3 text-white" />}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{REPORT_SECTION_LABELS[key]}</p>
                <p className="text-xs text-text-muted">{REPORT_SECTION_DESCRIPTIONS[key]}</p>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
