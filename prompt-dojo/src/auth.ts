import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findOrCreateOAuthUser, getUserByOAuth } from "@/lib/db";

const providers = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
      if (account?.provider === "google" && profile?.sub) {
        findOrCreateOAuthUser(
          "google",
          profile.sub,
          profile.name ?? "Google User",
        );
        return true;
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile?.sub) {
        const user = getUserByOAuth("google", profile.sub);
        if (user) token.userId = user.id;
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
