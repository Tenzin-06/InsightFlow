import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Eye,
  Globe,
  Lock,
  ArrowLeft,
  Plus,
  Type,
  Image,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SurveyEditor } from "@/features/surveys/components/survey-editor";
import { SurveyStatusBadge } from "@/features/surveys/components/survey-status-badge";
import { useSurvey } from "@/features/surveys/hooks/use-survey";
import { useUpdateSurvey } from "@/features/surveys/hooks/use-surveys";
import { cn } from "@/lib/utils";
import type { Survey, UpdateSurveyPayload } from "@/features/surveys/types";

type Tab = "questions" | "responses" | "settings";

export default function SurveyEditorPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const { data: survey, isLoading } = useSurvey(surveyId!);
  const updateSurvey = useUpdateSurvey();

  const [activeTab, setActiveTab] = useState<Tab>("questions");
  const addQuestionRef = useRef<(() => void) | null>(null);

  function handlePublish() {
    updateSurvey.mutate({ id: surveyId!, payload: { status: "published" } });
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="-mx-4 -my-4 min-h-[calc(100vh-4rem)] bg-[#f0f0fb] dark:bg-slate-950 md:-mx-6 md:-my-6">
        <div className="border-b bg-white/90 px-6 py-3 dark:bg-card/80">
          <Skeleton className="mx-auto h-5 w-64" />
        </div>
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="-mx-4 -my-4 flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f0f0fb] dark:bg-slate-950 md:-mx-6 md:-my-6">
        <p className="text-sm text-text-secondary">Survey not found.</p>
      </div>
    );
  }

  return (
    /* Full-bleed background that escapes the DashboardLayout's p-4/p-6 padding */
    <div className="-mx-4 -my-4 min-h-[calc(100vh-4rem)] bg-[#f0f0fb] dark:bg-slate-950 md:-mx-6 md:-my-6">

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur dark:bg-card/95">
        <div className="flex items-center px-4 py-2 md:px-6">
          {/* Back + title */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              onClick={() => navigate(`/surveys/${survey.id}`)}
              className="rounded p-1.5 text-text-muted hover:bg-muted hover:text-text-secondary"
              aria-label="Back to survey"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {survey.title}
              </p>
            </div>
            <div className="hidden sm:block">
              <SurveyStatusBadge status={survey.status} />
            </div>
          </div>

          {/* Center tabs */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex gap-0">
            {(["questions", "responses", "settings"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3 text-sm capitalize transition-colors",
                  activeTab === tab
                    ? "border-b-2 border-indigo-600 font-medium text-indigo-600"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              onClick={() => navigate(`/surveys/${survey.id}`)}
              className="rounded p-1.5 text-text-muted hover:bg-muted hover:text-text-secondary"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
            {survey.status === "draft" && (
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={updateSurvey.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Globe className="mr-1.5 h-3.5 w-3.5" />
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Questions tab ─────────────────────────────────────────────────── */}
      {activeTab === "questions" && (
        <div className="flex justify-center px-4 py-8 md:px-6">
          {/* Center column */}
          <div className="w-full min-w-0 max-w-2xl space-y-4">

            {/* Form header card — inline editable */}
            <EditableFormHeader survey={survey} onSave={(p) => updateSurvey.mutate({ id: survey.id, payload: p })} />

            {/* Question cards */}
            <SurveyEditor surveyId={survey.id} onAddRef={addQuestionRef} />
          </div>

          {/* Right floating toolbar */}
          <div className="ml-4 hidden xl:block">
            <div className="sticky top-20 flex flex-col items-center gap-1 rounded-xl border bg-white p-1.5 shadow-md dark:bg-card">
              <ToolbarButton
                icon={<Plus className="h-5 w-5" />}
                label="Add question"
                onClick={() => addQuestionRef.current?.()}
              />
              <div className="my-1 h-px w-6 bg-border" />
              <ToolbarButton
                icon={<Type className="h-5 w-5" />}
                label="Add title & description"
                onClick={() => {}}
                disabled
                title="Coming soon"
              />
              <ToolbarButton
                icon={<Image className="h-5 w-5" />}
                label="Add image"
                onClick={() => {}}
                disabled
                title="Coming soon"
              />
              <ToolbarButton
                icon={<LayoutGrid className="h-5 w-5" />}
                label="Add section"
                onClick={() => {}}
                disabled
                title="Coming soon"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Responses tab (placeholder) ──────────────────────────────────── */}
      {activeTab === "responses" && (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <p className="text-lg font-medium text-text-primary">No responses yet</p>
            <p className="mt-1 text-sm text-text-secondary">
              Responses will appear here once the survey is published and shared.
            </p>
          </div>
        </div>
      )}

      {/* ── Settings tab ─────────────────────────────────────────────────── */}
      {activeTab === "settings" && (
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm dark:bg-card dark:border-white/[0.08]">
            <h2 className="mb-5 text-base font-semibold text-text-primary">Survey Settings</h2>

            {/* Visibility */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-secondary">Visibility</p>
              <div className="flex rounded-lg border border-black/[0.08] p-1 gap-1 bg-slate-50/60 max-w-xs">
                <button
                  type="button"
                  onClick={() => updateSurvey.mutate({ id: survey.id, payload: { is_public: false } })}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    !survey.is_public
                      ? "bg-white text-text-primary shadow-sm ring-1 ring-black/[0.06]"
                      : "text-text-muted hover:text-text-secondary"
                  )}
                >
                  <Lock className="h-3.5 w-3.5" />
                  Private
                </button>
                <button
                  type="button"
                  onClick={() => updateSurvey.mutate({ id: survey.id, payload: { is_public: true } })}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    survey.is_public
                      ? "bg-white text-text-primary shadow-sm ring-1 ring-black/[0.06]"
                      : "text-text-muted hover:text-text-secondary"
                  )}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Public
                </button>
              </div>
              <p className="text-xs text-text-muted">
                {survey.is_public
                  ? "Anyone with the link can view and respond to this survey."
                  : "Only you can see this survey."}
              </p>
            </div>

            <div className="my-5 h-px bg-black/[0.06] dark:bg-white/[0.06]" />

            {/* Status */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Status</span>
              <SurveyStatusBadge status={survey.status} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditableFormHeader({
  survey,
  onSave,
}: {
  survey: Survey;
  onSave: (payload: UpdateSurveyPayload) => void;
}) {
  const [title, setTitle] = useState(survey.title);
  const [description, setDescription] = useState(survey.description ?? "");

  useEffect(() => {
    setTitle(survey.title);
    setDescription(survey.description ?? "");
  }, [survey.id]);

  return (
    <div className="overflow-hidden rounded-xl border-t-8 border-t-indigo-600 bg-white shadow-sm dark:bg-card">
      <div className="px-6 py-5">
        <input
          className="w-full bg-transparent text-2xl font-semibold text-text-primary outline-none border-b-2 border-transparent pb-1 transition-colors focus:border-indigo-500 placeholder:text-text-muted/50"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            const trimmed = title.trim();
            if (trimmed && trimmed !== survey.title) onSave({ title: trimmed });
            else if (!trimmed) setTitle(survey.title);
          }}
          placeholder="Form title"
          aria-label="Survey title"
        />
        <textarea
          className="mt-4 w-full resize-none bg-transparent text-sm text-text-secondary outline-none border-b border-transparent transition-colors focus:border-indigo-300 pb-1 placeholder:text-text-muted/40"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => {
            if (description !== (survey.description ?? "")) onSave({ description });
          }}
          placeholder="Form description (optional)"
          rows={2}
          aria-label="Survey description"
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
  disabled,
  title,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title ?? label}
      aria-label={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
        disabled
          ? "cursor-not-allowed text-text-muted/40"
          : "text-text-secondary hover:bg-indigo-50 hover:text-indigo-600"
      )}
    >
      {icon}
    </button>
  );
}
