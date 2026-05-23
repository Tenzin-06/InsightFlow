import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SUBJECT_RECOMMENDED_MAX } from "@/features/email-campaigns/constants";
import { VariableInsertMenu } from "@/features/email-campaigns/components/variable-insert-menu";
import type { EmailCampaignDraft, EmailCampaignValidationErrors } from "@/features/email-campaigns/types";
import { insertVariableAtCursor } from "@/features/email-campaigns/utils/variable-utils";

export function SubjectLineInput({
  draft,
  error,
  onChange,
}: {
  draft: EmailCampaignDraft;
  error?: EmailCampaignValidationErrors["subject"];
  onChange: (patch: Partial<EmailCampaignDraft>) => void;
}) {
  const subjectLength = draft.subject.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary-600" />
          Subject Line
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="min-w-0 flex-1 space-y-2">
            <Label htmlFor="subject-line">Email subject</Label>
            <Input
              id="subject-line"
              value={draft.subject}
              onChange={(event) => onChange({ subject: event.target.value })}
              placeholder="We would value your survey response"
              aria-invalid={Boolean(error)}
            />
          </div>
          <VariableInsertMenu
            onInsert={(variable) => onChange({ subject: insertVariableAtCursor(draft.subject, variable) })}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className={subjectLength > SUBJECT_RECOMMENDED_MAX ? "text-warning" : "text-text-secondary"}>
            Recommended: under {SUBJECT_RECOMMENDED_MAX} characters · {subjectLength} used
          </span>
          <span className="rounded-md bg-bg-tertiary px-2 py-1 text-text-secondary">
            Preview: {draft.subject || "Your subject will appear here"}
          </span>
        </div>
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
