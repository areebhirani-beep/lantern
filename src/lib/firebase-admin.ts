import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// ---------------------------------------------------------------------------
// Firebase Admin (Firestore) — the per-user data store. Lazy and OPTIONAL:
// when the service-account env isn't set, getDb() returns null and every
// caller degrades gracefully. The no-sign-in demo never touches this.
// ---------------------------------------------------------------------------

let cached: Firestore | null | undefined;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

/** The Firestore handle, or null when Firebase isn't configured. */
export function getDb(): Firestore | null {
  if (cached !== undefined) return cached;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Vercel/.env store the key with literal \n; restore real newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    cached = null;
    return null;
  }

  try {
    const app: App =
      getApps()[0] ??
      initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    cached = getFirestore(app);
  } catch (err) {
    console.error("[firebase] init failed; per-user features disabled:", err);
    cached = null;
  }
  return cached;
}
