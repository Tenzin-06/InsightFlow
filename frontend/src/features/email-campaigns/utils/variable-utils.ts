import type { PersonalizationVariable } from "@/features/email-campaigns/types";

export function formatVariable(key: string): string {
  return `{{${key}}}`;
}

export function insertVariableAtCursor(value: string, variable: PersonalizationVariable): string {
  return `${value}${formatVariable(variable.key)}`;
}

export function replaceVariables(html: string, replacements: Record<string, string>): string {
  return Object.entries(replacements).reduce(
    (content, [key, value]) => content.replaceAll(formatVariable(key), value),
    html
  );
}
