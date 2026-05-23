import { FileUp } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

type Props = {
  onFile: (file: File) => void;
  disabled?: boolean;
};

export function UploadDropzone({ onFile, disabled }: Props) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    multiple: false,
    noClick: true,
    disabled,
    onDrop: (files) => {
      const file = files[0];
      if (file) onFile(file);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "rounded-xl border border-dashed border-border-strong bg-bg-tertiary p-6 text-center transition-colors",
        isDragActive && "border-primary-400 bg-primary-50",
        disabled && "opacity-60"
      )}
    >
      <input {...getInputProps()} aria-label="Upload contacts CSV" />
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm dark:bg-card">
        <FileUp className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-medium text-text-primary">
        Drag a CSV here, or choose a file
      </p>
      <p className="mt-1 text-xs text-text-secondary">
        Required column: email. Optional columns: first_name, last_name.
      </p>
      <button
        type="button"
        onClick={open}
        disabled={disabled}
        className="mt-4 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-text-primary shadow-sm hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-card"
      >
        Select CSV
      </button>
    </div>
  );
}
