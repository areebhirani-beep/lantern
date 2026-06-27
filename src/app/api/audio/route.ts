import { putPronunciation, storageConfigured } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// POST /api/audio  (multipart: audio=<file>, languageId=<id>) → { url }
// Stores one speaker-pronunciation clip on Vercel Blob and returns its public URL.
export async function POST(req: Request) {
  if (!storageConfigured()) {
    return Response.json(
      { error: "Audio storage isn't configured on this deployment." },
      { status: 503 },
    );
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("audio");
  const languageId = String(form?.get("languageId") || "misc");
  if (!(file instanceof Blob) || file.size === 0) {
    return Response.json({ error: "No audio provided." }, { status: 400 });
  }
  try {
    const url = await putPronunciation(languageId, file);
    return Response.json({ url });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 400 },
    );
  }
}
