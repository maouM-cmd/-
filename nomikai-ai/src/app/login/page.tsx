import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900">ログイン</h1>
      <p className="mt-2 text-sm text-gray-600">
        ログインすると作成した飲み会をマイページで管理できます。
      </p>
      <div className="mt-6">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
