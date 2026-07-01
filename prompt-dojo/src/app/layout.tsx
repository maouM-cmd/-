import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { EmailVerificationBanner } from "@/components/EmailVerificationBanner";
import { Footer, Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { isEmailVerified } from "@/lib/auth-checks";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description:
    "プロンプトを書いて、自動チェックとみんなの評価でスキルアップ。課題に挑戦してランキングを競おう。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-gradient-to-b from-indigo-50/80 to-white font-sans text-gray-900 antialiased">
        <Providers>
          <Header />
          <main className="flex-1">
            {user && (
              <div className="mx-auto max-w-5xl px-4 pt-4">
                <EmailVerificationBanner
                  email={user.email}
                  verified={isEmailVerified(user)}
                />
              </div>
            )}
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
