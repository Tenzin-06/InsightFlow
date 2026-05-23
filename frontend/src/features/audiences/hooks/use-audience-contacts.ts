import { useQuery } from "@tanstack/react-query";
import { getAudienceRecipients } from "@/features/audiences/services/audience-api";
import type { AudienceRecipientPage } from "@/features/audiences/types";

type UseAudienceContactsOptions = {
  audienceId?: string;
  q?: string;
  limit?: number;
  offset?: number;
};

/**
 * Fetches paginated recipients for an audience from the dedicated
 * /audiences/:id/recipients/ endpoint.
 *
 * Supports search (q), limit, and offset parameters.
 */
export function useAudienceContacts({
  audienceId,
  q = "",
  limit = 50,
  offset = 0,
}: UseAudienceContactsOptions) {
  return useQuery<AudienceRecipientPage>({
    queryKey: ["audience-contacts", audienceId, { q, limit, offset }],
    queryFn: () =>
      getAudienceRecipients(audienceId ?? "", { q: q || undefined, limit, offset }),
    enabled: Boolean(audienceId),
    staleTime: 30_000, // 30 s — contacts change after uploads, not on every render
  });
}
