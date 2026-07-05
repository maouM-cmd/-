import { NextResponse } from "next/server";
import { getProfileById } from "@/lib/db";
import { computeMatch } from "@/lib/match";
import { getCurrentProfile, getCurrentUser } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const me = await getCurrentProfile();
  const other = getProfileById(Number(id));

  if (!me) {
    return NextResponse.json({ error: "profile_required" }, { status: 400 });
  }
  if (!other || other.id === me.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const breakdown = computeMatch(me, other);
  return NextResponse.json({ me, profile: other, breakdown });
}
