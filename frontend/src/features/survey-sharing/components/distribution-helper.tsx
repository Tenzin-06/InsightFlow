import { Link2, MessageSquare, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./copy-button";
import { useShareLink } from "../hooks/use-share-link";

type Props = {
  slug: string;
  onOpenShareModal?: () => void;
};

export function DistributionHelper({ slug, onOpenShareModal }: Props) {
  const { standardLink, conversationalLink } = useShareLink(slug);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">
        Quick Distribution
      </h3>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={standardLink} label="Copy Link" />
        <CopyButton text={conversationalLink} label="Copy Chat Link" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          asChild
        >
          <a href={standardLink} target="_blank" rel="noopener noreferrer">
            <Link2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Preview
          </a>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          asChild
        >
          <a href={conversationalLink} target="_blank" rel="noopener noreferrer">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Chat Preview
          </a>
        </Button>
        {onOpenShareModal && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenShareModal}
          >
            <QrCode className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            QR Code
          </Button>
        )}
      </div>
    </div>
  );
}
