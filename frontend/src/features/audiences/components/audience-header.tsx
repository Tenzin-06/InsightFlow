import { ArrowLeft, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description?: string | null;
  contactCount?: number;
  onBack?: () => void;
  onUpload?: () => void;
  actionLabel?: string;
};

export function AudienceHeader({
  title,
  description,
  contactCount,
  onBack,
  onUpload,
  actionLabel = "Upload CSV",
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {onBack && (
          <Button variant="ghost" size="sm" className="-ml-3 mb-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <h1 className="truncate text-2xl font-extrabold text-text-primary">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-text-secondary">{description}</p>}
        {typeof contactCount === "number" && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700">
            <Users className="h-4 w-4" />
            {contactCount} contacts
          </div>
        )}
      </div>
      {onUpload && (
        <Button onClick={onUpload} className="shrink-0 bg-primary-500 hover:bg-primary-600">
          <Upload className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
