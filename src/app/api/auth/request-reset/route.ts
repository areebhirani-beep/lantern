import { z } from "zod";
import { findUserByEmail } from "@/lib/users";
import { createToken, RESET_TTL_MS } from "@/lib/auth-tokens";
import { sendResetEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodyZ = z.object({ email: z.string().email() });

// POST /api/auth/request-reset { email } — if the account exists, mint a reset
// token and email a link. ALWAYS responds { ok: true } regardless, so the
// endpoint can't be used to enumerate which emails have accounts.
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodyZ.safeParse(json);
  if (!parsed.success) return Response.json({ ok: true });

  const email = parsed.data.email.toLowerCase();
  try {
    const user = await findUserByEmail(email);
    if (user) {
      const token = await createToken("reset", email, RESET_TTL_MS);
      if (token) {
        const origin = new URL(req.url).origin;
        const link = `${origin}/reset?token=${encodeURIComponent(token)}`;
        await sendResetEmail(email, link);
      }
    }
  } catch (e) {
    console.error("[request-reset] failed:", e);
  }

  return Response.json({ ok: true });
}
