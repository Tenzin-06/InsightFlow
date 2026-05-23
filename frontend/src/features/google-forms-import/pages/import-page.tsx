/**
 * ImportPage — full-page import workflow for mobile / direct navigation.
 *
 * Route: /surveys/import/google
 * Requires authentication (placed inside ProtectedRoute in the router).
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { ImportGuide } from "@/features/google-forms-import/components/import-guide";
import { ImportForm } from "@/features/google-forms-import/components/import-form";
import { ImportLoading } from "@/features/google-forms-import/components/import-loading";
import { ImportError } from "@/features/google-forms-import/components/import-error";
import { ImportSuccess } from "@/features/google-forms-import/components/import-success";
import { ImportStatus } from "@/features/google-forms-import/components/import-status";
import { useGoogleFormImport } from "@/features/google-forms-import/hooks/use-google-form-import";
import type {
  ImportFormValues,
  ImportError as TImportError,
  ImportedSurvey,
  ImportStatus as TImportStatus,
} from "@/features/google-forms-import/types";

export default function ImportPage() {
  const navigate = useNavigate();
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

  function handleSubmit(values: ImportFormValues) {
    setStatus("importing");
    setImportError(null);
    importForm(values.url);
  }

  function handleRetry() {
    setStatus("idle");
    setImportError(null);
  }

  const currentStatus: TImportStatus = isPending ? "importing" : status;

  return (
    <PageContainer>
      <div className="mx-auto max-w-xl space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/surveys")}
            aria-label="Back to surveys"
            className="mt-0.5 shrink-0"
            disabled={isPending}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-text-primary">
                Import Google Form
              </h1>
              <ImportStatus status={currentStatus} />
            </div>
            <p className="text-sm text-text-secondary">
              Paste a public Google Forms link to convert it into an InsightFlow survey.
            </p>
          </div>
        </div>

        {/* Workflow content */}
        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm dark:bg-card space-y-5">
          {currentStatus === "success" && importedSurvey && (
            <ImportSuccess survey={importedSurvey} onClose={() => navigate("/surveys")} />
          )}

          {currentStatus === "importing" && <ImportLoading />}

          {currentStatus === "error" && importError && (
            <ImportError error={importError} onRetry={handleRetry} />
          )}

          {(currentStatus === "idle" || currentStatus === "error") && (
            <>
              <ImportGuide />
              {currentStatus === "idle" && (
                <ImportForm onSubmit={handleSubmit} isPending={isPending} />
              )}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
