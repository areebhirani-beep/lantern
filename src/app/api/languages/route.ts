import { LANGUAGES } from "@/lib/languages";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/languages, the Ark roster with live phrase/vocab counts.
export async function GET() {
  const store = await getStore();
  const languages = await Promise.all(
    LANGUAGES.map(async (lang) => {
      const phrases = await store.getPhrases(lang.id);
      const induction = await store.getInduction(lang.id);
      return {
        ...lang,
        phraseCount: phrases.length,
        vocabCount: induction?.vocab.length ?? 0,
        inducible: phrases.length > 0,
      };
    }),
  );
  return Response.json({ languages });
}
