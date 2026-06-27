"use client";

import { ArrowDown, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Atmosphere, Gloss, HeroFlame } from "./primitives";

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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Her actual phrases, the seed Lantern learns from. Flat and editorial: a real
 *  hairline border and a cast shadow for depth, no decorative glow. */
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
 * The cold-open. A real 3D lantern burning over near-black, her story, and the
 * seed it learns from. One warm light, solid type, no gradient or glow chrome.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      <Atmosphere />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <Rise>
          <div className="flex justify-center">
            <HeroFlame size={120} />
          </div>
        </Rise>

        <Rise delay={0.15} className="mt-9">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember/70">
            A true story, like thousands of others
          </p>
        </Rise>

        <Rise delay={0.28} className="mt-6">
          <h1 className="mx-auto max-w-3xl font-display text-[2.55rem] leading-[1.05] tracking-tight text-cream sm:text-6xl md:text-[3.9rem]">
            My grandmother dreams in{" "}
            <span className="font-display-italic text-ember">
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

      <motion.div
        className="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-faint"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">What we did about it</span>
        <ArrowDown className="h-4 w-4" />
      </motion.div>
    </section>
  );
}
