import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE_NAME = "admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "prompt-dojo-admin";
}

function sessionToken(): string {
  return createHash("sha256").update(getAdminPassword()).digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === sessionToken();
}

export function verifyAdminPassword(password: string): boolean {
  return password === getAdminPassword();
}

export function getAdminSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: sessionToken(),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

export function getAdminClearCookie() {
  return { name: COOKIE_NAME, value: "", maxAge: 0 };
}
