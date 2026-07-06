"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-sm text-gray-500 hover:text-amber-600"
    >
      ログアウト
    </button>
  );
}
