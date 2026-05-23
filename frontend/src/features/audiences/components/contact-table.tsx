import { Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContactCard, ContactRow } from "@/features/audiences/components/contact-row";
import { AudienceEmptyState } from "@/features/audiences/components/empty-state";
import { useContactFilters } from "@/features/audiences/hooks/use-contact-filters";
import type { Recipient } from "@/features/audiences/types";

type Props = {
  contacts: Recipient[];
  onUpload: () => void;
};

export function ContactTable({ contacts, onUpload }: Props) {
  const { search, setSearch, filteredContacts } = useContactFilters(contacts);

  if (contacts.length === 0) {
    return (
      <AudienceEmptyState
        icon={Upload}
        title="Upload contacts to begin"
        description="Import a CSV with at least an email column, then review contacts before campaign targeting."
        actionLabel="Upload CSV"
        onAction={onUpload}
      />
    );
  }

  return (
    <section className="space-y-3" aria-labelledby="contacts-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="contacts-heading" className="text-lg font-semibold text-text-primary">
            Contacts
          </h2>
          <p className="text-sm text-text-secondary">
            Showing {filteredContacts.length} of {contacts.length} recipients.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by email or name..."
            className="h-9 bg-white sm:w-72 dark:bg-card"
          />
          <Button onClick={onUpload} className="h-9 bg-primary-500 hover:bg-primary-600">
            <Upload className="h-4 w-4" />
            Upload CSV
          </Button>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <AudienceEmptyState
          icon={Users}
          title="No contacts match your search"
          description="Try a different email, first name, or last name."
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-white shadow-sm md:block dark:bg-card">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Audience contact list</caption>
              <thead className="bg-bg-tertiary text-xs uppercase text-text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-4 py-3 font-semibold">First name</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Last name</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Metadata</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Added</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <ContactRow key={contact.id} contact={contact} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
