import { useState, useEffect, useRef, useCallback } from "react";
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
  Check,
  AlertCircle,
  Loader2,
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
type SaveStatus = "idle" | "saving" | "saved" | "error";

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-text-muted animate-pulse">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving…
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-success">
        <Check className="h-3 w-3" />
        Saved
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-danger">
      <AlertCircle className="h-3 w-3" />
      Error saving
    </span>
  );
}

export default function SurveyEditorPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const { data: survey, isLoading } = useSurvey(surveyId!);
  const updateSurvey = useUpdateSurvey();

  const [activeTab, setActiveTab] = useState<Tab>("questions");
  const addQuestionRef = useRef<(() => void) | null>(null);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const surveyPending = updateSurvey.isPending;
  const surveyError   = updateSurvey.isError;
  const surveySuccess = updateSurvey.isSuccess;

  useEffect(() => {
    if (surveyPending) {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      setSaveStatus("saving");
    } else if (surveyError) {
      setSaveStatus("error");
    } else if (surveySuccess) {
      setSaveStatus("saved");
      savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
    }
    return () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current); };
  }, [surveyPending, surveyError, surveySuccess]);

  const handleQuestionSaveState = useCallback((state: "idle" | "saving" | "error") => {
    if (state === "saving") {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      setSaveStatus("saving");
    } else if (state === "error") {
      setSaveStatus("error");
    } else if (saveStatus === "saving") {
      setSaveStatus("saved");
      savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
    }
  }, [saveStatus]);

  function handlePublish() {
    updateSurvey.mutate({ id: surveyId!, payload: { status: "published" } });
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="-mx-4 -my-4 min-h-[calc(100vh-4rem)] bg-[#F5F7FB] md:-mx-6 md:-my-6">
        <div className="border-b border-[#E2E8F0] bg-white px-6 py-3 shadow-sm">
          <Skeleton className="mx-auto h-5 w-64" />
        </div>
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="-mx-4 -my-4 flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F5F7FB] md:-mx-6 md:-my-6">
        <p className="text-sm text-[#475569]">Survey not found.</p>
      </div>
    );
  }

  return (
    /* Canvas — always light, never dark */
    <div className="-mx-4 -my-4 min-h-[calc(100vh-4rem)] bg-[#F5F7FB] md:-mx-6 md:-my-6">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex items-center px-4 md:px-6">

          {/* Left: back + title + status */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5 py-2.5">
            <button
              onClick={() => navigate(`/surveys/${survey.id}`)}
              className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#475569]"
              aria-label="Back to survey"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p className="truncate text-sm font-semibold text-[#0F172A]">
              {survey.title}
            </p>
            <div className="hidden sm:flex items-center gap-2.5">
              <SurveyStatusBadge status={survey.status} />
              <SaveIndicator status={saveStatus} />
            </div>
          </div>

          {/* Center: tabs */}
          <nav className="absolute left-1/2 flex -translate-x-1/2" aria-label="Editor sections">
            {(["questions", "responses", "settings"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-3.5 text-sm font-medium capitalize transition-colors",
                  activeTab === tab
                    ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
                    : "text-[#475569] hover:text-[#0F172A]"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="flex flex-1 items-center justify-end gap-2 py-2.5">
            <button
              onClick={() => navigate(`/surveys/${survey.id}`)}
              className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#475569]"
              title="Preview survey"
              aria-label="Preview survey"
            >
              <Eye className="h-4 w-4" />
            </button>

            {survey.status === "draft" && (
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={updateSurvey.isPending}
                className="gap-1.5 bg-[#3B82F6] text-white hover:bg-[#2563EB]"
              >
                {updateSurvey.isPending
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Globe className="h-3.5 w-3.5" />
                }
                Publish
              </Button>
            )}

            {survey.status === "published" && (
              <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                <Globe className="h-3 w-3" />
                Live
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Questions tab ─────────────────────────────────────────────────── */}
      {activeTab === "questions" && (
        <div className="flex justify-center px-4 py-8 md:px-6">

          {/* Center column */}
          <div className="w-full min-w-0 max-w-2xl space-y-3">
            <EditableFormHeader
              survey={survey}
              onSave={(p) => updateSurvey.mutate({ id: survey.id, payload: p })}
            />
            <SurveyEditor
              surveyId={survey.id}
              onAddRef={addQuestionRef}
              onSaveStateChange={handleQuestionSaveState}
            />
          </div>

          {/* Right floating toolbar */}
          <div className="ml-4 hidden xl:block">
            <div className="sticky top-20 flex flex-col items-center gap-0.5 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-md">
              <ToolbarButton
                icon={<Plus className="h-5 w-5" />}
                label="Add question"
                onClick={() => addQuestionRef.current?.()}
              />
              <div className="my-1 h-px w-6 bg-[#E2E8F0]" />
              <ToolbarButton icon={<Type className="h-5 w-5" />}       label="Add title block" onClick={() => {}} disabled title="Coming soon" />
              <ToolbarButton icon={<Image className="h-5 w-5" />}      label="Add image"       onClick={() => {}} disabled title="Coming soon" />
              <ToolbarButton icon={<LayoutGrid className="h-5 w-5" />} label="Add section"     onClick={() => {}} disabled title="Coming soon" />
            </div>
          </div>
        </div>
      )}

      {/* ── Responses tab ─────────────────────────────────────────────────── */}
      {activeTab === "responses" && (
        <div className="flex items-center justify-center py-24">
          <div className="rounded-xl border border-[#E2E8F0] bg-white px-10 py-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9]">
              <Globe className="h-6 w-6 text-[#94A3B8]" />
            </div>
            <p className="text-base font-semibold text-[#0F172A]">No responses yet</p>
            <p className="mt-1.5 max-w-xs text-sm text-[#475569]">
              Responses will appear here once the survey is published and shared.
            </p>
          </div>
        </div>
      )}

      {/* ── Settings tab ──────────────────────────────────────────────────── */}
      {activeTab === "settings" && (
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

            <div className="px-6 py-5">
              <h2 className="text-base font-semibold text-[#0F172A]">Survey Settings</h2>
              <p className="mt-0.5 text-sm text-[#475569]">Manage visibility and publishing options.</p>
            </div>
            <div className="h-px bg-[#EEF2F7]" />

            {/* Visibility toggle */}
            <div className="px-6 py-5">
              <p className="mb-3 text-sm font-medium text-[#0F172A]">Visibility</p>
              <div className="flex max-w-xs gap-1 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-1">
                <button
                  type="button"
                  onClick={() => updateSurvey.mutate({ id: survey.id, payload: { is_public: false } })}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                    !survey.is_public
                      ? "bg-white text-[#0F172A] shadow-sm"
                      : "text-[#94A3B8] hover:text-[#475569]"
                  )}
                >
                  <Lock className="h-3.5 w-3.5" />
                  Private
                </button>
                <button
                  type="button"
                  onClick={() => updateSurvey.mutate({ id: survey.id, payload: { is_public: true } })}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                    survey.is_public
                      ? "bg-white text-[#0F172A] shadow-sm"
                      : "text-[#94A3B8] hover:text-[#475569]"
                  )}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Public
                </button>
              </div>
              <p className="mt-2.5 text-xs text-[#94A3B8]">
                {survey.is_public
                  ? "Anyone with the link can view and respond to this survey."
                  : "Only you can access this survey."}
              </p>
            </div>

            <div className="h-px bg-[#EEF2F7]" />

            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Status</p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">Current publishing state</p>
              </div>
              <SurveyStatusBadge status={survey.status} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Editable form header ──────────────────────────────────────────────────────

function EditableFormHeader({
  survey,
  onSave,
}: {
  survey: Survey;
  onSave: (payload: UpdateSurveyPayload) => void;
}) {
  const [title, setTitle]             = useState(survey.title);
  const [description, setDescription] = useState(survey.description ?? "");

  useEffect(() => {
    setTitle(survey.title);
    setDescription(survey.description ?? "");
  }, [survey.id]);

  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
      {/* Brand accent stripe */}
      <div className="h-1.5 w-full bg-[#3B82F6]" />
      <div className="px-6 py-5">
        <input
          className="w-full bg-transparent text-[22px] font-bold text-[#0F172A] outline-none placeholder:text-[#94A3B8] border-b-2 border-transparent pb-1 transition-colors focus:border-[#3B82F6]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            const trimmed = title.trim();
            if (trimmed && trimmed !== survey.title) onSave({ title: trimmed });
            else if (!trimmed) setTitle(survey.title);
          }}
          placeholder="Survey title"
          aria-label="Survey title"
        />
        <textarea
          className="mt-4 w-full resize-none bg-transparent text-sm text-[#475569] outline-none border-b border-transparent transition-colors focus:border-[#C7DDFF] pb-1 placeholder:text-[#94A3B8]/60"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => {
            if (description !== (survey.description ?? "")) onSave({ description });
          }}
          placeholder="Survey description (optional)"
          rows={2}
          aria-label="Survey description"
        />
      </div>
    </div>
  );
}

// ── Floating toolbar button ───────────────────────────────────────────────────

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
          ? "cursor-not-allowed text-[#94A3B8]/30"
          : "text-[#475569] hover:bg-[#EEF4FF] hover:text-[#3B82F6]"
      )}
    >
      {icon}
    </button>
  );
}
