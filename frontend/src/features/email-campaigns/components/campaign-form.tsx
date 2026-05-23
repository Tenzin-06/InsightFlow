import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Survey } from "@/features/surveys/types";
import type { EmailCampaignDraft, EmailCampaignValidationErrors } from "@/features/email-campaigns/types";

export function CampaignForm({
  draft,
  surveys,
  errors,
  onChange,
}: {
  draft: EmailCampaignDraft;
  surveys: Survey[];
  errors: EmailCampaignValidationErrors;
  onChange: (patch: Partial<EmailCampaignDraft>) => void;
}) {
  return (
    <Card id="campaign-settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary-600" />
          Campaign Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="campaign-name">Campaign Name</Label>
          <Input
            id="campaign-name"
            value={draft.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="Student feedback outreach"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="text-xs text-danger">{errors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="campaign-survey">Survey</Label>
          <Select value={draft.surveyId} onValueChange={(surveyId) => onChange({ surveyId })}>
            <SelectTrigger id="campaign-survey" aria-invalid={Boolean(errors.surveyId)}>
              <SelectValue placeholder="Select a survey" />
            </SelectTrigger>
            <SelectContent>
              {surveys.map((survey) => (
                <SelectItem key={survey.id} value={String(survey.id)}>
                  {survey.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.surveyId ? <p className="text-xs text-danger">{errors.surveyId}</p> : null}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="internal-notes">Internal Notes</Label>
          <Textarea
            id="internal-notes"
            value={draft.internalNotes}
            onChange={(event) => onChange({ internalNotes: event.target.value })}
            placeholder="Optional notes for your team"
            className="min-h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
}
