/**
 * ImportPreview — future-ready architecture stub.
 *
 * When the backend exposes a /preview endpoint, this component will render
 * a pre-import summary: detected title, question list, and question types.
 * For this unit only the shell is established; no backend logic is required.
 */
import { FileText } from "lucide-react";

export function ImportPreview() {
  return (
    <div className="rounded-lg border border-dashed border-border-default bg-bg-muted p-6 text-center space-y-2">
      <FileText className="mx-auto h-6 w-6 text-text-muted" aria-hidden="true" />
      <p className="text-sm text-text-muted">
        Preview will show detected questions before import.
      </p>
      <p className="text-xs text-text-disabled">Coming in a future release.</p>
    </div>
  );
}
