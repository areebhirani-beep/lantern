"use client";

import { ArrowDown, ShieldCheck, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { Atmosphere, EmberField, Gloss, HeroFlame, Tilt, LanternLight } from "./primitives";
import { AnimatedShinyText } from "@/components/magic/animated-shiny-text";

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
      initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Her actual phrases, the seed Lantern learns from, lit by the lantern. */
function HerWords() {
  const phrases: [string, string][] = [
    ["Kia ora", "hello"],
    ["whānau", "family"],
    ["tama", "son"],
    ["wai", "water"],
    ["I haere au", "I went"],
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.55, ease: EASE }}
      className="relative w-full max-w-sm"
    >
      <Tilt className="w-full">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-ink/60 p-6 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)]">
        {/* Single warm light source, falling from the upper-right where the flame burns. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_95%_at_88%_-12%,rgba(255,180,84,0.16),transparent_58%)]" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.28em] text-faint">
              Her words
            </span>
            <span className="rounded-full border border-ember/30 bg-ember/10 px-2.5 py-0.5 text-[11px] font-medium text-ember">
              41 in all
            </span>
          </div>

          <div className="mt-5 space-y-0">
            {phrases.map(([mi, en]) => (
              <div
                key={mi}
                className="flex items-baseline justify-between border-b border-line/50 py-2.5 last:border-0"
              >
                <span className="font-display text-lg text-cream">{mi}</span>
                <span className="text-sm text-muted">{en}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-line/60 pt-4 text-[11px] text-faint">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-ember/80" />
            <span>
              Lantern learns from these alone. It never invents a word.
            </span>
          </div>
        </div>
        </div>
      </Tilt>

      {/* A quiet audio tell, the words can be heard, not just read. */}
      <div className="mt-4 flex items-center gap-2 pl-1 text-[11px] text-faint">
        <Volume2 className="h-3.5 w-3.5 text-ember/70" />
        <span>built-in pronunciation for every phrase</span>
      </div>
    </motion.div>
  );
}

/**
 * The cold-open. Editorial and asymmetric: her words held in the light on the
 * right, the lantern burning off the edge as the single warm key-light, the
 * story spine kept exactly. One accent, restrained motion.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-5 py-24 sm:px-8">
      <Atmosphere extra={<><LanternLight /><EmberField /></>} />

      {/* The lantern, large, bleeding off the right edge so it lights the scene
          instead of floating in it. Sits behind the content. */}
      <motion.div
        className="pointer-events-none absolute right-[-3.5rem] top-[11%] z-0 hidden lg:block"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <HeroFlame size={288} />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-y-16 lg:grid-cols-[1.14fr_0.86fr] lg:gap-x-12">
        {/* LEFT, her story */}
        <div className="max-w-2xl">
          <Rise delay={0.12}>
            <p className="text-sm uppercase tracking-[0.3em]">
              <AnimatedShinyText className="text-ember/70">
                A true story, like thousands of others
              </AnimatedShinyText>
            </p>
          </Rise>

          <Rise delay={0.24} className="mt-5">
            <h1 className="font-display text-[2.7rem] leading-[1.02] tracking-tight text-cream sm:text-6xl lg:text-[4.1rem]">
              My grandmother dreams in{" "}
              <span className="font-display-italic text-gradient-ember">
                a language I was never taught.
              </span>
            </h1>
          </Rise>

          <Rise delay={0.4} className="mt-7">
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              She speaks{" "}
              <Gloss term="te reo Māori" meaning="the Māori language of New Zealand" />.
              She is one of the last in our family who can.
            </p>
          </Rise>
        </div>

        {/* RIGHT, her words in the light */}
        <div className="relative flex flex-col items-center lg:items-end">
          {/* On mobile the big flame is hidden, so carry a smaller one above the card. */}
          <div className="pointer-events-none mb-1 lg:hidden">
            <HeroFlame size={104} />
          </div>
          <HerWords />
        </div>
      </div>

      {/* Scroll cue, anchored with the rest of the composition. */}
      <div className="absolute bottom-10 left-5 flex items-center gap-3 text-faint sm:left-8">
        <ArrowDown className="h-4 w-4 animate-bounce" />
        <span className="text-[11px] uppercase tracking-[0.3em]">What we did about it</span>
      </div>
    </section>
  );
}
