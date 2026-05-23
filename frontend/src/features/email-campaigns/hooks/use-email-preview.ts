import { useMemo, useState } from "react";
import type { Survey } from "@/features/surveys/types";
import type { EmailCampaignDraft, PreviewMode } from "@/features/email-campaigns/types";
import { buildPreviewHtml } from "@/features/email-campaigns/utils/preview-utils";

export function useEmailPreview(draft: EmailCampaignDraft, survey?: Survey) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  const previewHtml = useMemo(() => buildPreviewHtml(draft, survey), [draft, survey]);

  return { previewMode, setPreviewMode, previewHtml };
}
