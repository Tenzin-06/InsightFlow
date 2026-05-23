import { useMemo, useState } from "react";
import type { Audience } from "@/features/audiences/types";

export function useAudienceSelection(audiences: Audience[], selectedIds: string[], onChange: (ids: string[]) => void) {
  const [query, setQuery] = useState("");

  const filteredAudiences = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return audiences;
    }

    return audiences.filter((audience) =>
      [audience.name, audience.description ?? ""].some((value) => value.toLowerCase().includes(search))
    );
  }, [audiences, query]);

  function toggleAudience(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id]);
  }

  return { query, setQuery, filteredAudiences, toggleAudience };
}
