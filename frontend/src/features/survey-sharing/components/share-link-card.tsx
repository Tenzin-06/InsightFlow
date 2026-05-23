import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "./copy-button";

type Props = {
  label: string;
  url: string;
  description?: string;
};

export function ShareLinkCard({ label, url, description }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {description && (
          <span className="text-xs text-text-muted">{description}</span>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          readOnly
          value={url}
          className="flex-1 truncate bg-muted text-xs font-mono"
          aria-label={`${label} URL`}
          onFocus={(e) => e.target.select()}
        />
        <CopyButton text={url} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          asChild
        >
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Open survey in new tab">
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </div>
  );
}
