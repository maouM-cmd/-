import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import { PwaRegister } from "@/components/PwaRegister";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/ingredients";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description:
    "化粧品販売店員向けの商品・成分暗記アプリ。出勤前に暗記、仕事中は印刷シート、退勤後にメモ。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: "#c4a484",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full`}>
      <body className="min-h-full bg-gradient-to-b from-[#fff9f5] to-[#fff4ec] font-sans text-[#2d2a26] antialiased">
        <PwaRegister />
        <div className="mx-auto min-h-full max-w-lg pb-24">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
