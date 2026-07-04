import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function saveAvatar(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("JPEG、PNG、WebPのみアップロードできます");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("5MB以下の画像にしてください");
  }
  ensureUploadDir();
  const ext = ALLOWED_TYPES.get(file.type)!;
  const filename = `avatar-${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));
  return filename;
}

export function getUploadPath(filename: string): string | null {
  const safe = path.basename(filename);
  const filepath = path.join(UPLOAD_DIR, safe);
  return fs.existsSync(filepath) ? filepath : null;
}
