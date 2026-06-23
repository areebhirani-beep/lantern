import { getLanguageMeta } from "@/lib/languages";
import { getStore } from "@/lib/store";
import { runInduction } from "@/lib/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// POST /api/induce  { languageId, force? }
// Runs the induction engine over a language's corpus (or returns the cached
// result). This is the "watch the structure appear" endpoint.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const languageId = typeof body.languageId === "string" ? body.languageId : "";
  const force = body.force === true;

  const language = getLanguageMeta(languageId);
  if (!language) {
    return Response.json({ error: "Unknown language" }, { status: 404 });
  }

  const store = await getStore();

  if (!force) {
    const cached = await store.getInduction(languageId);
    if (cached) return Response.json({ induction: cached, cached: true });
  }

  const phrases = await store.getPhrases(languageId);
  if (phrases.length === 0) {
    return Response.json(
      { error: "No corpus to induce from yet, contribute a few phrases first." },
      { status: 400 },
    );
  }

  const induction = await runInduction(language, phrases);
  await store.saveInduction(induction);
  return Response.json({ induction, cached: false });
}
