import { ReportTemplateCard } from "./report-template-card";
import { REPORT_TEMPLATES } from "../constants";
import type { ReportTemplate } from "../types";

type ReportTemplateSelectorProps = {
  selectedTemplateId: string;
  onSelect: (template: ReportTemplate) => void;
};

export function ReportTemplateSelector({ selectedTemplateId, onSelect }: ReportTemplateSelectorProps) {
  return (
    <section aria-labelledby="template-selector-heading">
      <h2 id="template-selector-heading" className="mb-1 text-sm font-semibold text-text-primary">
        Choose a Template
      </h2>
      <p className="mb-5 text-xs text-text-muted">
        Each template defines the report structure and section ordering. Select the one that best
        matches your reporting goal.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Report templates">
        {REPORT_TEMPLATES.map((template) => (
          <ReportTemplateCard
            key={template.id}
            template={template}
            isSelected={template.id === selectedTemplateId}
            onSelect={() => onSelect(template)}
          />
        ))}
      </div>
    </section>
  );
}
