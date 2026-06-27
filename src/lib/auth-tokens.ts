import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { getDb } from "./firebase-admin";

// ---------------------------------------------------------------------------
// Single-use, hashed tokens for email verification and password reset. Only a
// SHA-256 hash of the token is ever stored in Firestore — the raw token lives
// solely in the emailed link. Tokens are consumed (deleted) on first use, and
// expire after a type-specific TTL. Degrades to a no-op when Firestore isn't
// configured, like every other per-user feature.
// ---------------------------------------------------------------------------

const COL = "auth_tokens";

export type TokenType = "verify" | "reset";

/** ~24h for verification, ~1h for reset. */
export const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;
export const RESET_TTL_MS = 60 * 60 * 1000;

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/**
 * Mint a single-use token of `type` for `email`, valid for `ttlMs`. Returns the
 * RAW token (put it in the link) or null when Firestore isn't configured.
 */
export async function createToken(
  type: TokenType,
  email: string,
  ttlMs: number,
): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const raw = randomBytes(32).toString("base64url");
  const now = Date.now();
  await db.collection(COL).add({
    type,
    email: email.toLowerCase(),
    tokenHash: hashToken(raw),
    expiresAt: now + ttlMs,
    createdAt: now,
  });
  return raw;
}

/**
 * Look up a token by its hash, DELETE it (single-use), and return the
 * associated email — or null if it doesn't exist, is the wrong type, or has
 * expired. The delete happens before the expiry check so a stale token can
 * never be replayed.
 */
export async function consumeToken(
  type: TokenType,
  rawToken: string,
): Promise<string | null> {
  const db = getDb();
  if (!db || !rawToken) return null;

  const snap = await db
    .collection(COL)
    .where("tokenHash", "==", hashToken(rawToken))
    .limit(1)
    .get();
  if (snap.empty) return null;

  const doc = snap.docs[0];
  const data = doc.data() as { type: TokenType; email: string; expiresAt: number };
  await doc.ref.delete();

  if (data.type !== type) return null;
  if (typeof data.expiresAt !== "number" || data.expiresAt < Date.now()) return null;
  return data.email ?? null;
}
