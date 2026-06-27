import Link from "next/link";
import { Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line/60">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <Flame className="h-4 w-4 text-ember" strokeWidth={2.2} />
              <span className="font-display text-base text-cream">Lantern</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-faint">
              Carry the light of a language forward.
            </p>
          </div>

          {/* Languages */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              Languages
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/ark" className="hover:text-cream">
                  The Ark
                </Link>
              </li>
              <li>
                <Link href="/lang/mi" className="hover:text-cream">
                  Māori
                </Link>
              </li>
              <li>
                <Link href="/lang/chr" className="hover:text-cream">
                  Cherokee
                </Link>
              </li>
            </ul>
          </div>

          {/* Project */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              Project
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a
                  href="https://github.com/areebhirani-beep/lantern"
                  className="hover:text-cream"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="/api/metrics" className="hover:text-cream">
                  The proof (live metrics)
                </a>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cream">
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="mailto:siddarthakodithyala28@gmail.com"
                  className="hover:text-cream"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              Legal
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/privacy" className="hover:text-cream">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cream">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line/60 pt-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl font-mono text-[11px] leading-relaxed text-faint">
            A language disappears roughly every two weeks. Lantern amplifies the
            words a community already holds, it never invents what it cannot see.
            Seed data is cited from public, reputable sources; pronunciation is an
            approximate guide.
          </p>
          <p className="shrink-0 font-mono text-[11px] text-faint">© 2026 Lantern</p>
        </div>
      </div>
    </footer>
  );
}
