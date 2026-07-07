import { auth } from "@/auth";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { SESSION_COOKIE } from "./constants";
import { getUserById, getUserBySessionToken } from "./db";
import type { User } from "./types";

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const authSession = await auth();
  if (authSession?.user?.id) {
    return getUserById(authSession.user.id);
  }

  const token = await getSessionToken();
  if (!token) return null;
  return getUserBySessionToken(token);
}

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function getSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    },
  };
}
