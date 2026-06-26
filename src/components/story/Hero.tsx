"use client";

import { ArrowDown, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Atmosphere, EmberField, Gloss, HeroFlame } from "./primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

/** A staggered fade-rise. Restrained, the whole hero comes up like a held breath. */
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
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Her actual phrases, the seed Lantern learns from. Clean, no pills. */
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
      <div className="relative overflow-hidden rounded-2xl border border-line bg-ink/60 p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-12%,rgba(255,180,84,0.10),transparent_62%)]" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.28em] text-faint">Her words</span>
            <span className="text-[11px] text-faint">te reo Māori · 41 phrases</span>
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
    </div>
  );
}

/**
 * The cold-open. A clean, centered title card: the lantern, her story, and the
 * seed it learns from, on near-black with one warm light. No decorative chrome.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      <Atmosphere extra={<EmberField />} />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <Rise>
          <div className="flex justify-center">
            <HeroFlame size={120} />
          </div>
        </Rise>

        <Rise delay={0.15} className="mt-9">
          <p className="text-sm uppercase tracking-[0.3em] text-ember/70">
            A true story, like thousands of others
          </p>
        </Rise>

        <Rise delay={0.28} className="mt-6">
          <h1 className="mx-auto max-w-3xl font-display text-[2.55rem] leading-[1.05] tracking-tight text-cream sm:text-6xl md:text-[3.9rem]">
            My grandmother dreams in{" "}
            <span className="font-display-italic text-gradient-ember">
              a language I was never taught.
            </span>
          </h1>
        </Rise>

        <Rise delay={0.44} className="mt-7">
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">
            She speaks{" "}
            <Gloss term="te reo Māori" meaning="the Māori language of New Zealand" />.
            She is one of the last in our family who can.
          </p>
        </Rise>

        <Rise delay={0.58} className="mt-12">
          <HerWords />
        </Rise>
      </div>

      <div className="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-faint">
        <span className="text-[11px] uppercase tracking-[0.3em]">What we did about it</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
}
