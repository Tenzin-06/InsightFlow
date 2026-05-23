import { useState, useCallback } from "react";
import { REPORT_TEMPLATES } from "../constants";
import type { ReportTemplate } from "../types";

export function useReportTemplates() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    REPORT_TEMPLATES[1].id
  );
  const templates: ReportTemplate[] = REPORT_TEMPLATES;
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const selectTemplate = useCallback((id: string) => setSelectedTemplateId(id), []);

  return {
    templates,
    selectedTemplateId,
    selectedTemplate: selectedTemplate ?? templates[0],
    selectTemplate,
  };
}
