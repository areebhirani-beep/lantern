import { z } from "zod";
import { createCredentialsUser } from "@/lib/users";
import { isFirebaseConfigured } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodyZ = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  name: z.string().max(80).optional(),
});

// POST /api/auth/register — create an email+password account. Persists a
// bcrypt-hashed credential to Firestore; the client then signs in normally.
export async function POST(req: Request) {
  if (!isFirebaseConfigured()) {
    return Response.json(
      { error: "Account sign-up isn't configured on this deployment yet." },
      { status: 503 },
    );
  }
  const json = await req.json().catch(() => null);
  const parsed = BodyZ.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Enter a valid email and a password of at least 8 characters." },
      { status: 400 },
    );
  }
  try {
    const user = await createCredentialsUser(
      parsed.data.email,
      parsed.data.password,
      parsed.data.name,
    );
    return Response.json({ ok: true, id: user.id });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Could not create the account." },
      { status: 400 },
    );
  }
}
