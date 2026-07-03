import { ProfileForm } from "@/components/ProfileForm";
import { getMyProfile } from "@/lib/db";

export default function ProfilePage() {
  const me = getMyProfile();

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">あなたのプロフィール</h1>
      <p className="mt-2 text-sm text-gray-500">
        登録内容をもとに、最適なマッチ相手を探します。
      </p>
      <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <ProfileForm initial={me} />
      </div>
    </div>
  );
}
