import { useQuery } from "@tanstack/react-query";
import { getAudienceById } from "@/features/audiences/services/audience-api";

export function useAudienceDetail(id?: string) {
  return useQuery({
    queryKey: ["audience", id],
    queryFn: () => getAudienceById(id ?? ""),
    enabled: Boolean(id),
  });
}
