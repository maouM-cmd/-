"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { mapApiError } from "@/lib/map-api-error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations();
  const tv = useTranslations("verify");
  const tc = useTranslations("common");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );
  const [message, setMessage] = useState(
    token ? "" : tv("invalidLink"),
  );

  useEffect(() => {
    if (!token) return;

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(tv("success"));
        } else {
          setStatus("error");
          setMessage(mapApiError(data, t));
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage(tv("failed"));
      });
  }, [token, t, tv]);

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        {tc("backHome")}
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{tv("title")}</h1>

      <div className="mt-6 rounded-2xl border bg-white p-6">
        {status === "loading" && (
          <p className="text-sm text-gray-600">{tv("verifying")}</p>
        )}
        {status === "success" && (
          <>
            <p className="text-sm text-emerald-600">{message}</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white"
            >
              {tv("toHome")}
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-sm text-red-600">{message}</p>
            <p className="mt-4 text-sm text-gray-600">{tv("loginHint")}</p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
            >
              {tv("toLogin")}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  const tc = useTranslations("common");

  return (
    <Suspense fallback={<div className="p-8 text-center">{tc("loading")}</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
