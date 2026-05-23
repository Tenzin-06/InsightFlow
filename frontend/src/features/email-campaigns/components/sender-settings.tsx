import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmailCampaignDraft } from "@/features/email-campaigns/types";

export function SenderSettings({
  draft,
  onChange,
}: {
  draft: EmailCampaignDraft;
  onChange: (patch: Partial<EmailCampaignDraft>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-4 w-4 text-primary-600" />
          Sender Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sender-name">Sender Name</Label>
          <Input
            id="sender-name"
            value={draft.senderName}
            onChange={(event) => onChange({ senderName: event.target.value })}
            placeholder="InsightFlow Research Team"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reply-to">Reply-To Address</Label>
          <Input
            id="reply-to"
            value={draft.replyTo}
            onChange={(event) => onChange({ replyTo: event.target.value })}
            placeholder="research@example.edu"
            type="email"
          />
        </div>
      </CardContent>
    </Card>
  );
}
