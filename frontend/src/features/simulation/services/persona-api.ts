import { DEFAULT_PERSONAS } from "@/features/simulation/constants";
import type {
  CreatePersonaPayload,
  SimulationPersona,
  UpdatePersonaPayload,
} from "@/features/simulation/types";

const STORAGE_KEY = "insightflow.simulation.personas";

function readPersonas(): SimulationPersona[] {
  if (typeof window === "undefined") {
    return DEFAULT_PERSONAS;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PERSONAS));
    return DEFAULT_PERSONAS;
  }
  try {
    const parsed = JSON.parse(raw) as SimulationPersona[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PERSONAS;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PERSONAS));
    return DEFAULT_PERSONAS;
  }
}

function writePersonas(personas: SimulationPersona[]): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(personas));
}

export async function listPersonas(): Promise<SimulationPersona[]> {
  return readPersonas();
}

export async function createPersona(payload: CreatePersonaPayload): Promise<SimulationPersona> {
  const current = readPersonas();
  const now = new Date().toISOString();
  const created: SimulationPersona = {
    id: `persona-${crypto.randomUUID()}`,
    owner_id: "local",
    usage_count: 0,
    created_at: now,
    updated_at: now,
    ...payload,
  };
  writePersonas([created, ...current]);
  return created;
}

export async function updatePersona(id: string, payload: UpdatePersonaPayload): Promise<SimulationPersona> {
  const current = readPersonas();
  const target = current.find((persona) => persona.id === id);
  if (!target) {
    throw new Error("Persona not found.");
  }
  const updated: SimulationPersona = {
    ...target,
    ...payload,
    metadata: payload.metadata ? { ...target.metadata, ...payload.metadata } : target.metadata,
    updated_at: new Date().toISOString(),
  };
  writePersonas(current.map((persona) => (persona.id === id ? updated : persona)));
  return updated;
}

