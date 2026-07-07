import { AuthForm } from "@/components/AuthForm";
import { getOAuthErrorMessage } from "@/lib/oauth-errors";
import { isAppleOAuthEnabled } from "@/lib/apple-oauth";
import { getLocaleFromCookie } from "@/lib/i18n-server";
import { isGoogleOAuthEnabled } from "@/lib/oauth";
import { isLineOAuthEnabled } from "@/lib/line-oauth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocaleFromCookie();
  const oauthError = getOAuthErrorMessage(params.error);
  const t = locale === "en"
    ? {
        title: "Sign up",
        desc: "Create an organizer account to manage your events in one place.",
      }
    : {
        title: "新規登録",
        desc: "幹事アカウントを作成すると、飲み会をマイページで一覧管理できます。",
      };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
      <p className="mt-2 text-sm text-gray-600">{t.desc}</p>
      <div className="mt-6">
        <AuthForm
          mode="signup"
          googleOAuthEnabled={isGoogleOAuthEnabled()}
          lineOAuthEnabled={isLineOAuthEnabled()}
          appleOAuthEnabled={isAppleOAuthEnabled()}
          oauthError={oauthError}
          locale={locale}
        />
      </div>
    </div>
  );
}
