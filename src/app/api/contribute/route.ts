import { z } from "zod";
import { getLanguageMeta } from "@/lib/languages";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodyZ = z.object({
  languageId: z.string().min(1),
  target: z.string().min(1).max(200),
  english: z.string().min(1).max(200),
  romanization: z.string().max(200).optional(),
  category: z.string().max(40).optional(),
  contributedBy: z.string().max(60).optional(),
  audioUrl: z.string().url().max(600).optional(),
});

// POST /api/contribute, add a phrase to a language's living corpus. This is
// the flywheel: every contribution invalidates the cached induction, so the
// next learner gets richer materials.
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodyZ.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "target and english are required.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const language = getLanguageMeta(parsed.data.languageId);
  if (!language) {
    return Response.json({ error: "Unknown language" }, { status: 404 });
  }

  const store = await getStore();
  const phrase = await store.addPhrase(parsed.data);
  await store.recordContribution(parsed.data.languageId);
  const phrases = await store.getPhrases(parsed.data.languageId);

  return Response.json({ phrase, phraseCount: phrases.length });
}
