import { NextResponse } from "next/server";
import { hasLiked } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ liked: false });

  const { profileId } = await params;
  return NextResponse.json({ liked: hasLiked(user.id, Number(profileId)) });
}
