"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    token ? "" : "確認リンクが無効です",
  );

  useEffect(() => {
    if (!token) return;

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message ?? "メールアドレスを確認しました");
        } else {
          setStatus("error");
          setMessage(data.error ?? "確認に失敗しました");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("確認に失敗しました");
      });
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← トップ
      </Link>
      <h1 className="mt-4 text-2xl font-bold">メールアドレスの確認</h1>

      <div className="mt-6 rounded-2xl border bg-white p-6">
        {status === "loading" && (
          <p className="text-sm text-gray-600">確認中...</p>
        )}
        {status === "success" && (
          <>
            <p className="text-sm text-emerald-600">{message}</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white"
            >
              トップへ
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-sm text-red-600">{message}</p>
            <p className="mt-4 text-sm text-gray-600">
              ログイン後、確認メールを再送できます。
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
            >
              ログインへ
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">読み込み中...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
