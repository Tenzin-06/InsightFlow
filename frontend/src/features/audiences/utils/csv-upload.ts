import Papa from "papaparse";
import type { ContactUploadDraft, ContactUploadError, ContactUploadRow } from "@/features/audiences/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CsvRow = {
  email?: string;
  first_name?: string;
  last_name?: string;
};

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim().toLowerCase());
}

export function parseContactsFromCsv(file: File): Promise<ContactUploadDraft> {
  return new Promise((resolve) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (result) => {
        const errors: ContactUploadError[] = [];
        const contacts: ContactUploadRow[] = [];
        const seen = new Set<string>();

        if (!result.meta.fields?.includes("email")) {
          resolve({
            contacts: [],
            errors: [{ rowNumber: 1, field: "email", message: "CSV must include an email column." }],
            totalRows: 0,
          });
          return;
        }

        result.errors.forEach((error) => {
          errors.push({
            rowNumber: error.row ? error.row + 2 : 1,
            field: "csv",
            message: error.message,
          });
        });

        result.data.forEach((row, index) => {
          const rowNumber = index + 2;
          const email = (row.email ?? "").trim().toLowerCase();
          const firstName = (row.first_name ?? "").trim();
          const lastName = (row.last_name ?? "").trim();

          if (!email) {
            errors.push({ rowNumber, field: "email", message: "Email is required." });
            return;
          }

          if (!isValidEmail(email)) {
            errors.push({ rowNumber, field: "email", message: "Email format is invalid." });
            return;
          }

          if (seen.has(email)) {
            errors.push({ rowNumber, field: "email", message: "Duplicate email in this upload." });
            return;
          }

          seen.add(email);
          contacts.push({
            rowNumber,
            email,
            first_name: firstName || undefined,
            last_name: lastName || undefined,
          });
        });

        resolve({ contacts, errors, totalRows: result.data.length });
      },
      error: (error) => {
        resolve({
          contacts: [],
          errors: [{ rowNumber: 1, field: "csv", message: error.message || "Unable to read this CSV file." }],
          totalRows: 0,
        });
      },
    });
  });
}

export function summarizeMetadata(metadata?: Record<string, unknown>): string {
  if (!metadata || Object.keys(metadata).length === 0) return "No metadata";
  return Object.entries(metadata)
    .slice(0, 2)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(", ");
}
