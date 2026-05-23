import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteAudience } from "@/features/audiences/services/audience-api";
import { AUDIENCES_QUERY_KEY, apiErrorMessage } from "@/features/audiences/hooks/use-audiences";

export function useDeleteAudience(options?: { redirectOnSuccess?: string }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: string) => deleteAudience(id),
    onSuccess: (_, id) => {
      // Remove the deleted audience from the list cache immediately
      queryClient.removeQueries({ queryKey: ["audience", id] });
      queryClient.invalidateQueries({ queryKey: AUDIENCES_QUERY_KEY });
      toast.success("Audience deleted");
      if (options?.redirectOnSuccess) {
        navigate(options.redirectOnSuccess);
      }
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, "Failed to delete audience"));
    },
  });
}
