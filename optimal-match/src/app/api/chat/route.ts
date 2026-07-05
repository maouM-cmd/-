import { NextResponse } from "next/server";
import { getChatThreads } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const threads = getChatThreads(user.id);
  return NextResponse.json({ threads });
}
