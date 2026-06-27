import "server-only";
import { put } from "@vercel/blob";

// Speaker-pronunciation audio on Vercel Blob (public CDN). Free Hobby tier, no
// card. Optional: when BLOB_READ_WRITE_TOKEN is unset the app still runs and the
// recorder simply isn't offered.

const MAX_BYTES = 5 * 1024 * 1024; // a pronunciation clip is tiny; cap abuse

const EXT: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

export function storageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Store one pronunciation clip; returns its public URL. */
export async function putPronunciation(languageId: string, file: Blob): Promise<string> {
  if (!storageConfigured()) throw new Error("Audio storage isn't configured on this deployment.");
  if (!file.size) throw new Error("Empty recording.");
  if (file.size > MAX_BYTES) throw new Error("Recording is too large (max 5MB).");
  const type = file.type || "audio/webm";
  if (!EXT[type]) throw new Error("Unsupported audio format.");
  const lang = languageId.replace(/[^a-z]/gi, "").slice(0, 8) || "misc";
  const { url } = await put(`pronunciations/${lang}/clip.${EXT[type]}`, file, {
    access: "public",
    contentType: type,
    addRandomSuffix: true,
  });
  return url;
}
