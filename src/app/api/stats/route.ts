import { getStore } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/stats, aggregate counters powering the Living Ark dashboard.
export async function GET() {
  const store = await getStore();
  const stats = await store.getStats();
  return Response.json(stats);
}
