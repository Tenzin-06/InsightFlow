import { useState } from "react";
import { Save, Send, TestTube2, Loader2 } from "lucide-react";
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
  onSendTest,
  isSaving = false,
  isPreparing = false,
  isSendingTest = false,
}: {
  draft: EmailCampaignDraft;
  survey?: Survey;
  onSaveDraft: () => void;
  onPrepare: () => void;
  onSchedule: () => void;
  onSendTest: (email: string) => void;
  isSaving?: boolean;
  isPreparing?: boolean;
  isSendingTest?: boolean;
}) {
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  function handleSendTest() {
    onSendTest(testEmail);
    setShowTestModal(false);
    setTestEmail("");
  }

  const isBusy = isSaving || isPreparing || isSendingTest;

  return (
    <>
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Send Actions</h3>
            <p className="text-xs text-text-secondary">
              Save a draft, preview the email, send a test, or prepare for delivery.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isBusy}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving…" : "Save Draft"}
            </Button>

            <PreviewModal draft={draft} survey={survey} />

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTestModal(true)}
              disabled={isBusy}
            >
              {isSendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube2 className="h-4 w-4" />}
              {isSendingTest ? "Sending…" : "Send Test"}
            </Button>

            {draft.scheduleMode === "scheduled" ? (
              <Button type="button" onClick={onSchedule} disabled={isBusy}>
                {isPreparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isPreparing ? "Scheduling…" : "Schedule Campaign"}
              </Button>
            ) : (
              <Button type="button" onClick={onPrepare} disabled={isBusy}>
                {isPreparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isPreparing ? "Saving…" : "Prepare Send"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Send Test modal ──────────────────────────────────────────────── */}
      {showTestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowTestModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-border-default bg-white p-6 shadow-xl dark:bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 text-base font-semibold text-text-primary">Send Test Email</h2>
            <p className="mb-4 text-xs text-text-secondary">
              Enter an email address to receive a preview of this campaign.
            </p>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendTest()}
              placeholder="you@example.com"
              autoFocus
              className="w-full rounded-lg border border-border-default px-3 py-2.5 text-sm text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-card"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowTestModal(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSendTest}
                disabled={!testEmail.trim() || isSendingTest}
              >
                {isSendingTest ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Send Test
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
