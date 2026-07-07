import { AuthForm } from "@/components/AuthForm";
import { getOAuthErrorMessage } from "@/lib/oauth-errors";
import { isAppleOAuthEnabled } from "@/lib/apple-oauth";
import { isGoogleOAuthEnabled } from "@/lib/oauth";
import { isLineOAuthEnabled } from "@/lib/line-oauth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const oauthError = getOAuthErrorMessage(params.error);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900">新規登録</h1>
      <p className="mt-2 text-sm text-gray-600">
        幹事アカウントを作成すると、飲み会をマイページで一覧管理できます。
      </p>
      <div className="mt-6">
        <AuthForm
          mode="signup"
          googleOAuthEnabled={isGoogleOAuthEnabled()}
          lineOAuthEnabled={isLineOAuthEnabled()}
          appleOAuthEnabled={isAppleOAuthEnabled()}
          oauthError={oauthError}
        />
      </div>
    </div>
  );
}
