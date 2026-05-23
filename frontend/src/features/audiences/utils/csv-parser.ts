/**
 * csv-parser.ts
 *
 * Thin re-export of the full CSV parsing implementation in csv-upload.ts.
 * Keeps the spec-recommended filename while avoiding duplication.
 */

export {
  parseContactsFromCsv,
  isValidEmail,
  summarizeMetadata,
} from "@/features/audiences/utils/csv-upload";
