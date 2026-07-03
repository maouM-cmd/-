import { NextResponse } from "next/server";
import { getMyProfile, getProfileById } from "@/lib/db";
import { computeMatch } from "@/lib/match";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const me = getMyProfile();
  const other = getProfileById(Number(id));
  if (!me) {
    return NextResponse.json({ error: "profile_required" }, { status: 400 });
  }
  if (!other) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const breakdown = computeMatch(me, other);
  return NextResponse.json({ me, profile: other, breakdown });
}
