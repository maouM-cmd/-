import { NextResponse } from "next/server";
import { getMyProfile, getAllProfiles } from "@/lib/db";
import { withMatches } from "@/lib/match";

export async function GET() {
  const me = getMyProfile();
  if (!me) {
    return NextResponse.json({ error: "profile_required", matches: [] }, { status: 200 });
  }
  const all = getAllProfiles();
  const matches = withMatches(me, all);
  return NextResponse.json({ me, matches });
}
