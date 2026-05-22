import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CreateSurveyPayload } from "@/features/surveys/types";

const surveySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  description: z.string().max(1000, "Description must be under 1000 characters").optional(),
  is_public: z.boolean(),
});

type FormValues = z.infer<typeof surveySchema>;

type Props = {
  onSubmit: (data: CreateSurveyPayload) => void;
  isLoading?: boolean;
  defaultValues?: Partial<FormValues>;
  submitLabel?: string;
};

export function SurveyForm({ onSubmit, isLoading, defaultValues, submitLabel = "Create Survey" }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: { is_public: false, ...defaultValues },
  });

  const isPublic = watch("is_public");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Customer Satisfaction Survey"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive" role="alert">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Briefly describe what this survey is about (optional)"
          rows={3}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive" role="alert">{errors.description.message}</p>
        )}
      </div>

      {/* Visibility */}
      <div className="space-y-1.5">
        <Label>Visibility</Label>
        <div className="flex rounded-lg border border-black/[0.08] p-1 gap-1 bg-slate-50/60">
          <button
            type="button"
            onClick={() => setValue("is_public", false)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              !isPublic
                ? "bg-white text-text-primary shadow-sm ring-1 ring-black/[0.06]"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <Lock className="h-3.5 w-3.5" />
            Private
          </button>
          <button
            type="button"
            onClick={() => setValue("is_public", true)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isPublic
                ? "bg-white text-text-primary shadow-sm ring-1 ring-black/[0.06]"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <Globe className="h-3.5 w-3.5" />
            Public
          </button>
        </div>
        <p className="text-xs text-text-muted">
          {isPublic
            ? "Anyone with the link can view and respond to this survey."
            : "Only you can see this survey."}
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-500 hover:bg-primary-600 sm:w-auto"
      >
        {isLoading ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
