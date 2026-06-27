import { consumeToken } from "@/lib/auth-tokens";
import { markEmailVerified } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/auth/verify-email?token=… — consume a single-use verify token and
// mark the email verified, then bounce the browser back to /signin with a flag
// so it can show the right banner.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const ok = `${url.origin}/signin?verified=1`;
  const fail = `${url.origin}/signin?verify_error=1`;

  try {
    const email = await consumeToken("verify", token);
    if (!email) return Response.redirect(fail, 303);
    await markEmailVerified(email);
    return Response.redirect(ok, 303);
  } catch (e) {
    console.error("[verify-email] failed:", e);
    return Response.redirect(fail, 303);
  }
}
