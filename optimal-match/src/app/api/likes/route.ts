import { NextResponse } from "next/server";
import {
  getLikedProfileIds,
  getMutualMatches,
  getProfileById,
  getProfileByUserId,
  likeProfile,
  unlikeProfile,
} from "@/lib/db";
import { computeMatch } from "@/lib/match";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const myProfile = getProfileByUserId(user.id);
  if (!myProfile) {
    return NextResponse.json({ liked: [], mutual: [] });
  }

  const likedIds = getLikedProfileIds(user.id);
  const liked = likedIds
    .map((id) => getProfileById(id))
    .filter(Boolean)
    .map((profile) => ({
      profile,
      breakdown: computeMatch(myProfile, profile!),
      liked: true,
    }));

  const mutualRaw = getMutualMatches(user.id);
  const mutual = mutualRaw.map((m) => ({
    profile: m.profile,
    breakdown: computeMatch(myProfile, m.profile),
    liked_at: m.liked_at,
    mutual_at: m.mutual_at,
  }));

  return NextResponse.json({ liked, mutual, liked_ids: likedIds });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });

  const body = await request.json();
  const profileId = Number(body.profile_id);
  if (!profileId) {
    return NextResponse.json({ error: "profile_id required" }, { status: 400 });
  }

  const ok = likeProfile(user.id, profileId);
  const mutual = getMutualMatches(user.id).some((m) => m.profile.id === profileId);

  return NextResponse.json({ ok, liked: true, mutual });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const profileId = Number(searchParams.get("profile_id"));
  if (!profileId) {
    return NextResponse.json({ error: "profile_id required" }, { status: 400 });
  }

  unlikeProfile(user.id, profileId);
  return NextResponse.json({ ok: true, liked: false });
}
