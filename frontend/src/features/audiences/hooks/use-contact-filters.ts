import { useMemo, useState } from "react";
import type { Recipient } from "@/features/audiences/types";

export function useContactFilters(contacts: Recipient[]) {
  const [search, setSearch] = useState("");

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((contact) =>
      [
        contact.email,
        contact.first_name ?? "",
        contact.last_name ?? "",
        JSON.stringify(contact.metadata ?? {}),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [contacts, search]);

  return { search, setSearch, filteredContacts };
}
