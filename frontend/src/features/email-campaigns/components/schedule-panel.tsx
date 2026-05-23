import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { EmailCampaignDraft } from "@/features/email-campaigns/types";

export function SchedulePanel({
  draft,
  error,
  onChange,
}: {
  draft: EmailCampaignDraft;
  error?: string;
  onChange: (patch: Partial<EmailCampaignDraft>) => void;
}) {
  return (
    <Card id="schedule-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary-600" />
          Scheduling Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={draft.scheduleMode}
          onValueChange={(value) => onChange({ scheduleMode: value === "scheduled" ? "scheduled" : "now" })}
          className="grid gap-3 md:grid-cols-2"
        >
          <Label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg-secondary p-4">
            <RadioGroupItem value="now" className="mt-1" />
            <span>
              <span className="block text-sm font-semibold text-text-primary">Send Immediately</span>
              <span className="block text-xs text-text-secondary">Prepare this campaign for immediate delivery.</span>
            </span>
          </Label>
          <Label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg-secondary p-4">
            <RadioGroupItem value="scheduled" className="mt-1" />
            <span>
              <span className="block text-sm font-semibold text-text-primary">Schedule Send</span>
              <span className="block text-xs text-text-secondary">UI-only scheduling for a future backend unit.</span>
            </span>
          </Label>
        </RadioGroup>
        {draft.scheduleMode === "scheduled" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Date</Label>
              <Input
                id="schedule-date"
                type="date"
                value={draft.scheduledDate}
                onChange={(event) => onChange({ scheduledDate: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time">Time</Label>
              <Input
                id="schedule-time"
                type="time"
                value={draft.scheduledTime}
                onChange={(event) => onChange({ scheduledTime: event.target.value })}
              />
            </div>
          </div>
        ) : null}
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
