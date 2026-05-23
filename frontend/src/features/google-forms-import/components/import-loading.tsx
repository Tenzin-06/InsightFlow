import { useEffect, useState } from "react";
import { IMPORT_LOADING_MESSAGES } from "@/features/google-forms-import/constants";

export function ImportLoading() {
  const [msgIndex, setMsgIndex] = useState(0);

  // Cycle through loading messages every 1.8 s
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % IMPORT_LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Import in progress"
      className="flex flex-col items-center gap-5 py-6 text-center"
    >
      {/* Spinner */}
      <div
        className="h-10 w-10 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin"
        aria-hidden="true"
      />

      {/* Cycling message */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary transition-opacity duration-300">
          {IMPORT_LOADING_MESSAGES[msgIndex]}
        </p>
        <p className="text-xs text-text-muted">
          This usually takes a few seconds.
        </p>
      </div>
    </div>
  );
}
