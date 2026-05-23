import { z } from "zod";

export const ExecuteScheduledCampaignPayloadSchema = z.object({
  scheduleId: z.number().int().positive(),
});

export const ReminderPayloadSchema = z.object({
  campaignId: z.number().int().positive(),
  delayDays: z.union([z.literal(1), z.literal(3), z.literal(7)]),
});

export type ExecuteScheduledCampaignPayload = z.infer<
  typeof ExecuteScheduledCampaignPayloadSchema
>;
export type ReminderPayload = z.infer<typeof ReminderPayloadSchema>;

