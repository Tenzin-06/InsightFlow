import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ContactUploadError } from "@/features/audiences/types";

type Props = {
  errors: ContactUploadError[];
};

export function UploadErrors({ errors }: Props) {
  if (errors.length === 0) return null;

  return (
    <Alert variant="destructive" role="alert" aria-live="polite">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{errors.length} invalid row{errors.length === 1 ? "" : "s"}</AlertTitle>
      <AlertDescription>
        <ul className="mt-2 max-h-32 space-y-1 overflow-auto text-xs">
          {errors.slice(0, 8).map((error, index) => (
            <li key={`${error.rowNumber}-${index}`}>
              Row {error.rowNumber}: {error.message}
            </li>
          ))}
          {errors.length > 8 && <li>{errors.length - 8} more issues hidden.</li>}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
