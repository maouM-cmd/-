import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { EmailVerificationBanner } from "@/components/EmailVerificationBanner";
import { Footer, Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { isEmailVerified } from "@/lib/auth-checks";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/session";
import "../globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  return {
    title: `${t("siteName")} | ${t("tagline")}`,
    description: tHome("heroSubtitle"),
    manifest: `/${locale}/manifest.webmanifest`,
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    },
    appleWebApp: {
      capable: true,
      title: t("siteName"),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const user = await getCurrentUser();

  return (
    <html lang={locale} className={`${notoSansJP.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-gradient-to-b from-indigo-50/80 to-white font-sans text-gray-900 antialiased">
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
