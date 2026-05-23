import { Eye, Download, RefreshCw, Loader2 } from "lucide-react";
import type { ReportConfig, ExportStatus } from "../types";

function isConfigValid(config: ReportConfig): { valid: boolean; reason?: string } {
  if (!config.title.trim()) return { valid: false, reason: "Enter a report title to proceed." };
  if (config.sections.length === 0) return { valid: false, reason: "Select at least one section." };
  return { valid: true };
}

type ExportActionsProps = {
  config: ReportConfig;
  exportStatus: ExportStatus;
  isExporting: boolean;
  fileUrl: string | null;
  onPreview: () => void;
  onExport: () => void;
  onReset: () => void;
};

export function ExportActions({ config, exportStatus, isExporting, fileUrl, onPreview, onExport, onReset }: ExportActionsProps) {
  const validation = isConfigValid(config);
  const isCompleted = exportStatus === "completed";
  const isFailed = exportStatus === "failed";
  const isIdle = exportStatus === "idle";

  return (
    <div className="space-y-3">
      {!validation.valid && (
        <div role="alert" className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-xs font-medium text-warning">
          ⚠ {validation.reason}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPreview}
          disabled={isExporting || config.sections.length === 0}
          aria-label="Preview report layout"
          className="flex items-center gap-2 rounded-lg border border-border-default bg-white px-4 py-2.5 text-sm font-medium text-text-primary shadow-sm transition hover:bg-bg-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-card"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          Preview Layout
        </button>

        {isFailed ? (
          <button type="button" onClick={onReset} className="flex items-center gap-2 rounded-lg bg-warning px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-warning/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-warning">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Retry Export
          </button>
        ) : isCompleted && fileUrl ? (
          <>
            <a href={fileUrl} download className="flex items-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-success/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-success">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download PDF
            </a>
            <button type="button" onClick={onReset} className="flex items-center gap-2 rounded-lg border border-border-default bg-white px-4 py-2.5 text-sm font-medium text-text-secondary shadow-sm transition hover:bg-bg-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-card">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              New Export
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onExport}
            disabled={isExporting || !validation.valid}
            aria-busy={isExporting}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExporting
              ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Exporting…</>
              : <><Download className="h-4 w-4" aria-hidden="true" /> Export PDF</>}
          </button>
        )}
      </div>

      {isIdle && validation.valid && (
        <p className="text-xs text-text-muted">
          Exporting <span className="font-medium text-text-secondary">{config.sections.length} section{config.sections.length !== 1 ? "s" : ""}</span>
          {config.includeCharts ? " with charts" : ""}
          {config.includeAiInsights ? " and AI insights" : ""}.
        </p>
      )}
    </div>
  );
}
