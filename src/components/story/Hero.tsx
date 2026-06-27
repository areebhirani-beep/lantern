"use client";

import { ArrowDown, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Atmosphere, Gloss, HeroFlame } from "./primitives";

/** CSS fade-rise. Runs on first paint (unlike a JS/framer entrance, which only
 *  fires after hydration and leaves an empty-void flash). Delays are halved so
 *  the whole hero lands well under a second. */
function Rise({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`rise ${className ?? ""}`}
      style={{ animationDelay: `${delay * 0.5}s`, animationDuration: "0.5s" }}
    >
      {children}
    </div>
  );
}

/** Loud, honest proof. Big mono numbers in ember, the whole band links to the
 *  live endpoint that recomputes them. */
function ProofStat({ n, label }: { n: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono text-2xl font-medium text-ember sm:text-3xl">{n}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">{label}</span>
    </span>
  );
}

/** Her actual phrases, the seed Lantern learns from. */
function HerWords() {
  const phrases: [string, string][] = [
    ["Kia ora", "hello"],
    ["whānau", "family"],
    ["tama", "son"],
    ["wai", "water"],
    ["I haere au", "I went"],
  ];
  return (
    <div className="mx-auto w-full max-w-md text-left">
      <div className="rounded-2xl border border-line bg-ink/70 p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)]">
        <div className="flex items-center justify-between font-mono text-[11px] text-faint">
          <span className="uppercase tracking-[0.18em]">Her words</span>
          <span>te reo Māori · 41 phrases</span>
        </div>
        <div className="mt-4 divide-y divide-line/60">
          {phrases.map(([mi, en]) => (
            <div key={mi} className="flex items-baseline justify-between py-2.5">
              <span className="font-display text-cream">{mi}</span>
              <span className="text-sm text-muted">{en}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 border-t border-line/60 pt-4 text-[11px] leading-relaxed text-faint">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-ember/80" />
          Lantern learns from these alone. It never invents a word.
        </p>
      </div>
    </div>
  );
}

/**
 * The cold-open. Warm light, a breathing flame, the headline, and loud proof —
 * all landing above the fold in about a second, then the seed it learns from.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[94vh] flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-24 text-center">
      <Atmosphere />
      {/* One warm light source filling the upper hero, so it reads "lit by a
          flame," not "dark mode." Static — no drifting blob. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[14%] -z-0 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,150,60,0.20), rgba(255,138,48,0.07) 38%, transparent 66%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <Rise className="flex justify-center">
          <HeroFlame size={92} />
        </Rise>

        <Rise delay={0.08} className="mt-5">
          <p className="font-display-italic text-lg text-ember/80 sm:text-xl">
            A true story, like thousands of others
          </p>
        </Rise>

        <Rise delay={0.16} className="mt-4">
          <h1 className="mx-auto max-w-3xl font-display text-[2.7rem] leading-[1.03] tracking-tight text-cream sm:text-6xl md:text-[4.1rem]">
            My grandmother dreams in{" "}
            <span className="font-display-italic text-ember">
              a language I was never taught.
            </span>
          </h1>
        </Rise>

        <Rise delay={0.28} className="mt-6">
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">
            She speaks{" "}
            <Gloss term="te reo Māori" meaning="the Māori language of New Zealand" />.
            She is one of the last in our family who can.
          </p>
        </Rise>

        <Rise delay={0.4} className="mt-9 flex justify-center">
          <a
            href="/api/metrics"
            className="group inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-line bg-ink/50 px-6 py-3.5"
          >
            <ProofStat n="0" label="invented" />
            <span className="hidden h-7 w-px bg-line sm:block" />
            <ProofStat n="48 / 48" label="cited" />
            <span className="hidden h-7 w-px bg-line sm:block" />
            <ProofStat n="7 / 7" label="attested" />
            <span className="ml-1 font-mono text-[11px] text-faint underline decoration-dotted underline-offset-2 transition-colors group-hover:text-cream">
              verify · /api/metrics
            </span>
          </a>
        </Rise>

        <Rise delay={0.52} className="mt-10">
          <HerWords />
        </Rise>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-faint"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
}
