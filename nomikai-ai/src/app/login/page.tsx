import { AuthForm } from "@/components/AuthForm";
import { getOAuthErrorMessage } from "@/lib/oauth-errors";
import { isAppleOAuthEnabled } from "@/lib/apple-oauth";
import { isGoogleOAuthEnabled } from "@/lib/oauth";
import { isLineOAuthEnabled } from "@/lib/line-oauth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const oauthError = getOAuthErrorMessage(params.error);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900">ログイン</h1>
      <p className="mt-2 text-sm text-gray-600">
        ログインすると作成した飲み会をマイページで管理できます。
      </p>
      <div className="mt-6">
        <AuthForm
          mode="login"
          googleOAuthEnabled={isGoogleOAuthEnabled()}
          lineOAuthEnabled={isLineOAuthEnabled()}
          appleOAuthEnabled={isAppleOAuthEnabled()}
          oauthError={oauthError}
        />
      </div>
    </div>
  );
}
