import { useState, useCallback, useRef } from "react";
import type { ReportConfig, ExportStatus } from "../types";
import { initiateExport, pollExportStatus } from "../services/export-api";

export type UseReportExportReturn = {
  status: ExportStatus;
  progress: number;
  fileUrl: string | null;
  errorMessage: string | null;
  isExporting: boolean;
  startExport: (config: ReportConfig) => Promise<void>;
  resetExport: () => void;
};

const PROGRESS_MAP: Record<ExportStatus, number> = {
  idle: 0,
  preparing: 20,
  rendering: 45,
  processing_charts: 70,
  finalizing: 90,
  completed: 100,
  failed: 0,
};

export function useReportExport(): UseReportExportReturn {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const exportIdRef = useRef<string | null>(null);
  const statusRef = useRef<ExportStatus>("idle");

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startExport = useCallback(
    async (config: ReportConfig) => {
      setStatus("preparing");
      statusRef.current = "preparing";
      setFileUrl(null);
      setErrorMessage(null);

      try {
        const result = await initiateExport(config);
        exportIdRef.current = result.exportId;
        setStatus(result.status);
        statusRef.current = result.status;

        pollRef.current = setInterval(async () => {
          try {
            const poll = await pollExportStatus(exportIdRef.current!, statusRef.current);
            setStatus(poll.status);
            statusRef.current = poll.status;

            if (poll.status === "completed") {
              setFileUrl(poll.fileUrl ?? null);
              stopPolling();
            } else if (poll.status === "failed") {
              setErrorMessage(poll.errorMessage ?? "Export failed. Please retry.");
              stopPolling();
            }
          } catch (err) {
            setStatus("failed");
            statusRef.current = "failed";
            setErrorMessage(
              err instanceof Error ? err.message : "An unexpected error occurred."
            );
            stopPolling();
          }
        }, 900);
      } catch (err) {
        setStatus("failed");
        statusRef.current = "failed";
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to initiate export."
        );
      }
    },
    [stopPolling]
  );

  const resetExport = useCallback(() => {
    stopPolling();
    setStatus("idle");
    statusRef.current = "idle";
    setFileUrl(null);
    setErrorMessage(null);
    exportIdRef.current = null;
  }, [stopPolling]);

  return {
    status,
    progress: PROGRESS_MAP[status],
    fileUrl,
    errorMessage,
    isExporting: status !== "idle" && status !== "completed" && status !== "failed",
    startExport,
    resetExport,
  };
}
