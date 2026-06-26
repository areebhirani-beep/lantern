"use client";

import Link from "next/link";
import { Flame } from "lucide-react";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Flame className="h-10 w-10 text-ember" strokeWidth={1.8} />
      <p className="mt-8 text-sm uppercase tracking-[0.3em] text-faint">
        the light flickered
      </p>
      <h1 className="mt-4 font-display text-4xl text-cream sm:text-5xl">
        Something went out for a second.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        An unexpected error — your progress is safe. Try again, or head back to
        steady ground.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
        <button
          onClick={reset}
          className="inline-flex h-11 items-center rounded-full bg-ember px-6 font-medium text-ink transition-transform hover:scale-[1.03]"
        >
          Try again
        </button>
        <Link href="/" className="text-ember hover:text-flame">
          Back to the start
        </Link>
      </div>
    </main>
  );
}
