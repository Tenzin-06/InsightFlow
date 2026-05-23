import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadAudienceContacts } from "@/features/audiences/services/audience-api";
import { parseContactsFromCsv } from "@/features/audiences/utils/csv-upload";
import { apiErrorMessage, AUDIENCES_QUERY_KEY } from "@/features/audiences/hooks/use-audiences";
import type { ContactUploadDraft } from "@/features/audiences/types";

export function useContactUpload(audienceId: string) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<ContactUploadDraft | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  async function parseFile(file: File) {
    setIsParsing(true);
    try {
      const nextDraft = await parseContactsFromCsv(file);
      setDraft(nextDraft);
      if (nextDraft.contacts.length === 0) {
        toast.error("No valid contacts found");
      }
    } finally {
      setIsParsing(false);
    }
  }

  const mutation = useMutation({
    mutationFn: () =>
      uploadAudienceContacts(audienceId, {
        contacts: draft?.contacts.map(({ email, first_name, last_name }) => ({
          email,
          first_name,
          last_name,
        })) ?? [],
      }),
    onSuccess: () => {
      setDraft(null);
      queryClient.invalidateQueries({ queryKey: ["audience", audienceId] });
      queryClient.invalidateQueries({ queryKey: AUDIENCES_QUERY_KEY });
      toast.success("Contacts imported");
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, "Failed to import contacts"));
    },
  });

  return {
    draft,
    isParsing,
    isUploading: mutation.isPending,
    parseFile,
    confirmUpload: mutation.mutate,
    resetUpload: () => setDraft(null),
  };
}
