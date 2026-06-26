"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Volume2 } from "lucide-react";
import { BorderBeam } from "@/components/magic/border-beam";
import { BrowserFrame } from "./BrowserFrame";

const EASE = [0.22, 1, 0.36, 1] as const;

/** A condensed, live-looking peek at the real Māori workspace you're about to open. */
function WorkspacePeek() {
  return (
    <div className="bg-ink p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#ffb454", boxShadow: "0 0 10px #ffb454" }}
          />
          <span className="font-display text-cream">Māori</span>
          <span className="text-xs text-faint">te reo Māori</span>
        </div>
        <span className="rounded-full border border-ember/30 bg-ember/10 px-2.5 py-0.5 text-[11px] font-medium text-ember">
          41 phrases
        </span>
      </div>

      {/* Active flashcard */}
      <div className="mt-4 rounded-xl border border-line bg-surface/50 p-5 text-center">
        <p className="text-[11px] uppercase tracking-widest text-faint">say &ldquo;hello&rdquo;</p>
        <p className="mt-1.5 font-display text-3xl text-cream">Kia ora</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-muted">
          <Volume2 className="h-3.5 w-3.5 text-ember/80" /> hear it
        </span>
      </div>

      {/* Grammar Lantern found */}
      <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-faint">
        Tenses it worked out
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {[
          ["past", "i", "haere"],
          ["now", "kei te", "haere"],
          ["future", "ka", "haere"],
        ].map(([t, particle, verb]) => (
          <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs">
            <span className="text-faint">{t} </span>
            <span className="text-ember">{particle}</span>{" "}
            <span className="text-cream">{verb}</span>
          </span>
        ))}
      </div>

      {/* Quiet progress line */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full w-1/4 rounded-full bg-ember" />
        </div>
        <span className="text-[11px] text-faint">Lesson 1 of 6</span>
      </div>
    </div>
  );
}

/**
 * The "try it" CTA, rebuilt as an asymmetric split: the pitch and actions on the
 * left, a live-looking peek at the actual workspace on the right, so the click
 * point shows what you'll open. Keeps the BorderBeam, one warm light.
 */
export function TryItCTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.85, ease: EASE }}
        className="card relative overflow-hidden p-8 sm:p-10 lg:p-12"
      >
        <BorderBeam duration={9} size={90} colorFrom="#ffb454" colorTo="#ffd488" />
        {/* A single warm light rising from the lower-left, not a centered glow. */}
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,180,84,0.16),transparent_68%)]" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
          {/* LEFT, the pitch */}
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-ember">See it for yourself</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-cream sm:text-[2.75rem]">
              Watch Lantern learn Māori from those 41 phrases.
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Open the workspace: her words, the grammar it found, and a course you
              can take, right now in your browser.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/lang/mi"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ember px-7 font-medium text-ink transition-transform hover:scale-[1.03]"
              >
                Open the Māori workspace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/ark"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-6 font-medium text-cream transition-colors hover:bg-surface"
              >
                See every language
              </Link>
            </div>

            <p className="mt-5 text-xs text-faint">
              No sign-up. The real app, running live.
            </p>
          </div>

          {/* RIGHT, the peek */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          >
            <BrowserFrame url="lantern.app/lang/mi">
              <WorkspacePeek />
            </BrowserFrame>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
