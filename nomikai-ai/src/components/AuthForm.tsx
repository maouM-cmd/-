"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AppleSignInButton,
  GoogleSignInButton,
  LineSignInButton,
} from "@/components/GoogleSignInButton";
import { withLang, type Locale } from "@/lib/i18n";

export function AuthForm({
  mode,
  googleOAuthEnabled,
  lineOAuthEnabled,
  appleOAuthEnabled,
  oauthError,
  locale,
}: {
  mode: "login" | "signup";
  googleOAuthEnabled: boolean;
  lineOAuthEnabled: boolean;
  appleOAuthEnabled: boolean;
  oauthError?: string | null;
  locale: Locale;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(oauthError ?? "");
  const [loading, setLoading] = useState(false);

  const socialEnabled = googleOAuthEnabled || lineOAuthEnabled || appleOAuthEnabled;
  const t = locale === "en"
    ? {
        or: "or",
        name: "Display name",
        email: "Email",
        password: "Password",
        namePlaceholder: "Taro",
        passwordPlaceholderSignup: "At least 8 characters",
        error: "An error occurred",
        processing: "Processing...",
        login: "Log in",
        signup: "Create account",
        noAccount: "No account?",
        toSignup: "Sign up",
        hasAccount: "Already have an account?",
        toLogin: "Log in",
      }
    : {
        or: "または",
        name: "表示名",
        email: "メールアドレス",
        password: "パスワード",
        namePlaceholder: "たろう",
        passwordPlaceholderSignup: "8文字以上",
        error: "エラーが発生しました",
        processing: "処理中...",
        login: "ログイン",
        signup: "アカウント作成",
        noAccount: "アカウントがない？",
        toSignup: "新規登録",
        hasAccount: "既にアカウントがある？",
        toLogin: "ログイン",
      };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body =
      mode === "login"
        ? { email, password }
        : { email, password, display_name: displayName };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? t.error);
      return;
    }

    window.location.href = withLang("/my", locale);
  }

  return (
    <div className="space-y-4">
      {socialEnabled && (
        <>
          <div className="space-y-2">
            {lineOAuthEnabled && <LineSignInButton enabled={lineOAuthEnabled} />}
            {googleOAuthEnabled && <GoogleSignInButton enabled={googleOAuthEnabled} />}
            {appleOAuthEnabled && <AppleSignInButton enabled={appleOAuthEnabled} />}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-amber-50/30 px-2 text-gray-500">{t.or}</span>
            </div>
          </div>
        </>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">{t.name}</label>
            <input
              className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-3"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t.namePlaceholder}
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t.email}</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t.password}</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? t.passwordPlaceholderSignup : "••••••••"}
            minLength={mode === "signup" ? 8 : 1}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-amber-500 font-bold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? t.processing : mode === "login" ? t.login : t.signup}
        </button>
        <p className="text-center text-sm text-gray-500">
          {mode === "login" ? (
            <>
              {t.noAccount}{" "}
              <Link href={withLang("/signup", locale)} className="font-medium text-amber-600 hover:underline">
                {t.toSignup}
              </Link>
            </>
          ) : (
            <>
              {t.hasAccount}{" "}
              <Link href={withLang("/login", locale)} className="font-medium text-amber-600 hover:underline">
                {t.toLogin}
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
