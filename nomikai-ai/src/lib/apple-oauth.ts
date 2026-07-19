import { createPrivateKey, randomBytes, sign } from "crypto";
import { getAppUrl } from "./app-url";

export const APPLE_OAUTH_STATE_COOKIE = "nomikai_apple_oauth_state";

export function isAppleOAuthEnabled(): boolean {
  return Boolean(
    process.env.APPLE_CLIENT_ID &&
      process.env.APPLE_TEAM_ID &&
      process.env.APPLE_KEY_ID &&
      process.env.APPLE_PRIVATE_KEY
  );
}

export function createAppleOAuthState(): string {
  return randomBytes(24).toString("hex");
}

function base64UrlEncode(data: string | Buffer): string {
  const buf = typeof data === "string" ? Buffer.from(data) : data;
  return buf.toString("base64url");
}

function generateAppleClientSecret(): string {
  const teamId = process.env.APPLE_TEAM_ID;
  const clientId = process.env.APPLE_CLIENT_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKeyPem = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!teamId || !clientId || !keyId || !privateKeyPem) {
    throw new Error("Apple OAuth not configured");
  }

  const header = base64UrlEncode(JSON.stringify({ alg: "ES256", kid: keyId }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: teamId,
      iat: now,
      exp: now + 60 * 60 * 24 * 180,
      aud: "https://appleid.apple.com",
      sub: clientId,
    })
  );

  const signingInput = `${header}.${payload}`;
  const key = createPrivateKey(privateKeyPem);
  const signature = sign("sha256", Buffer.from(signingInput), {
    key,
    dsaEncoding: "ieee-p1363",
  });

  return `${signingInput}.${base64UrlEncode(signature)}`;
}

export function getAppleAuthUrl(state: string): string {
  const clientId = process.env.APPLE_CLIENT_ID;
  if (!clientId) throw new Error("APPLE_CLIENT_ID not configured");

  const redirectUri = `${getAppUrl()}/api/auth/apple/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    response_mode: "query",
    scope: "name email",
    state,
  });

  return `https://appleid.apple.com/auth/authorize?${params}`;
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const part = token.split(".")[1];
  if (!part) throw new Error("invalid_id_token");
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
}

export async function exchangeAppleCode(
  code: string,
  userJson?: string | null
): Promise<{
  apple_id: string;
  email: string;
  display_name: string;
}> {
  const clientId = process.env.APPLE_CLIENT_ID;
  if (!clientId) throw new Error("Apple OAuth not configured");

  const redirectUri = `${getAppUrl()}/api/auth/apple/callback`;
  const clientSecret = generateAppleClientSecret();

  const tokenRes = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) throw new Error("token_exchange_failed");
  const tokenData = await tokenRes.json();
  const idToken = tokenData.id_token as string;
  const claims = decodeJwtPayload(idToken);

  const appleId = claims.sub as string;
  let email = typeof claims.email === "string" ? claims.email.toLowerCase() : "";
  let displayName = "Appleユーザー";

  if (userJson) {
    try {
      const user = JSON.parse(userJson) as {
        name?: { firstName?: string; lastName?: string };
        email?: string;
      };
      if (user.email) email = user.email.toLowerCase();
      const parts = [user.name?.lastName, user.name?.firstName].filter(Boolean);
      if (parts.length > 0) displayName = parts.join(" ");
    } catch {
      // ignore malformed user payload
    }
  }

  if (!email) {
    email = `apple+${appleId}@oauth.nomikai.local`;
  }

  return {
    apple_id: appleId,
    email,
    display_name: displayName,
  };
}
