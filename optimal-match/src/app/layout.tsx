import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Footer, Header } from "@/components/Header";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: "相性スコアで最適なマッチを見つけるマッチングアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-gradient-to-b from-rose-50/80 to-white font-sans text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
