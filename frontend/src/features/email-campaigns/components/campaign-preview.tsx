import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailLayout } from "@/features/email-campaigns/components/email-layout";
import { useEmailPreview } from "@/features/email-campaigns/hooks/use-email-preview";
import type { Survey } from "@/features/surveys/types";
import type { EmailCampaignDraft } from "@/features/email-campaigns/types";

export function CampaignPreview({ draft, survey }: { draft: EmailCampaignDraft; survey?: Survey }) {
  const { previewMode, setPreviewMode, previewHtml } = useEmailPreview(draft, survey);

  return (
    <Card id="campaign-preview">
      <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Preview Area</CardTitle>
        <div className="flex rounded-lg border border-border bg-bg-tertiary p-1">
          <Button
            variant={previewMode === "desktop" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("desktop")}
            aria-pressed={previewMode === "desktop"}
          >
            <Monitor className="h-4 w-4" />
            Desktop
          </Button>
          <Button
            variant={previewMode === "mobile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("mobile")}
            aria-pressed={previewMode === "mobile"}
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="rounded-b-xl bg-bg-tertiary p-4">
        <EmailLayout
          compact={previewMode === "mobile"}
          subject={draft.subject}
          previewText={draft.previewText}
          senderName={draft.senderName}
          html={previewHtml}
        />
      </CardContent>
    </Card>
  );
}
