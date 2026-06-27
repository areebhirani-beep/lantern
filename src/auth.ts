import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials, upsertOAuthUser } from "@/lib/users";
import { isFirebaseConfigured } from "@/lib/firebase-admin";

// ---------------------------------------------------------------------------
// Auth.js v5, JWT sessions. Additive only: signing in adds synced progress and
// attributed contributions; it never gates the demo. Providers register only
// when their env is present, so an empty .env still boots the whole app.
// ---------------------------------------------------------------------------

const providers: NextAuthConfig["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  );
}

// Email + password. Always registered so the form is always present;
// authorize() fails cleanly (returns null) when Firestore isn't configured.
providers.push(
  Credentials({
    name: "Email",
    credentials: { email: {}, password: {} },
    authorize: async (creds) => {
      const email = String(creds?.email || "").trim().toLowerCase();
      const password = String(creds?.password || "");
      if (!email || !password) return null;
      const user = await verifyCredentials(email, password).catch((e) => {
        console.error("[auth] credentials check failed:", e);
        return null;
      });
      if (!user) return null;
      return { id: user.id, email: user.email, name: user.name ?? null };
    },
  }),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // First OAuth sign-in: mint a stable Firestore uid for this account.
      if (
        account &&
        account.provider !== "credentials" &&
        isFirebaseConfigured()
      ) {
        const email = user?.email ?? (profile?.email as string | undefined);
        if (email) {
          const uid = await upsertOAuthUser({
            email,
            name: user?.name ?? undefined,
            image: user?.image ?? undefined,
            provider: account.provider,
          }).catch(() => null);
          if (uid) token.uid = uid;
        }
      }
      // Credentials sign-in: user.id is the Firestore doc id.
      if (user?.id && !token.uid) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.id = String(token.uid);
      }
      return session;
    },
  },
});
