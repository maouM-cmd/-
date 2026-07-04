import { NextResponse } from "next/server";
import { getProfileByUserId } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null, profile: null });
  }
  const profile = getProfileByUserId(user.id);
  return NextResponse.json({
    user: { id: user.id, email: user.email, display_name: user.display_name },
    profile: profile ? { id: profile.id, name: profile.name } : null,
  });
}
