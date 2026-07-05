import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { getCurrentUser } from "@/lib/session";
import { isGoogleOAuthEnabled } from "@/lib/oauth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  const googleEnabled = isGoogleOAuthEnabled();

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">新規登録</h1>
      <p className="mt-2 text-sm text-gray-500">無料でアカウントを作成できます</p>
      <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        {googleEnabled && (
          <>
            <GoogleSignInButton />
            <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              またはメールで登録
              <span className="h-px flex-1 bg-gray-200" />
            </div>
          </>
        )}
        <AuthForm mode="signup" />
      </div>
      <p className="mt-4 text-center text-xs text-gray-400">
        <Link href="/" className="hover:underline">トップに戻る</Link>
      </p>
    </div>
  );
}
