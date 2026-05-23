import { useState } from "react";
import { QR_SIZES } from "../constants";
import type { QRSize } from "../types";

export function useQRCode(initialSize: QRSize = "medium") {
  const [size, setSize] = useState<QRSize>(initialSize);
  const pixelSize = QR_SIZES[size] ?? 200;
  return { size, setSize, pixelSize };
}
