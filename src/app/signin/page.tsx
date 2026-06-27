import Link from "next/link";
import type { Metadata } from "next";
import { Flame } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";
import { authConfigured } from "@/lib/auth-config";

export const metadata: Metadata = {
  title: "Sign in, Lantern",
  description: "Sign in to save and sync your progress. The demo works without it.",
};

// Next 16: searchParams is async.
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string;
    verified?: string;
    reset?: string;
    verify_error?: string;
  }>;
}) {
  const { callbackUrl, verified, reset, verify_error } = await searchParams;
  const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const hasGithub = Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-10 flex items-center justify-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-surface">
            <Flame className="h-4 w-4 text-ember" strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-medium tracking-tight text-cream">
            Lantern
          </span>
        </Link>

        <div className="card p-7 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]">
          <h1 className="font-display text-2xl text-cream">Welcome back</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Sign in to save your progress and credit your contributions. The whole
            app already works without an account.
          </p>

          {verified && <Banner tone="ok">Email verified — sign in below.</Banner>}
          {reset && <Banner tone="ok">Password updated — sign in with it below.</Banner>}
          {verify_error && (
            <Banner tone="err">That verification link is invalid or has expired.</Banner>
          )}

          {authConfigured() ? (
            <div className="mt-6">
              <AuthForm
                hasGoogle={hasGoogle}
                hasGithub={hasGithub}
                callbackUrl={callbackUrl || "/lang/mi"}
              />
            </div>
          ) : (
            <p className="mt-6 rounded-data border border-line bg-ink/40 px-4 py-3.5 text-sm leading-relaxed text-muted">
              Accounts aren&rsquo;t switched on for this deployment yet. The whole
              app already works without one — browse the Ark, learn, hear
              pronunciation, and contribute, all without signing in.
            </p>
          )}
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-faint">
          <Link href="/" className="transition-colors hover:text-cream">
            ← Back to the demo, no sign-in needed
          </Link>
        </p>
      </div>
    </main>
  );
}

/** A calm, on-brand status banner: pounamu jade for good news, ember for bad. */
function Banner({
  tone,
  children,
}: {
  tone: "ok" | "err";
  children: React.ReactNode;
}) {
  const ok = tone === "ok";
  return (
    <div
      role={ok ? "status" : "alert"}
      aria-live={ok ? "polite" : "assertive"}
      className={`mt-5 flex items-center gap-2.5 rounded-data border px-3.5 py-2.5 text-sm ${
        ok
          ? "border-pounamu/25 bg-pounamu/10 text-pounamu"
          : "border-ember/25 bg-ember/10 text-ember"
      }`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${ok ? "bg-pounamu" : "bg-ember"}`}
      />
      {children}
    </div>
  );
}
