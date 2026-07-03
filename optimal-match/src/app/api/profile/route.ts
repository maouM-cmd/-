import { NextResponse } from "next/server";
import { getMyProfile, upsertMyProfile } from "@/lib/db";
import type { CreateProfileInput } from "@/lib/types";

export async function GET() {
  const profile = getMyProfile();
  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateProfileInput;
  if (!body.name?.trim() || !body.interests?.length) {
    return NextResponse.json({ error: "name and interests required" }, { status: 400 });
  }
  const profile = upsertMyProfile({ ...body, sincerity: body.sincerity ?? 3 });
  return NextResponse.json({ profile });
}
