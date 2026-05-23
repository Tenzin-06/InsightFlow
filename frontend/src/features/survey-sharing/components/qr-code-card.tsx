import { Download, Printer } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useQRCode } from "../hooks/use-qr-code";
import { downloadQRCodeAsPNG, printQRCode } from "../utils/qr-utils";
import { QR_SIZE_LABELS } from "../constants";
import type { QRSize } from "../types";

const QR_CANVAS_ID = "insightflow-qr-canvas";

type Props = {
  url: string;
  filename?: string;
};

const SIZE_OPTIONS: QRSize[] = ["small", "medium", "large"];

export function QRCodeCard({ url, filename = "survey-qr" }: Props) {
  const { size, setSize, pixelSize } = useQRCode("medium");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">QR Code</span>
        <div className="flex gap-1" role="group" aria-label="QR code size">
          {SIZE_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                size === s
                  ? "bg-primary-500 text-white"
                  : "bg-muted text-text-secondary hover:bg-muted/80"
              }`}
              aria-pressed={size === s}
            >
              {QR_SIZE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div
          className="rounded-lg border bg-white p-4 shadow-sm"
          aria-label="QR code for survey"
        >
          <QRCodeCanvas
            id={QR_CANVAS_ID}
            value={url}
            size={pixelSize}
            bgColor="#ffffff"
            fgColor="#000000"
            level="Q"
          />
        </div>

        <p className="text-center text-xs text-text-muted">
          Scan to open survey or visit:{" "}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 underline underline-offset-2"
          >
            {url}
          </a>
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => downloadQRCodeAsPNG(QR_CANVAS_ID, filename)}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Download PNG
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => printQRCode(QR_CANVAS_ID)}
          >
            <Printer className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}
