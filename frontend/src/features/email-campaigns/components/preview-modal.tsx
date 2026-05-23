import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmailLayout } from "@/features/email-campaigns/components/email-layout";
import { buildPreviewHtml } from "@/features/email-campaigns/utils/preview-utils";
import type { Survey } from "@/features/surveys/types";
import type { EmailCampaignDraft } from "@/features/email-campaigns/types";

export function PreviewModal({ draft, survey }: { draft: EmailCampaignDraft; survey?: Survey }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye className="h-4 w-4" />
          Preview Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email preview</DialogTitle>
        </DialogHeader>
        <div className="rounded-xl bg-bg-tertiary p-4">
          <EmailLayout
            subject={draft.subject}
            previewText={draft.previewText}
            senderName={draft.senderName}
            html={buildPreviewHtml(draft, survey)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
