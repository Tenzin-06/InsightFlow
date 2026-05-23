/**
 * Download the QR code canvas as a PNG file.
 * @param canvasId - The `id` of the <canvas> element rendered by qrcode.react
 * @param filename - Downloaded file name (without extension)
 */
export function downloadQRCodeAsPNG(canvasId: string, filename: string): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/**
 * Trigger the browser print dialog, targeting only the QR element.
 */
export function printQRCode(elementId: string): void {
  const el = document.getElementById(elementId);
  if (!el) return;
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head><title>QR Code</title></head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
        ${el.outerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}
