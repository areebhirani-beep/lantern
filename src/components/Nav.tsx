import Link from "next/link";
import { Flame } from "lucide-react";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-surface glow-ember">
            <Flame className="h-4 w-4 text-ember flicker" strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-medium tracking-tight text-cream">
            Lantern
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/ark"
            className="rounded-full px-3.5 py-2 text-muted transition-colors hover:text-cream"
          >
            The Ark
          </Link>
          <Link
            href="/lang/mi"
            className="rounded-full px-3.5 py-2 text-muted transition-colors hover:text-cream"
          >
            Demo
          </Link>
          <Link
            href="/lang/mi"
            className="ml-1 rounded-full bg-ember px-4 py-2 font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            Light a language
          </Link>
        </nav>
      </div>
    </header>
  );
}
