const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL ?? process.env.APP_BASE_URL ?? "";

export function resolveDeepLinkUrl(url: string): string | null {
  try {
    if (url.startsWith("prompt-dojo://")) {
      const path = url.replace("prompt-dojo:/", "");
      return path.startsWith("/") ? path : `/${path}`;
    }

    const parsed = new URL(url);
    if (APP_BASE_URL) {
      const base = new URL(APP_BASE_URL);
      if (parsed.origin === base.origin) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    }

    if (parsed.pathname.startsWith("/ja/") || parsed.pathname.startsWith("/en/")) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    return null;
  }
  return null;
}

export async function initCapacitorDeepLinks(): Promise<void> {
  const { Capacitor } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform()) return;

  const { App } = await import("@capacitor/app");
  await App.addListener("appUrlOpen", (event) => {
    const target = resolveDeepLinkUrl(event.url);
    if (target) {
      window.location.href = target;
    }
  });
}
