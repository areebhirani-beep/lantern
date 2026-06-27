import Link from "next/link";
import { Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line/60">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="h-4 w-4 text-ember" strokeWidth={2.2} />
            <span className="font-display text-base text-cream">Lantern</span>
            <span className="text-sm text-faint">
              · carry the light of a language forward
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted">
            <Link href="/ark" className="hover:text-cream">
              The Ark
            </Link>
            <Link href="/lang/mi" className="hover:text-cream">
              Māori
            </Link>
            <Link href="/lang/chr" className="hover:text-cream">
              Cherokee
            </Link>
            <Link href="/privacy" className="hover:text-cream">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-cream">
              Terms
            </Link>
          </div>
        </div>
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-faint">
          A language disappears roughly every two weeks. Lantern amplifies the
          words a community already holds, it never invents what it cannot see.
          Seed data is cited from public, reputable sources; pronunciation is an
          approximate guide.
        </p>
      </div>
    </footer>
  );
}
