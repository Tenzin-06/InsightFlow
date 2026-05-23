import { Save, Send, TestTube2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PreviewModal } from "@/features/email-campaigns/components/preview-modal";
import type { Survey } from "@/features/surveys/types";
import type { EmailCampaignDraft } from "@/features/email-campaigns/types";

export function SendActions({
  draft,
  survey,
  onSaveDraft,
  onPrepare,
  onSchedule,
}: {
  draft: EmailCampaignDraft;
  survey?: Survey;
  onSaveDraft: () => void;
  onPrepare: () => void;
  onSchedule: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Send Actions</h3>
          <p className="text-xs text-text-secondary">
            Actions are operational at the UI level; actual delivery is deferred.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onSaveDraft}>
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <PreviewModal draft={draft} survey={survey} />
          <Button variant="outline" onClick={() => toast.info("Test email delivery will be added in a future unit")}>
            <TestTube2 className="h-4 w-4" />
            Send Test
          </Button>
          {draft.scheduleMode === "scheduled" ? (
            <Button onClick={onSchedule}>
              <Send className="h-4 w-4" />
              Schedule Campaign
            </Button>
          ) : (
            <Button onClick={onPrepare}>
              <Send className="h-4 w-4" />
              Prepare Send
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
