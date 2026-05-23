import { z } from "zod";

/**
 * Payload schema for the send-campaign task.
 * Passes only the minimal identifier — campaign data is
 * fetched securely inside the task to avoid bloated payloads.
 */
export const SendCampaignPayloadSchema = z.object({
  campaignId: z.number().int().positive(),
});

/**
 * Payload schema for the send-test-email task.
 */
export const SendTestEmailPayloadSchema = z.object({
  campaignId: z.number().int().positive(),
  email: z.string().email(),
});

export type SendCampaignPayload = z.infer<typeof SendCampaignPayloadSchema>;
export type SendTestEmailPayload = z.infer<typeof SendTestEmailPayloadSchema>;
