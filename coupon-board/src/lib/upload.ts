import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function saveScreenshot(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("JPEG、PNG、WebP形式のみアップロードできます");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("ファイルサイズは5MB以下にしてください");
  }

  ensureUploadDir();

  const ext = ALLOWED_TYPES.get(file.type)!;
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  return filename;
}

export function getUploadPath(filename: string): string | null {
  const safe = path.basename(filename);
  const filepath = path.join(UPLOAD_DIR, safe);
  if (!fs.existsSync(filepath)) return null;
  return filepath;
}

export function getScreenshotUrl(filename: string | null): string | null {
  if (!filename) return null;
  return `/api/uploads/${encodeURIComponent(filename)}`;
}
