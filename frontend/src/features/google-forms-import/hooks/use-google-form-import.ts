import { useMutation } from "@tanstack/react-query";
import { importGoogleForm } from "@/features/google-forms-import/services/google-form-import-api";
import { classifyImportError, sanitizeUrl } from "@/features/google-forms-import/utils";
import type { ImportError, ImportResult } from "@/features/google-forms-import/types";

type UseGoogleFormImportOptions = {
  onSuccess?: (result: ImportResult) => void;
  onError?: (error: ImportError) => void;
};

export function useGoogleFormImport(options?: UseGoogleFormImportOptions) {
  const mutation = useMutation<ImportResult, unknown, string>({
    mutationFn: (url: string) => importGoogleForm({ url: sanitizeUrl(url) }),
    onSuccess: (result) => {
      options?.onSuccess?.(result);
    },
    onError: (error) => {
      const code = classifyImportError(error);
      options?.onError?.({ code, message: String(error) });
    },
  });

  return {
    importForm: (url: string) => mutation.mutate(url),
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    result: mutation.data ?? null,
    reset: mutation.reset,
  };
}
