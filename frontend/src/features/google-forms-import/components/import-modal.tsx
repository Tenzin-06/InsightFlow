import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImportStatus } from "@/features/google-forms-import/components/import-status";
import { ImportGuide } from "@/features/google-forms-import/components/import-guide";
import { ImportForm } from "@/features/google-forms-import/components/import-form";
import { ImportLoading } from "@/features/google-forms-import/components/import-loading";
import { ImportError } from "@/features/google-forms-import/components/import-error";
import { ImportSuccess } from "@/features/google-forms-import/components/import-success";
import { useGoogleFormImport } from "@/features/google-forms-import/hooks/use-google-form-import";
import type {
  ImportFormValues,
  ImportError as TImportError,
  ImportedSurvey,
  ImportStatus as TImportStatus,
} from "@/features/google-forms-import/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ImportModal({ open, onOpenChange }: Props) {
  const [status, setStatus] = useState<TImportStatus>("idle");
  const [importError, setImportError] = useState<TImportError | null>(null);
  const [importedSurvey, setImportedSurvey] = useState<ImportedSurvey | null>(null);

  const { importForm, isPending } = useGoogleFormImport({
    onSuccess: (result) => {
      setImportedSurvey(result.survey);
      setStatus("success");
    },
    onError: (err) => {
      setImportError(err);
      setStatus("error");
    },
  });

  const handleSubmit = useCallback(
    (values: ImportFormValues) => {
      setStatus("importing");
      setImportError(null);
      importForm(values.url);
    },
    [importForm]
  );

  const handleRetry = useCallback(() => {
    setStatus("idle");
    setImportError(null);
  }, []);

  const handleClose = useCallback(() => {
    // Only block close while actively importing
    if (isPending) return;
    onOpenChange(false);
    // Reset after the dialog close animation
    setTimeout(() => {
      setStatus("idle");
      setImportError(null);
      setImportedSurvey(null);
    }, 300);
  }, [isPending, onOpenChange]);

  const currentStatus: TImportStatus = isPending ? "importing" : status;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg"
        onInteractOutside={(e) => { if (isPending) e.preventDefault(); }}
        onEscapeKeyDown={(e) => { if (isPending) e.preventDefault(); }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-lg font-semibold text-text-primary">
              Import Google Form
            </DialogTitle>
            <ImportStatus status={currentStatus} />
          </div>
          <DialogDescription className="text-sm text-text-secondary">
            Paste a public Google Forms link to convert it into an InsightFlow survey.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          {/* Success state */}
          {currentStatus === "success" && importedSurvey && (
            <ImportSuccess survey={importedSurvey} onClose={handleClose} />
          )}

          {/* Loading state */}
          {currentStatus === "importing" && <ImportLoading />}

          {/* Error state */}
          {currentStatus === "error" && importError && (
            <ImportError error={importError} onRetry={handleRetry} />
          )}

          {/* Idle / retry form state */}
          {(currentStatus === "idle" || currentStatus === "error") && (
            <>
              <ImportGuide />
              {currentStatus === "idle" && (
                <ImportForm onSubmit={handleSubmit} isPending={isPending} />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
