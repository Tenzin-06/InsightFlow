import { Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShareLinkCard } from "./share-link-card";
import { QRCodeCard } from "./qr-code-card";
import { SocialShareButtons } from "./social-share-buttons";
import { SharePreview } from "./share-preview";
import { useShareLink } from "../hooks/use-share-link";

type Props = {
  surveyId: string;
  surveyTitle: string;
  surveyDescription?: string;
  slug: string;
};

export function ShareModal({ surveyTitle, surveyDescription, slug }: Props) {
  const { standardLink, conversationalLink } = useShareLink(slug);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          Share
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Survey</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <SharePreview
            title={surveyTitle}
            description={surveyDescription}
            url={standardLink}
          />

          <Separator />

          <ShareLinkCard
            label="Survey Link"
            url={standardLink}
            description="Standard form"
          />

          <ShareLinkCard
            label="Conversational Link"
            url={conversationalLink}
            description="Chat mode"
          />

          <Separator />

          <QRCodeCard
            url={standardLink}
            filename={`${slug}-qr`}
          />

          <Separator />

          <SocialShareButtons title={surveyTitle} url={standardLink} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
