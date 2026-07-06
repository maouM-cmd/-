import { randomBytes } from "crypto";

export function generateSlug(): string {
  return randomBytes(4).toString("hex");
}

export function generateEditToken(): string {
  return randomBytes(16).toString("hex");
}

export function generateEventId(): string {
  return randomBytes(8).toString("hex");
}
