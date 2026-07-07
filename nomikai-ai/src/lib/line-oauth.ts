import { randomBytes } from "crypto";
import { getAppUrl } from "./app-url";

export const LINE_OAUTH_STATE_COOKIE = "nomikai_line_oauth_state";

export function isLineOAuthEnabled(): boolean {
  return Boolean(process.env.LINE_CHANNEL_ID && process.env.LINE_CHANNEL_SECRET);
}

export function createLineOAuthState(): string {
  return randomBytes(24).toString("hex");
}

export function getLineAuthUrl(state: string): string {
  const clientId = process.env.LINE_CHANNEL_ID;
  if (!clientId) throw new Error("LINE_CHANNEL_ID not configured");

  const redirectUri = `${getAppUrl()}/api/auth/line/callback`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: "profile openid email",
    bot_prompt: "normal",
  });

  return `https://access.line.me/oauth2/v2.1/authorize?${params}`;
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const part = token.split(".")[1];
  if (!part) throw new Error("invalid_id_token");
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
}

export async function exchangeLineCode(code: string): Promise<{
  line_id: string;
  email: string;
  display_name: string;
}> {
  const clientId = process.env.LINE_CHANNEL_ID;
  const clientSecret = process.env.LINE_CHANNEL_SECRET;
  if (!clientId || !clientSecret) throw new Error("LINE OAuth not configured");

  const redirectUri = `${getAppUrl()}/api/auth/line/callback`;
  const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenRes.ok) throw new Error("token_exchange_failed");
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token as string;
  const idToken = tokenData.id_token as string | undefined;

  let lineId = "";
  let email = "";

  if (idToken) {
    const claims = decodeJwtPayload(idToken);
    lineId = (claims.sub as string) ?? "";
    if (typeof claims.email === "string") {
      email = claims.email.toLowerCase();
    }
  }

  const profileRes = await fetch("https://api.line.me/v2/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!profileRes.ok) throw new Error("profile_fetch_failed");

  const profile = await profileRes.json();
  if (!lineId) lineId = profile.userId as string;

  const displayName = (profile.displayName as string) || "LINEユーザー";
  if (!email) {
    email = `line+${lineId}@oauth.nomikai.local`;
  }

  return {
    line_id: lineId,
    email,
    display_name: displayName,
  };
}
