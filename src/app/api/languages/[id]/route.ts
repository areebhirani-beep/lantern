import { getLanguageMeta } from "@/lib/languages";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/languages/:id, language meta + its corpus + any cached induction.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const language = getLanguageMeta(id);
  if (!language) {
    return Response.json({ error: "Unknown language" }, { status: 404 });
  }
  const store = await getStore();
  const [phrases, induction] = await Promise.all([
    store.getPhrases(id),
    store.getInduction(id),
  ]);
  return Response.json({ language, phrases, induction });
}
