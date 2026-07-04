import { ProfileForm } from "@/components/ProfileForm";
import { getProfileByUserId } from "@/lib/db";
import { requireUser } from "@/lib/session";

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = getProfileByUserId(user.id);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">あなたのプロフィール</h1>
      <p className="mt-2 text-sm text-gray-500">
        {user.display_name} さん — 登録内容をもとに最適なマッチ相手を探します
      </p>
      <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <ProfileForm initial={profile} defaultName={user.display_name} />
      </div>
    </div>
  );
}
