import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { SectionLabel, StatusBadge } from "@/components/ui";
import { Globe } from "@/components/magic/globe";
import { LANGUAGES, isInducible } from "@/lib/languages";
import { getStore } from "@/lib/store";
import { getFixture } from "@/lib/engine/fixtures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Living Ark, Lantern",
  description:
    "Every light is a language. A growing ark of endangered languages being kept alight, one corpus at a time.",
};

export default async function ArkPage() {
  const store = await getStore();

  const cards = await Promise.all(
    LANGUAGES.map(async (lang) => {
      const phrases = await store.getPhrases(lang.id);
      return { lang, phraseCount: phrases.length };
    }),
  );

  const stats = await store.getStats();

  // Words/patterns the engine has mapped from the shipped corpora (verified).
  let wordsMapped = 0;
  let patternsFound = 0;
  for (const id of LANGUAGES.map((l) => l.id)) {
    if (!isInducible(id)) continue;
    const fx = getFixture(id, 0);
    if (fx) {
      wordsMapped += fx.vocab.length;
      patternsFound += fx.patterns.length;
    }
  }

  const counters = [
    { v: LANGUAGES.length, label: "languages aboard" },
    { v: stats.phrases, label: "phrases in the corpus" },
    { v: wordsMapped, label: "words mapped by the engine" },
    { v: patternsFound, label: "grammar patterns found" },
  ];

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-12">
        <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="max-w-2xl">
            <SectionLabel>The Living Ark</SectionLabel>
            <h1 className="mt-4 font-display text-4xl text-cream sm:text-6xl">
              Every light is a language.
            </h1>
            <p className="mt-5 text-lg text-muted">
              Each language here is one a community is fighting to keep. Some are
              vulnerable; one has roughly ten speakers left. Lantern gives every
              one of them the same engine, and room for the other ~3,000 still
              waiting.
            </p>
          </Reveal>
          <div className="relative mx-auto aspect-square w-full max-w-[440px]">
            <Globe />
          </div>
        </div>

        {/* counters */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {counters.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.07} className="card px-4 py-6 text-center">
              <div className="font-display text-4xl text-cream">
                <Counter value={c.v} />
              </div>
              <div className="mt-2 text-xs leading-snug text-muted">{c.label}</div>
            </Reveal>
          ))}
        </div>

        {/* constellation grid */}
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ lang, phraseCount }, i) => (
            <Reveal key={lang.id} delay={i * 0.05}>
              <Link
                href={`/lang/${lang.id}`}
                className={`card group flex h-full flex-col p-6 transition-colors hover:border-line ${["rounded-2xl", "rounded-3xl", "rounded-xl", "rounded-2xl", "rounded-3xl"][i % 5]} shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="mt-1 h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: lang.color,
                      boxShadow: `0 0 14px ${lang.color}`,
                    }}
                  />
                  <StatusBadge status={lang.status} />
                </div>

                <h2 className="mt-4 font-display text-2xl text-cream">{lang.name}</h2>
                <p className="font-display text-base text-muted">{lang.endonym}</p>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-faint">
                  {lang.blurb}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-4 text-xs">
                  <span className="text-muted">
                    {phraseCount > 0 ? (
                      <>{phraseCount} phrases seeded</>
                    ) : (
                      <span className="text-faint">awaiting its first words</span>
                    )}
                  </span>
                  <span className="inline-flex items-center gap-1 text-ember group-hover:text-flame">
                    {phraseCount > 0 ? "Open" : "Seed it"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
