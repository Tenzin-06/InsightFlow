import type { AudienceSortKey } from "@/features/audiences/types";

export const AUDIENCE_PAGE_SIZE = 8;

export const CONTACT_PREVIEW_LIMIT = 8;

export const AUDIENCE_SORT_OPTIONS: Array<{ label: string; value: AudienceSortKey }> = [
  { label: "Newest first", value: "created_desc" },
  { label: "Oldest first", value: "created_asc" },
  { label: "Most contacts", value: "contacts_desc" },
  { label: "Fewest contacts", value: "contacts_asc" },
];
