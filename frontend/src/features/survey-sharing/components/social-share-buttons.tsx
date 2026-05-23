import { Share2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canUseNativeShare, triggerNativeShare, generateShareText } from "../utils/share-utils";

type Props = {
  title: string;
  url: string;
};

export function SocialShareButtons({ title, url }: Props) {
  const hasNativeShare = canUseNativeShare();
  const shareText = encodeURIComponent(generateShareText(title, url));
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-text-primary">Share via</span>
      <div className="flex flex-wrap gap-2">
        {hasNativeShare && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => triggerNativeShare(title, url)}
          >
            <Share2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Share
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          asChild
        >
          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${shareText}`}
            aria-label="Share via email"
          >
            <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Email
          </a>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          asChild
        >
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
          >
            <svg
              className="mr-1.5 h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter / X
          </a>
        </Button>
      </div>
    </div>
  );
}
