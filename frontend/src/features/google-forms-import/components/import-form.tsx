import { useEffect, useRef } from "react";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImportForm } from "@/features/google-forms-import/hooks/use-import-form";
import type { ImportFormValues } from "@/features/google-forms-import/types";

type Props = {
  onSubmit: (values: ImportFormValues) => void;
  isPending: boolean;
};

export function ImportForm({ onSubmit, isPending }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useImportForm();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref: registerRef, ...registerRest } = register("url");

  // Auto-focus the URL input when the form mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Google Forms import form"
    >
      <div className="space-y-2">
        <Label htmlFor="google-form-url" className="text-sm font-medium text-text-primary">
          Google Forms URL <span className="text-danger" aria-hidden="true">*</span>
        </Label>

        <div className="relative">
          <Link2
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <Input
            id="google-form-url"
            type="url"
            placeholder="https://docs.google.com/forms/d/…"
            className="pl-9"
            disabled={isPending}
            aria-describedby={errors.url ? "url-error" : "url-hint"}
            aria-invalid={!!errors.url}
            {...registerRest}
            ref={(el) => {
              registerRef(el);
              inputRef.current = el;
            }}
          />
        </div>

        {errors.url ? (
          <p
            id="url-error"
            role="alert"
            className="text-xs text-danger flex items-center gap-1"
          >
            {errors.url.message}
          </p>
        ) : (
          <p id="url-hint" className="text-xs text-text-muted">
            Paste the full Google Forms link, e.g. https://docs.google.com/forms/d/…
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid || isPending}
        className="mt-5 w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
        aria-busy={isPending}
      >
        {isPending ? "Importing…" : "Import Survey"}
      </Button>
    </form>
  );
}
