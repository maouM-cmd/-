import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  const manifest = {
    name: t("siteName"),
    short_name: t("siteName"),
    description: tHome("heroSubtitle"),
    start_url: `/${locale}`,
    display: "standalone",
    background_color: "#eef2ff",
    theme_color: "#4f46e5",
    lang: locale,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
