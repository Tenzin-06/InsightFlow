import { CheckCircle2, XCircle } from "lucide-react";
import { CONTACT_PREVIEW_LIMIT } from "@/features/audiences/constants";
import { UploadErrors } from "@/features/audiences/components/upload-errors";
import type { ContactUploadDraft } from "@/features/audiences/types";

type Props = {
  draft: ContactUploadDraft;
};

export function UploadPreview({ draft }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryTile label="Valid contacts" value={draft.contacts.length} tone="success" />
        <SummaryTile label="Invalid rows" value={draft.errors.length} tone="danger" />
        <SummaryTile label="Rows scanned" value={draft.totalRows} tone="neutral" />
      </div>

      <UploadErrors errors={draft.errors} />

      {draft.contacts.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-white dark:bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Valid upload preview</caption>
            <thead className="bg-bg-tertiary text-xs uppercase text-text-muted">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Email</th>
                <th scope="col" className="px-3 py-2 font-semibold">First name</th>
                <th scope="col" className="px-3 py-2 font-semibold">Last name</th>
              </tr>
            </thead>
            <tbody>
              {draft.contacts.slice(0, CONTACT_PREVIEW_LIMIT).map((contact) => (
                <tr key={`${contact.rowNumber}-${contact.email}`} className="border-t border-border-soft">
                  <td className="px-3 py-2 font-medium text-text-primary">{contact.email}</td>
                  <td className="px-3 py-2 text-text-secondary">{contact.first_name || "-"}</td>
                  <td className="px-3 py-2 text-text-secondary">{contact.last_name || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {draft.contacts.length > CONTACT_PREVIEW_LIMIT && (
            <p className="border-t border-border-soft px-3 py-2 text-xs text-text-muted">
              Showing first {CONTACT_PREVIEW_LIMIT} valid contacts.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "danger" | "neutral";
}) {
  const Icon = tone === "danger" ? XCircle : CheckCircle2;
  const toneClass =
    tone === "danger"
      ? "bg-red-50 text-red-700"
      : tone === "success"
        ? "bg-green-50 text-green-700"
        : "bg-bg-tertiary text-text-secondary";

  return (
    <div className={`rounded-xl p-3 ${toneClass}`}>
      <div className="flex items-center gap-2 text-xs font-medium">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
