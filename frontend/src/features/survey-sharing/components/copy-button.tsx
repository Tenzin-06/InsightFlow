import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";

type Props = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyButton({ text, label = "Copy", className }: Props) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={() => copy(text)}
      aria-label={copied ? "Link copied" : label}
    >
      {copied ? (
        <>
          <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" aria-hidden="true" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </>
      )}
    </Button>
  );
}
