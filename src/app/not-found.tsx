import Link from "next/link";
import { Flame } from "lucide-react";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <Flame className="h-10 w-10 text-ember" strokeWidth={1.8} />
        <p className="mt-8 text-sm uppercase tracking-[0.3em] text-faint">
          404 · off the map
        </p>
        <h1 className="mt-4 font-display text-4xl text-cream sm:text-5xl">
          This light isn&rsquo;t lit.
        </h1>
        <p className="mt-4 max-w-md text-muted">
          That page doesn&rsquo;t exist — but there are languages here still worth
          keeping.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full bg-ember px-6 font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            Back to the start
          </Link>
          <Link href="/ark" className="text-ember hover:text-flame">
            Enter the Living Ark
          </Link>
        </div>
      </main>
    </>
  );
}
