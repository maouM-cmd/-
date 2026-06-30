import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { getUploadPath } from "@/lib/upload";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ filename: string }> };

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { filename } = await context.params;
  const filepath = getUploadPath(decodeURIComponent(filename));

  if (!filepath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = filepath.slice(filepath.lastIndexOf(".")).toLowerCase();
  const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
  const buffer = fs.readFileSync(filepath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
