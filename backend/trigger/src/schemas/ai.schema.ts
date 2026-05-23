import { z } from "zod";

/**
 * Payload schema for the analyze-text AI task.
 *
 * The task receives a pre-created AIJob ID and the text to analyse.
 * All AI execution state is tracked inside Django via the AIJob model.
 */
export const AnalyzeTextPayloadSchema = z.object({
  jobId: z.number().int().positive(),
  text: z.string().min(1, "text cannot be empty"),
  jobType: z.string().optional().default("text_analysis"),
});

/**
 * Payload schema for the generate-summary AI task.
 */
export const GenerateSummaryPayloadSchema = z.object({
  jobId: z.number().int().positive(),
  text: z.string().min(1, "text cannot be empty"),
  context: z.string().optional(),
});

/**
 * Payload schema for the classify-responses AI task.
 *
 * Sends a batch of survey responses + the target label set to Django
 * for classification via the Gemini API.
 */
export const ClassifyResponsesPayloadSchema = z.object({
  jobId: z.number().int().positive(),
  responses: z.array(z.string()).min(1, "at least one response is required"),
  categories: z.array(z.string()).min(2, "at least two categories are required"),
});

/**
 * Payload schema for the generic process-ai-task workflow.
 *
 * Used when a job has already been created in Django and needs to be
 * executed based on its stored job_type and payload.
 */
export const ProcessAITaskPayloadSchema = z.object({
  jobId: z.number().int().positive(),
});

// Exported types
export type AnalyzeTextPayload = z.infer<typeof AnalyzeTextPayloadSchema>;
export type GenerateSummaryPayload = z.infer<typeof GenerateSummaryPayloadSchema>;
export type ClassifyResponsesPayload = z.infer<typeof ClassifyResponsesPayloadSchema>;
export type ProcessAITaskPayload = z.infer<typeof ProcessAITaskPayloadSchema>;
