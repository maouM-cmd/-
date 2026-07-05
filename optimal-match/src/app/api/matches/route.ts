import { NextResponse } from "next/server";
import { getDiscoverableProfiles } from "@/lib/db";
import { withMatches } from "@/lib/match";
import { getCurrentProfile, getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "profile_required", matches: [] }, { status: 200 });
  }

  const others = getDiscoverableProfiles(profile.id);
  const matches = withMatches(profile, others);
  return NextResponse.json({ me: profile, matches });
}
