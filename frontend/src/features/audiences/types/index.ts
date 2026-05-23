export type AudienceMetadata = Record<string, string | number | boolean | null>;

export type RecipientMetadata = Record<string, string | number | boolean | null>;

export type Recipient = {
  id: string;
  audience?: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  metadata?: RecipientMetadata;
  created_at?: string;
};

export type Audience = {
  id: string;
  name: string;
  description?: string | null;
  metadata?: AudienceMetadata;
  recipient_count: number;
  recipients?: Recipient[];
  created_at: string;
  updated_at?: string;
};

export type CreateAudiencePayload = {
  name: string;
  description?: string;
};

export type UpdateAudiencePayload = Partial<CreateAudiencePayload>;

export type ContactUploadRow = {
  rowNumber: number;
  email: string;
  first_name?: string;
  last_name?: string;
};

export type ContactUploadError = {
  rowNumber: number;
  message: string;
  field?: "email" | "first_name" | "last_name" | "csv";
};

export type ContactUploadDraft = {
  contacts: ContactUploadRow[];
  errors: ContactUploadError[];
  totalRows: number;
};

export type UploadContactsPayload = {
  contacts: Array<{
    email: string;
    first_name?: string;
    last_name?: string;
  }>;
};

/** Summary returned by the backend upload endpoint. */
export type UploadSummary = {
  uploaded: number;
  duplicates: number;
  invalid: number;
};

/** Paginated recipients response from /audiences/:id/recipients/ */
export type AudienceRecipientPage = {
  count: number;
  limit: number;
  offset: number;
  results: Recipient[];
};

export type AudienceSortKey = "created_desc" | "created_asc" | "contacts_desc" | "contacts_asc";
