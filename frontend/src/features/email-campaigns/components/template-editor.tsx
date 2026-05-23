import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { LayoutTemplate } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TemplateToolbar } from "@/features/email-campaigns/components/template-toolbar";
import { TEMPLATE_DESCRIPTIONS, TEMPLATE_LABELS } from "@/features/email-campaigns/constants";
import type { EmailCampaignDraft, EmailTemplateKey } from "@/features/email-campaigns/types";
import { useTemplatePreview } from "@/features/email-campaigns/hooks/use-template-preview";

export function TemplateEditor({
  draft,
  onChange,
  onTemplateChange,
}: {
  draft: EmailCampaignDraft;
  onChange: (patch: Partial<EmailCampaignDraft>) => void;
  onTemplateChange: (templateKey: EmailTemplateKey) => void;
}) {
  const templateSignals = useTemplatePreview(draft);
  const editor = useEditor({
    extensions: [StarterKit],
    content: draft.bodyHtml,
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] px-4 py-4 text-sm leading-6 text-text-primary outline-none [&_a]:text-primary-600 [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
        "aria-label": "Email template editor",
      },
    },
    onUpdate: ({ editor: nextEditor }) => onChange({ bodyHtml: nextEditor.getHTML() }),
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== draft.bodyHtml) {
      editor.commands.setContent(draft.bodyHtml);
    }
  }, [draft.bodyHtml, editor]);

  return (
    <Card id="email-editor">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-primary-600" />
          Email Template Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-2">
            <Label htmlFor="preview-text">Preview Text</Label>
            <Textarea
              id="preview-text"
              value={draft.previewText}
              onChange={(event) => onChange({ previewText: event.target.value })}
              placeholder="A short inbox preview line"
              className="min-h-20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-layout">Template Layout</Label>
            <Select value={draft.templateKey} onValueChange={(value) => onTemplateChange(value as EmailTemplateKey)}>
              <SelectTrigger id="template-layout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TEMPLATE_LABELS) as EmailTemplateKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {TEMPLATE_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-text-secondary">{TEMPLATE_DESCRIPTIONS[draft.templateKey]}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-bg-secondary">
          <TemplateToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
          <span className="rounded-md bg-bg-tertiary px-2 py-1">First name: {templateSignals.hasFirstName ? "included" : "missing"}</span>
          <span className="rounded-md bg-bg-tertiary px-2 py-1">Survey link: {templateSignals.hasSurveyLink ? "included" : "missing"}</span>
          <span className="rounded-md bg-bg-tertiary px-2 py-1">
            Conversational link: {templateSignals.hasConversationalLink ? "included" : "optional"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
