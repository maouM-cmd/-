import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/discover");

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">ログイン</h1>
      <p className="mt-2 text-sm text-gray-500">アカウントにログインしてマッチングを始めましょう</p>
      <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <AuthForm mode="login" />
      </div>
      <p className="mt-4 text-center text-xs text-gray-400">
        <Link href="/" className="hover:underline">トップに戻る</Link>
      </p>
    </div>
  );
}
