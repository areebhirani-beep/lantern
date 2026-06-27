import { put, del } from "@vercel/blob";

// PHASE 4 foundation: prove the Vercel Blob round-trip end to end.
// Run: npx tsx --env-file=.env.local scripts/blob.check.ts
async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN missing");
  const clip = new Blob([new Uint8Array([0x1a, 0x45, 0xdf, 0xa3, 1, 2, 3])], { type: "audio/webm" });
  const { url } = await put("pronunciations/_healthcheck/clip.webm", clip, {
    access: "public",
    contentType: "audio/webm",
    addRandomSuffix: true,
  });
  const res = await fetch(url);
  const ok = res.ok;
  await del(url);
  console.log(`blob.check: put -> ${url.split("/").slice(-1)[0]}  fetch=${res.status} ct=${res.headers.get("content-type")}`);
  if (!ok) throw new Error(`fetch of stored blob failed: ${res.status}`);
  console.log("blob.check: round-trip OK (put + public fetch + delete) ✓");
}
main().catch((e) => { console.error("blob.check FAILED:", e.message); process.exit(1); });
