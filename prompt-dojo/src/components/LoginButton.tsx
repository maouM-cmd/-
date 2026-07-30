"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session, status } = useSession();
  const tc = useTranslations("common");
  const ta = useTranslations("auth");

  if (status === "loading") {
    return <span className="text-sm text-gray-400">{tc("loading")}</span>;
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
          {ta("logout")}
        </button>
      </div>
    );
  }

  const hasOAuth =
    process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_APPLE_AUTH_ENABLED === "true";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/login"
        className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-50"
      >
        {ta("login")}
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
      >
        {ta("register")}
      </Link>
      {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
        <button
          type="button"
          onClick={() => signIn("google")}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Google
        </button>
      )}
      {process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED === "true" && (
        <button
          type="button"
          onClick={() => signIn("github")}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          GitHub
        </button>
      )}
      {process.env.NEXT_PUBLIC_APPLE_AUTH_ENABLED === "true" && (
        <button
          type="button"
          onClick={() => signIn("apple")}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Apple
        </button>
      )}
      {!hasOAuth && (
        <span className="text-xs text-gray-400">{ta("emailRegisterHint")}</span>
      )}
    </div>
  );
}
