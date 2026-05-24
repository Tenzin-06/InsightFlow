import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/features/audiences/components/upload-dropzone";
import { UploadPreview } from "@/features/audiences/components/upload-preview";
import { useContactUpload } from "@/features/audiences/hooks/use-contact-upload";

type Props = {
  audienceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UploadModal({ audienceId, open, onOpenChange }: Props) {
  const { draft, isParsing, isUploading, isSuccess, parseFile, confirmUpload, resetUpload } =
    useContactUpload(audienceId);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) resetUpload();
  }

  // Auto-close and reset once the upload succeeds
  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
      resetUpload();
    }
  }, [isSuccess]);

  const canImport = Boolean(draft?.contacts.length) && !isUploading;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload contacts</DialogTitle>
          <DialogDescription>
            Import a CSV, review valid contacts and row errors, then confirm the import.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <UploadDropzone onFile={parseFile} disabled={isParsing || isUploading} />
          {isParsing && (
            <p className="text-sm text-text-secondary" role="status" aria-live="polite">
              Processing contacts…
            </p>
          )}
          {draft && <UploadPreview draft={draft} />}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={() => confirmUpload()}
            disabled={!canImport}
            className="bg-primary-500 hover:bg-primary-600"
          >
            {isUploading ? "Importing…" : "Confirm import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
