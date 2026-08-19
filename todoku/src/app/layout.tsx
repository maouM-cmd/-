import { Noto_Sans_JP } from "next/font/google";
import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description:
    "世帯の状況を聞くと、東京都の支援制度が順位付きで届く。都知事杯オープンデータ・ハッカソン2026。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full`}>
      <body className="min-h-full bg-sand font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
