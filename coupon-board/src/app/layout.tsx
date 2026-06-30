import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Footer, Header } from "@/components/Header";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "初回クーポン掲示板 | お得な初回特典をみんなで共有",
  description:
    "各サービスの初回クーポン・初回特典情報を共有できる掲示板。新規登録割引、初回無料、クーポンコードなどを投稿・検索できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-gradient-to-b from-orange-50/80 to-white font-sans text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
