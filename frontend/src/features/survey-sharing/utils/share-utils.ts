export function generateShareText(title: string, url: string): string {
  return `Take this survey: "${title}"\n${url}`;
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && "share" in navigator;
}

export async function triggerNativeShare(title: string, url: string): Promise<boolean> {
  if (!canUseNativeShare()) return false;
  try {
    await navigator.share({ title, url, text: generateShareText(title, url) });
    return true;
  } catch {
    return false;
  }
}
