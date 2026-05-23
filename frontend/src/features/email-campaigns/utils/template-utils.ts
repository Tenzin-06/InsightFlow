import { TEMPLATE_HTML } from "@/features/email-campaigns/constants";
import type { EmailTemplateKey } from "@/features/email-campaigns/types";

export function getTemplateHtml(templateKey: EmailTemplateKey): string {
  return TEMPLATE_HTML[templateKey];
}

export function isReminderPlaceholder(templateKey: EmailTemplateKey): boolean {
  return templateKey === "reminder_placeholder";
}
