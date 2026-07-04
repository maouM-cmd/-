import Link from "next/link";
import { DiscoverView } from "@/components/DiscoverView";
import { getMyProfile, getAllProfiles } from "@/lib/db";
import { withMatches } from "@/lib/match";

export default function DiscoverPage() {
  const me = getMyProfile();

  if (!me) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">プロフィールが必要です</h1>
        <p className="mt-2 text-sm text-gray-500">
          まずあなたの情報を登録してから、最適マッチを表示できます。
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-block rounded-xl bg-rose-500 px-6 py-3 font-bold text-white"
        >
          プロフィールを作成
        </Link>
      </div>
    );
  }

  const matches = withMatches(me, getAllProfiles());

  return <DiscoverView meName={me.name} matches={matches} />;
}
