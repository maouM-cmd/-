import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { getUploadPath } from "@/lib/upload";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const filepath = getUploadPath(decodeURIComponent(filename));
  if (!filepath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const ext = filepath.slice(filepath.lastIndexOf(".")).toLowerCase();
  const buffer = fs.readFileSync(filepath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
