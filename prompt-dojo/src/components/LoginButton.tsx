"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-sm text-gray-400">読み込み中...</span>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-indigo-800">
          {session.user.name ?? session.user.email}
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          className="rounded-lg border border-indigo-200 px-3 py-1.5 text-xs text-indigo-700 hover:bg-indigo-50"
        >
          ログアウト
        </button>
      </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google")}
      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
    >
      Googleでログイン
    </button>
  );
}
