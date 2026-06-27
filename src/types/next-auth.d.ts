import type { DefaultSession } from "next-auth";

// Expose the stable Firestore uid on the session so server code (and the
// per-user data layer in later slices) can key reads/writes by user.
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
  }
}
