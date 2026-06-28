// Round-trips the Firestore user store that backs auth (sign-up / sign-in).
// Run: npx tsx --env-file=.env.local scripts/firestore.check.ts
import { getDb, isFirebaseConfigured } from "../src/lib/firebase-admin";

async function main() {
  if (!isFirebaseConfigured()) throw new Error("Firebase env not set");
  const db = getDb();
  if (!db) throw new Error("getDb() returned null");

  const ref = db.collection("_healthcheck").doc("ping");
  const stamp = `ping-${process.pid}`;
  await ref.set({ stamp });
  const got = (await ref.get()).data();
  if (got?.stamp !== stamp) throw new Error("read-back mismatch");
  await ref.delete();
  if ((await ref.get()).exists) throw new Error("delete failed");

  console.log("firestore.check: write + read + delete OK (auth user store is live) ✓");
}

main().catch((e) => {
  console.error("firestore.check FAILED:", e instanceof Error ? e.message : e);
  process.exit(1);
});
