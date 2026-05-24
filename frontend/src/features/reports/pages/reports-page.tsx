import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Download,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { ReportConfigForm } from "@/features/reports/components/report-config-form";
import { ReportTemplateSelector } from "@/features/reports/components/report-template-selector";
import { ReportPreview } from "@/features/reports/components/report-preview";
import { ExportProgress } from "@/features/reports/components/export-progress";
import { ExportActions } from "@/features/reports/components/export-actions";
import { useReportExport } from "@/features/reports/hooks/use-report-export";
import { useReportPreview } from "@/features/reports/hooks/use-report-preview";
import { useReportGeneration } from "@/features/reports/hooks/use-report-generation";
import { MOCK_RECENT_EXPORTS, DEFAULT_REPORT_CONFIG } from "@/features/reports/constants";
import type { ReportConfig, ExportRecord } from "@/features/reports/types";

function ExportStatusIcon({ status }: { status: ExportRecord["status"] }) {
  if (status === "completed")
    return <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />;
  if (status === "failed")
    return <XCircle className="h-4 w-4 text-danger" aria-hidden="true" />;
  return <AlertCircle className="h-4 w-4 text-warning" aria-hidden="true" />;
}

export default function ReportsPage() {
  const [searchParams] = useSearchParams();
  const urlSurveyId = searchParams.get("surveyId") ?? "";

  const [config, setConfig] = useState<ReportConfig>({
    ...DEFAULT_REPORT_CONFIG,
    title: "",
    surveyId: urlSurveyId,
  });

  const [activeTab, setActiveTab] = useState<"templates" | "configure">(
    urlSurveyId ? "configure" : "templates",
  );

  // ── Export workflow ──────────────────────────────────────────────────────────
  const { status, progress, fileUrl, errorMessage, isExporting, startExport, resetExport } =
    useReportExport();

  // ── Preview ──────────────────────────────────────────────────────────────────
  const { preview, openPreview, closePreview, nextPage, prevPage, zoomIn, zoomOut } =
    useReportPreview(config);

  // ── Gemini AI generation ──────────────────────────────────────────────────────
  const { reportData, isGenerating, isReady, error: genError, generate, reset: resetGen } =
    useReportGeneration(config.surveyId, config.includeAiInsights);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handlePreview = () => {
    openPreview();
  };

  const handleConfigChange = (next: ReportConfig) => {
    // Reset generated data when the survey selection changes
    if (next.surveyId !== config.surveyId) {
      resetGen();
    }
    setConfig(next);
  };

  return (
    <PageContainer>
      {preview.isVisible && (
        <ReportPreview
          config={config}
          preview={preview}
          reportData={reportData}
          onClose={closePreview}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />
      )}

      <div className="space-y-8">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Reports</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Configure your report, generate AI-powered content, and export as PDF.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border-default bg-white px-4 py-2.5 shadow-sm dark:bg-card">
            <FileText className="h-4 w-4 text-primary-500" aria-hidden="true" />
            <span className="text-xs font-medium text-text-secondary">
              {MOCK_RECENT_EXPORTS.filter((e) => e.status === "completed").length} exports
              completed
            </span>
          </div>
        </div>

        {/* ── Export queue ────────────────────────────────────────────────────── */}
        {status !== "idle" && (
          <section aria-labelledby="export-queue-heading">
            <h2 id="export-queue-heading" className="mb-3 text-sm font-semibold text-text-primary">
              Export Queue
            </h2>
            <ExportProgress
              status={status}
              progress={progress}
              errorMessage={errorMessage}
              fileUrl={fileUrl}
            />
          </section>
        )}

        {/* ── Main grid ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* ── Left: workflow (2/3) ─────────────────────────────────────────── */}
          <div className="xl:col-span-2 space-y-6">
            {/* Tab bar */}
            <div
              className="flex rounded-xl border border-border-default bg-bg-muted p-1"
              role="tablist"
              aria-label="Report workflow steps"
            >
              {(
                [
                  { key: "templates" as const, label: "1. Select Template" },
                  { key: "configure" as const, label: "2. Configure & Export" },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeTab === key}
                  onClick={() => setActiveTab(key)}
                  className={[
                    "flex-1 rounded-lg py-2 text-xs font-semibold transition",
                    activeTab === key
                      ? "bg-white text-primary-700 shadow-sm dark:bg-card dark:text-primary-300"
                      : "text-text-muted hover:text-text-secondary",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Template panel */}
            {activeTab === "templates" && (
              <div role="tabpanel" aria-label="Select template">
                <ReportTemplateSelector
                  selectedTemplateId={config.templateId}
                  onSelect={(template) => {
                    setConfig((prev) => ({
                      ...prev,
                      templateId: template.id,
                      sections: template.sections,
                    }));
                    setActiveTab("configure");
                  }}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setActiveTab("configure")}
                    className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    Continue → Configure Report
                  </button>
                </div>
              </div>
            )}

            {/* Configure panel */}
            {activeTab === "configure" && (
              <div role="tabpanel" aria-label="Configure and export" className="space-y-6">
                {/* Config form */}
                <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm dark:bg-card">
                  <h2 className="mb-5 text-sm font-semibold text-text-primary">
                    Report Configuration
                  </h2>
                  <ReportConfigForm defaultValues={config} onConfigChange={handleConfigChange} />
                </div>

                {/* ── AI Generation panel ──────────────────────────────────── */}
                <div className="rounded-xl border border-ai-200 bg-ai-50 p-6 shadow-sm dark:border-ai-700/30 dark:bg-ai-900/10">
                  <div className="mb-4 flex items-center gap-2.5">
                    <Sparkles className="h-4 w-4 text-ai-600" aria-hidden="true" />
                    <h2 className="text-sm font-semibold text-ai-700 dark:text-ai-300">
                      AI Report Generation
                    </h2>
                  </div>

                  <p className="mb-4 text-xs leading-relaxed text-text-secondary">
                    {config.surveyId
                      ? "Click Generate to have Gemini AI analyse your real survey data and write the executive summary, key findings, insights, sentiment analysis, and conclusions."
                      : "Select a survey above to enable AI-powered report generation."}
                  </p>

                  {/* Generation error */}
                  {genError && (
                    <div
                      role="alert"
                      className="mb-4 rounded-lg border border-danger bg-danger/10 px-4 py-2.5 text-xs font-medium text-danger"
                    >
                      {genError}
                    </div>
                  )}

                  {/* Success badge */}
                  {isReady && reportData && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-success bg-success/10 px-4 py-2.5 text-xs font-medium text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Report generated ·{" "}
                      {reportData.metrics.total_responses} responses ·{" "}
                      {reportData.ai_generated ? "Gemini AI narrative" : "Analytics only"}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {/* Generate button */}
                    <button
                      onClick={generate}
                      disabled={isGenerating || !config.surveyId}
                      className="flex items-center gap-2 rounded-lg bg-ai-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ai-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ai-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Generating…
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" aria-hidden="true" />
                          {isReady ? "Regenerate Report" : "Generate Report"}
                        </>
                      )}
                    </button>

                    {/* Regenerate / reset (when data is ready) */}
                    {isReady && (
                      <button
                        onClick={resetGen}
                        className="flex items-center gap-2 rounded-lg border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-bg-muted"
                      >
                        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                        Clear
                      </button>
                    )}

                    {/* Preview button (always available) */}
                    <button
                      onClick={handlePreview}
                      disabled={config.sections.length === 0 || !config.title.trim()}
                      className="flex items-center gap-2 rounded-lg border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Preview Report
                    </button>
                  </div>

                  {!config.surveyId && (
                    <p className="mt-3 text-xs text-text-muted">
                      ↑ Select a survey in the configuration form to enable generation.
                    </p>
                  )}
                </div>

                {/* ── Export panel ─────────────────────────────────────────── */}
                <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm dark:bg-card">
                  <h2 className="mb-4 text-sm font-semibold text-text-primary">Export Report</h2>
                  <ExportActions
                    config={config}
                    exportStatus={status}
                    isExporting={isExporting}
                    fileUrl={fileUrl}
                    onPreview={handlePreview}
                    onExport={() => startExport(config)}
                    onReset={resetExport}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Right: recent exports (1/3) ──────────────────────────────────── */}
          <div className="xl:col-span-1">
            <section aria-labelledby="recent-exports-heading" className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-text-muted" aria-hidden="true" />
                <h2
                  id="recent-exports-heading"
                  className="text-sm font-semibold text-text-primary"
                >
                  Recent Exports
                </h2>
              </div>

              {MOCK_RECENT_EXPORTS.length === 0 ? (
                <div className="rounded-xl border border-border-soft bg-bg-muted py-10 text-center">
                  <Download className="mx-auto mb-2 h-8 w-8 text-text-muted" aria-hidden="true" />
                  <p className="text-sm text-text-muted">No exports yet</p>
                </div>
              ) : (
                <ul className="space-y-2" role="list">
                  {MOCK_RECENT_EXPORTS.map((record) => (
                    <li key={record.id}>
                      <div className="flex items-start gap-3 rounded-xl border border-border-default bg-white p-4 shadow-sm dark:bg-card">
                        <div className="mt-0.5 shrink-0">
                          <ExportStatusIcon status={record.status} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text-primary">
                            {record.reportTitle}
                          </p>
                          <p className="mt-0.5 text-xs text-text-muted">{record.templateName}</p>
                          <p className="mt-0.5 text-xs text-text-muted">
                            {new Date(record.exportedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        {record.status === "completed" && record.fileUrl && (
                          <a
                            href={record.fileUrl}
                            download
                            aria-label={`Download ${record.reportTitle}`}
                            className="shrink-0 rounded-lg border border-border-default p-1.5 text-text-muted transition hover:border-primary-300 hover:text-primary-500"
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Completed",
                    value: MOCK_RECENT_EXPORTS.filter((e) => e.status === "completed").length,
                    color: "text-success",
                  },
                  {
                    label: "Failed",
                    value: MOCK_RECENT_EXPORTS.filter((e) => e.status === "failed").length,
                    color: "text-danger",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border-default bg-white p-4 text-center shadow-sm dark:bg-card"
                  >
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="mt-0.5 text-xs text-text-muted">{label}</p>
                  </div>
                ))}
              </div>

              {/* AI generation status card */}
              {isReady && reportData && (
                <div className="rounded-xl border border-ai-200 bg-ai-50 p-4 dark:border-ai-700/30 dark:bg-ai-900/10">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-ai-600" aria-hidden="true" />
                    <p className="text-xs font-semibold text-ai-700 dark:text-ai-300">
                      Report Generated
                    </p>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Survey: <span className="font-medium">{reportData.survey_title}</span>
                  </p>
                  <p className="text-xs text-text-muted">
                    {reportData.metrics.total_responses} responses ·{" "}
                    {reportData.data_quality} data quality
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
