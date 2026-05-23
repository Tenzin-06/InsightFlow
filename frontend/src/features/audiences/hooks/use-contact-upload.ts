import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadAudienceContacts } from "@/features/audiences/services/audience-api";
import { parseContactsFromCsv } from "@/features/audiences/utils/csv-upload";
import { formatUploadSummary } from "@/features/audiences/utils/upload-utils";
import { apiErrorMessage, AUDIENCES_QUERY_KEY } from "@/features/audiences/hooks/use-audiences";
import type { ContactUploadDraft, UploadSummary } from "@/features/audiences/types";

export function useContactUpload(audienceId: string) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<ContactUploadDraft | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [lastSummary, setLastSummary] = useState<UploadSummary | null>(null);

  async function parseFile(file: File) {
    setIsParsing(true);
    try {
      const nextDraft = await parseContactsFromCsv(file);
      setDraft(nextDraft);
      if (nextDraft.contacts.length === 0) {
        toast.error("No valid contacts found in this file.");
      }
    } finally {
      setIsParsing(false);
    }
  }

  const mutation = useMutation({
    mutationFn: (): Promise<UploadSummary> =>
      uploadAudienceContacts(audienceId, {
        contacts: draft?.contacts.map(({ email, first_name, last_name }) => ({
          email,
          first_name,
          last_name,
        })) ?? [],
      }),
    onSuccess: (summary) => {
      setLastSummary(summary);
      setDraft(null);
      // Invalidate both the audience detail (recipient_count) and contacts list
      queryClient.invalidateQueries({ queryKey: ["audience", audienceId] });
      queryClient.invalidateQueries({ queryKey: ["audience-contacts", audienceId] });
      queryClient.invalidateQueries({ queryKey: AUDIENCES_QUERY_KEY });
      toast.success(formatUploadSummary(summary));
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, "Failed to import contacts"));
    },
  });

  return {
    draft,
    isParsing,
    isUploading: mutation.isPending,
    lastSummary,
    parseFile,
    confirmUpload: mutation.mutate,
    resetUpload: () => {
      setDraft(null);
      setLastSummary(null);
    },
  };
}
