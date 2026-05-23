import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  IMPORT_ERROR_MESSAGES,
  IMPORT_ERROR_RECOVERY,
} from "@/features/google-forms-import/constants";
import type { ImportError } from "@/features/google-forms-import/types";

type Props = {
  error: ImportError;
  onRetry: () => void;
};

export function ImportError({ error, onRetry }: Props) {
  const message = IMPORT_ERROR_MESSAGES[error.code] ?? IMPORT_ERROR_MESSAGES.UNKNOWN;
  const recovery = IMPORT_ERROR_RECOVERY[error.code] ?? IMPORT_ERROR_RECOVERY.UNKNOWN;

  return (
    <div className="space-y-4" role="alert" aria-live="assertive">
      <Alert variant="destructive" className="border-danger/30 bg-red-50 dark:bg-red-950/20">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        <AlertDescription className="space-y-1">
          <p className="font-medium">{message}</p>
          <p className="text-xs opacity-80">{recovery}</p>
        </AlertDescription>
      </Alert>

      <Button
        onClick={onRetry}
        variant="outline"
        className="w-full gap-2"
        type="button"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Retry Import
      </Button>
    </div>
  );
}
