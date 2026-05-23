import { z } from "zod";

export const SimulationRunPayloadSchema = z.object({
  simulationRunId: z.number().int().positive(),
});

export type SimulationRunPayload = z.infer<typeof SimulationRunPayloadSchema>;

