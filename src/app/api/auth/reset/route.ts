import { z } from "zod";
import { consumeToken } from "@/lib/auth-tokens";
import { setPassword } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodyZ = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(200),
});

// POST /api/auth/reset { token, password } — consume a single-use reset token
// and set a new bcrypt-hashed password.
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodyZ.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Choose a password of at least 8 characters." },
      { status: 400 },
    );
  }

  const email = await consumeToken("reset", parsed.data.token).catch((e) => {
    console.error("[reset] consume failed:", e);
    return null;
  });
  if (!email) {
    return Response.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  const ok = await setPassword(email, parsed.data.password).catch((e) => {
    console.error("[reset] setPassword failed:", e);
    return false;
  });
  if (!ok) {
    return Response.json(
      { error: "Could not reset the password. Please try again." },
      { status: 400 },
    );
  }

  return Response.json({ ok: true });
}
