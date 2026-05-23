import { FileText } from "lucide-react";

type ReportCoverProps = {
  title: string;
  surveyName?: string;
  organization?: string;
  reportType?: string;
  generatedDate?: string;
};

export function ReportCover({
  title,
  surveyName,
  organization,
  reportType = "Analytics Report",
  generatedDate,
}: ReportCoverProps) {
  const date = new Date(generatedDate ?? Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="flex min-h-[560px] flex-col items-center justify-center rounded-xl border border-border-default bg-white p-12 text-center shadow-sm dark:bg-card"
      aria-label="Report cover page"
    >
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/20">
        <FileText className="h-8 w-8 text-primary-600" aria-hidden="true" />
      </div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-500">
        {reportType}
      </p>
      <h1 className="mb-4 max-w-xl text-3xl font-bold leading-tight text-text-primary dark:text-white">
        {title || "Untitled Report"}
      </h1>
      {surveyName && <p className="mb-6 text-base text-text-secondary">{surveyName}</p>}
      <div className="my-6 h-px w-24 bg-border-default" aria-hidden="true" />
      <div className="space-y-1.5 text-sm text-text-muted">
        {organization && <p className="font-medium text-text-secondary">{organization}</p>}
        <p>Generated: {date}</p>
        <p className="text-xs">Powered by InsightFlow</p>
      </div>
    </div>
  );
}
