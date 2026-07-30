import NextAuth from "next-auth";
import Apple from "next-auth/providers/apple";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { findOrCreateOAuthUser, getUserByOAuth } from "@/lib/db";

function getOAuthProfile(
  provider: string,
  profile: Record<string, unknown>,
): { id: string; name: string } | null {
  if (provider === "google" && typeof profile.sub === "string") {
    return { id: profile.sub, name: (profile.name as string) ?? "Google User" };
  }
  if (provider === "github" && (profile.id !== undefined)) {
    return {
      id: String(profile.id),
      name: (profile.name as string) ?? (profile.login as string) ?? "GitHub User",
    };
  }
  if (provider === "apple" && typeof profile.sub === "string") {
    return { id: profile.sub, name: (profile.name as string) ?? "Apple User" };
  }
  return null;
}

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  );
}

if (process.env.APPLE_ID && process.env.APPLE_SECRET) {
  providers.push(
    Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider && profile) {
        const oauth = getOAuthProfile(
          account.provider,
          profile as Record<string, unknown>,
        );
        if (oauth) {
          findOrCreateOAuthUser(account.provider, oauth.id, oauth.name);
        }
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider && profile) {
        const oauth = getOAuthProfile(
          account.provider,
          profile as Record<string, unknown>,
        );
        if (oauth) {
          const user = getUserByOAuth(account.provider, oauth.id);
          if (user) token.userId = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId && session.user) {
        (session as { user: { id: number } }).user.id = token.userId as number;
      }
      return session;
    },
  },
});
