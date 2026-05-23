import { z } from "zod";

/**
 * Payload schema for the process-audience-upload task.
 * Only the audience identifier is passed; the upload record
 * is fetched from the database inside the task.
 */
export const ProcessUploadPayloadSchema = z.object({
  audienceId: z.number().int().positive(),
  uploadToken: z.string().min(1),
});

export type ProcessUploadPayload = z.infer<typeof ProcessUploadPayloadSchema>;
