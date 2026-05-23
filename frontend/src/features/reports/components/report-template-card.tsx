import { CheckCircle2, FileText } from "lucide-react";
import type { ReportTemplate } from "../types";

type ReportTemplateCardProps = {
  template: ReportTemplate;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export function ReportTemplateCard({ template, isSelected, onSelect }: ReportTemplateCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      aria-pressed={isSelected}
      aria-label={`Select template: ${template.name}`}
      className={[
        "group relative flex w-full flex-col gap-3 rounded-xl border p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        isSelected
          ? "border-primary-500 bg-primary-50 shadow-md dark:bg-primary-900/20"
          : "border-border-default bg-white hover:border-primary-300 hover:shadow-sm dark:bg-card",
      ].join(" ")}
    >
      {isSelected && (
        <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-primary-500" aria-hidden="true" />
      )}
      <div className="flex items-start gap-3">
        <div className={["flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", isSelected ? "bg-primary-100" : "bg-bg-muted"].join(" ")}>
          <FileText className={`h-5 w-5 ${isSelected ? "text-primary-600" : "text-text-muted"}`} aria-hidden="true" />
        </div>
        <div>
          <p className={`text-sm font-semibold ${isSelected ? "text-primary-700 dark:text-primary-300" : "text-text-primary"}`}>
            {template.name}
          </p>
          <p className="mt-0.5 text-xs font-medium text-text-muted">{template.purpose}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-text-secondary">{template.description}</p>
      <div className="mt-auto">
        <span className="rounded-full bg-bg-muted px-2.5 py-1 text-xs text-text-muted">
          📌 {template.recommendedFor}
        </span>
      </div>
    </button>
  );
}
