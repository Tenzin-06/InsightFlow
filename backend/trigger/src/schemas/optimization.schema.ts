import { z } from "zod";

/**
 * Payload schema for process-nonrespondents task.
 * Identifies non-respondents for a given campaign.
 */
export const ProcessNonrespondentsPayloadSchema = z.object({
  campaignId: z.number().int().positive(),
});

export type ProcessNonrespondentsPayload = z.infer<
  typeof ProcessNonrespondentsPayloadSchema
>;

/**
 * Payload schema for evaluate-opt-rules task.
 * Runs the full optimization rule engine for a campaign.
 */
export const EvaluateOptRulesPayloadSchema = z.object({
  campaignId: z.number().int().positive(),
});

export type EvaluateOptRulesPayload = z.infer<
  typeof EvaluateOptRulesPayloadSchema
>;

/**
 * Payload schema for trigger-followups task.
 * Triggers follow-up reminders for a campaign.
 */
export const TriggerFollowupsPayloadSchema = z.object({
  campaignId: z.number().int().positive(),
});

export type TriggerFollowupsPayload = z.infer<
  typeof TriggerFollowupsPayloadSchema
>;

/**
 * Payload schema for generate-segments task.
 * Generates engagement segments for all delivered recipients.
 */
export const GenerateSegmentsPayloadSchema = z.object({
  campaignId: z.number().int().positive(),
});

export type GenerateSegmentsPayload = z.infer<
  typeof GenerateSegmentsPayloadSchema
>;
