import "server-only";
import bcrypt from "bcryptjs";
import { getDb } from "./firebase-admin";

// ---------------------------------------------------------------------------
// User records in Firestore. Backs the email+password (Credentials) provider
// and gives OAuth sign-ins a stable uid for per-user data. All functions
// no-op / throw a clear message when Firestore isn't configured.
// ---------------------------------------------------------------------------

const COL = "users";

export interface AppUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  passwordHash?: string | null;
  provider?: string;
  createdAt: number;
  /** Epoch ms the email was verified; null/undefined means unverified. */
  emailVerified?: number | null;
}

export async function findUserByEmail(email: string): Promise<AppUser | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await db
    .collection(COL)
    .where("email", "==", email.toLowerCase())
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...(doc.data() as Omit<AppUser, "id">) };
}

/** Create an email+password account (bcrypt-hashed). Throws on conflict. */
export async function createCredentialsUser(
  email: string,
  password: string,
  name?: string,
): Promise<AppUser> {
  const db = getDb();
  if (!db) throw new Error("Account sign-up isn't configured on this deployment.");
  const normalized = email.toLowerCase();
  const existing = await findUserByEmail(normalized);
  if (existing) throw new Error("An account with this email already exists.");

  const passwordHash = await bcrypt.hash(password, 10);
  const createdAt = Date.now();
  const data = {
    email: normalized,
    name: name || null,
    image: null,
    passwordHash,
    provider: "credentials",
    createdAt,
    // New credentials accounts start unverified; verification is additive and
    // never gates sign-in.
    emailVerified: null,
  };
  const ref = await db.collection(COL).add(data);
  return { id: ref.id, ...data };
}

/** Mark a user's email as verified (idempotent no-op if no such user). */
export async function markEmailVerified(email: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  const user = await findUserByEmail(email);
  if (!user) return;
  await db.collection(COL).doc(user.id).update({ emailVerified: Date.now() });
}

/** Set a new bcrypt-hashed password. Returns false if no such user. */
export async function setPassword(
  email: string,
  newPassword: string,
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const user = await findUserByEmail(email);
  if (!user) return false;
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.collection(COL).doc(user.id).update({ passwordHash });
  return true;
}

/** Verify an email+password login. Returns the user or null. */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<AppUser | null> {
  const user = await findUserByEmail(email);
  if (!user?.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

/** Upsert an OAuth user; returns the stable Firestore uid (or null if unset). */
export async function upsertOAuthUser(input: {
  email: string;
  name?: string;
  image?: string;
  provider: string;
}): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const existing = await findUserByEmail(input.email);
  if (existing) return existing.id;
  const ref = await db.collection(COL).add({
    email: input.email.toLowerCase(),
    name: input.name || null,
    image: input.image || null,
    passwordHash: null,
    provider: input.provider,
    createdAt: Date.now(),
  });
  return ref.id;
}
