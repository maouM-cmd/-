import { redirect } from "next/navigation";
import { getSessionTokenFromCookies } from "./auth";
import { getProfileByUserId, getUserBySession } from "./db";
import type { Profile, User } from "./types";

export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionTokenFromCookies();
  if (!token) return null;
  return getUserBySession(token);
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return getProfileByUserId(user.id);
}

export async function requireProfile(): Promise<{ user: User; profile: Profile }> {
  const user = await requireUser();
  const profile = getProfileByUserId(user.id);
  if (!profile) redirect("/profile");
  return { user, profile };
}
