import { summarizeMetadata } from "@/features/audiences/utils/csv-upload";
import type { Recipient } from "@/features/audiences/types";

type Props = {
  contact: Recipient;
};

export function ContactRow({ contact }: Props) {
  return (
    <tr className="border-b border-border-soft last:border-0">
      <td className="px-4 py-3 font-medium text-text-primary">{contact.email}</td>
      <td className="px-4 py-3 text-text-secondary">{contact.first_name || "-"}</td>
      <td className="px-4 py-3 text-text-secondary">{contact.last_name || "-"}</td>
      <td className="px-4 py-3 text-text-secondary">{summarizeMetadata(contact.metadata)}</td>
      <td className="px-4 py-3 text-text-secondary">
        {contact.created_at ? formatDate(contact.created_at) : "-"}
      </td>
    </tr>
  );
}

export function ContactCard({ contact }: Props) {
  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm dark:bg-card">
      <p className="font-medium text-text-primary">{contact.email}</p>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-text-muted">First name</dt>
          <dd className="text-text-secondary">{contact.first_name || "-"}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Last name</dt>
          <dd className="text-text-secondary">{contact.last_name || "-"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-text-muted">Metadata</dt>
          <dd className="text-text-secondary">{summarizeMetadata(contact.metadata)}</dd>
        </div>
      </dl>
    </article>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value)
  );
}
