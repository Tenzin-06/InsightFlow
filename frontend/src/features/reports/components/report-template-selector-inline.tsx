import { CheckCircle2, FileText } from "lucide-react";
import { REPORT_TEMPLATES } from "../constants";
import type { ReportTemplate } from "../types";

type ReportTemplateSelectorInlineProps = {
  selectedTemplateId: string;
  onSelect: (template: ReportTemplate) => void;
};

export function ReportTemplateSelectorInline({ selectedTemplateId, onSelect }: ReportTemplateSelectorInlineProps) {
  return (
    <fieldset aria-label="Report template selection">
      <legend className="mb-1 text-sm font-semibold text-text-primary">Report Template</legend>
      <p className="mb-3 text-xs text-text-muted">
        Selecting a template automatically updates the included sections.
      </p>
      <div className="space-y-2" role="group">
        {REPORT_TEMPLATES.map((template) => {
          const isSelected = template.id === selectedTemplateId;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              aria-pressed={isSelected}
              className={[
                "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                isSelected
                  ? "border-primary-400 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/15"
                  : "border-border-default bg-white hover:bg-bg-tertiary dark:bg-card",
              ].join(" ")}
            >
              <div className={["flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", isSelected ? "bg-primary-100" : "bg-bg-muted"].join(" ")} aria-hidden="true">
                <FileText className={`h-4 w-4 ${isSelected ? "text-primary-600" : "text-text-muted"}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isSelected ? "text-primary-700 dark:text-primary-300" : "text-text-primary"}`}>
                  {template.name}
                </p>
                <p className="text-xs text-text-muted">{template.purpose}</p>
              </div>
              {isSelected && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
