import { NextResponse } from "next/server";
import { getUserSubmissions } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ submissions: [], user: null });
  }
  const submissions = getUserSubmissions(user.id);
  return NextResponse.json({ submissions, user });
}
