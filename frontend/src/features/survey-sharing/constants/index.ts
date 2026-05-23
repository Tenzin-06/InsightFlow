import { ENV } from "@/lib/env";

export const APP_BASE_URL = ENV.APP_BASE_URL;

export const QR_SIZES: Record<string, number> = {
  small: 128,
  medium: 200,
  large: 300,
};

export const QR_SIZE_LABELS: Record<string, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};
