import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ReportTemplateSelectorInline } from "./report-template-selector-inline";
import { ReportSectionSelector } from "./report-section-selector";
import type { ReportConfig, ReportSectionKey, ReportTemplate } from "../types";

const schema = z.object({
  title: z.string().min(1, "Report title is required").max(120, "Title must be under 120 characters"),
  templateId: z.string().min(1, "Please select a template"),
  sections: z.array(z.string()).min(1, "Select at least one section"),
  includeCharts: z.boolean(),
  includeAiInsights: z.boolean(),
  organization: z.string().max(100).optional(),
  dateRangeFrom: z.string().optional(),
  dateRangeTo: z.string().optional(),
  surveyId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type ReportConfigFormProps = {
  defaultValues?: Partial<ReportConfig>;
  onConfigChange: (config: ReportConfig) => void;
};

export function ReportConfigForm({ defaultValues, onConfigChange }: ReportConfigFormProps) {
  const { register, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      templateId: defaultValues?.templateId ?? "academic_research",
      sections: defaultValues?.sections ?? ["cover", "executive_summary", "metrics_overview", "charts_analytics", "conclusions"],
      includeCharts: defaultValues?.includeCharts ?? true,
      includeAiInsights: defaultValues?.includeAiInsights ?? false,
      organization: defaultValues?.organization ?? "",
      dateRangeFrom: defaultValues?.dateRangeFrom ?? "",
      dateRangeTo: defaultValues?.dateRangeTo ?? "",
      surveyId: defaultValues?.surveyId ?? "",
    },
    mode: "onChange",
  });

  const values = watch();

  useEffect(() => {
    onConfigChange({
      title: values.title,
      templateId: values.templateId,
      sections: (values.sections ?? []) as ReportSectionKey[],
      includeCharts: values.includeCharts,
      includeAiInsights: values.includeAiInsights,
      organization: values.organization,
      dateRangeFrom: values.dateRangeFrom,
      dateRangeTo: values.dateRangeTo,
      surveyId: values.surveyId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  return (
    <form noValidate aria-label="Report configuration form" className="space-y-8">
      {/* Title + Org */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-text-primary">Report Details</legend>
        <div className="space-y-4">
          <div>
            <label htmlFor="report-title" className="mb-1.5 block text-xs font-medium text-text-secondary">
              Report Title <span className="text-danger">*</span>
            </label>
            <input
              id="report-title"
              type="text"
              placeholder="e.g. Q2 2026 Customer Satisfaction Report"
              className={["w-full rounded-lg border px-3 py-2.5 text-sm text-text-primary shadow-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-card", errors.title ? "border-danger" : "border-border-default"].join(" ")}
              {...register("title")}
            />
            {errors.title && <p role="alert" className="mt-1 text-xs text-danger">{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="report-org" className="mb-1.5 block text-xs font-medium text-text-secondary">
              Organization <span className="text-text-muted">(optional)</span>
            </label>
            <input
              id="report-org"
              type="text"
              placeholder="e.g. University of Research"
              className="w-full rounded-lg border border-border-default px-3 py-2.5 text-sm text-text-primary shadow-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-card"
              {...register("organization")}
            />
          </div>
        </div>
      </fieldset>

      {/* Template */}
      <ReportTemplateSelectorInline
        selectedTemplateId={watch("templateId")}
        onSelect={(t: ReportTemplate) => {
          setValue("templateId", t.id, { shouldValidate: true });
          setValue("sections", t.sections, { shouldValidate: true });
        }}
      />

      {/* Sections */}
      <ReportSectionSelector
        selectedSections={(watch("sections") as ReportSectionKey[]) ?? []}
        onChange={(sections) => setValue("sections", sections, { shouldValidate: true })}
      />

      {/* Date range */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-text-primary">
          Reporting Period <span className="text-xs font-normal text-text-muted">(optional)</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="date-from" className="mb-1.5 block text-xs font-medium text-text-secondary">From</label>
            <input id="date-from" type="date" className="w-full rounded-lg border border-border-default px-3 py-2.5 text-sm text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-card" {...register("dateRangeFrom")} />
          </div>
          <div>
            <label htmlFor="date-to" className="mb-1.5 block text-xs font-medium text-text-secondary">To</label>
            <input id="date-to" type="date" className="w-full rounded-lg border border-border-default px-3 py-2.5 text-sm text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-card" {...register("dateRangeTo")} />
          </div>
        </div>
      </fieldset>

      {/* Toggles */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-text-primary">Visualization Options</legend>
        <div className="space-y-3">
          <ToggleRow id="include-charts" label="Include Charts" description="Embed bar, line, and pie charts" checked={watch("includeCharts")} onChange={(v) => setValue("includeCharts", v)} />
          <ToggleRow id="include-ai" label="Include AI Insights" description="Add AI-generated summaries and recommendations" checked={watch("includeAiInsights")} onChange={(v) => setValue("includeAiInsights", v)} accentColor="ai" />
        </div>
      </fieldset>
    </form>
  );
}

type ToggleRowProps = {
  id: string; label: string; description: string;
  checked: boolean; onChange: (v: boolean) => void;
  accentColor?: "primary" | "ai";
};

function ToggleRow({ id, label, description, checked, onChange, accentColor = "primary" }: ToggleRowProps) {
  const activeClass = accentColor === "ai" ? "bg-ai-500 border-ai-500" : "bg-primary-500 border-primary-500";
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border-default bg-white px-4 py-3 transition-colors hover:bg-bg-tertiary dark:bg-card">
      <div className="relative mt-0.5 shrink-0" aria-hidden="true">
        <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={["h-5 w-9 rounded-full border transition-colors", checked ? activeClass : "border-border-strong bg-bg-muted"].join(" ")}>
          <div className={["absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", checked ? "translate-x-4" : "translate-x-0.5"].join(" ")} />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
    </label>
  );
}
