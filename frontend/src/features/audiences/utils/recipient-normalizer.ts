/**
 * recipient-normalizer.ts
 *
 * Standardizes raw contact data before it is sent to the backend.
 * Mirrors the backend normalize_contact() in validation_service.py.
 */

export type RawContact = {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  [key: string]: unknown;
};

export type NormalizedContact = {
  email: string;
  first_name?: string;
  last_name?: string;
};

/**
 * Normalize a single raw contact row:
 *  - Trims whitespace
 *  - Lowercases the email
 *  - Strips empty optional fields
 *
 * Returns null when the row cannot be normalized (e.g. missing email).
 */
export function normalizeContact(raw: RawContact): NormalizedContact | null {
  const email = (raw.email ?? "").trim().toLowerCase();
  if (!email) return null;

  const firstName = (raw.first_name ?? "").trim();
  const lastName = (raw.last_name ?? "").trim();

  return {
    email,
    ...(firstName ? { first_name: firstName } : {}),
    ...(lastName ? { last_name: lastName } : {}),
  };
}

/**
 * Normalize a batch of raw contacts.
 * Invalid rows (null) are filtered out.
 */
export function normalizeContacts(raws: RawContact[]): NormalizedContact[] {
  return raws.map(normalizeContact).filter((c): c is NormalizedContact => c !== null);
}

/**
 * Deduplicate a normalized contact list by email.
 * First occurrence wins; later duplicates are dropped.
 */
export function deduplicateContacts(contacts: NormalizedContact[]): NormalizedContact[] {
  const seen = new Set<string>();
  return contacts.filter((c) => {
    if (seen.has(c.email)) return false;
    seen.add(c.email);
    return true;
  });
}
