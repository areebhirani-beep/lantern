import Link from "next/link";
import type { Metadata } from "next";
import { Flame } from "lucide-react";
import { ResetForm } from "@/components/ResetForm";

export const metadata: Metadata = {
  title: "Reset password, Lantern",
  description: "Choose a new password for your Lantern account.",
};

// Next 16: searchParams is async.
export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

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
          <h1 className="font-display text-2xl text-cream">Choose a new password</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Pick something you&rsquo;ll remember. This link works once.
          </p>

          <div className="mt-6">
            <ResetForm token={token ?? ""} />
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-faint">
          <Link href="/signin" className="transition-colors hover:text-cream">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
