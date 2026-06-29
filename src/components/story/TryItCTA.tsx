"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Volume2 } from "lucide-react";
import { BrowserFrame } from "./BrowserFrame";
import { BorderBeam } from "@/components/vengeance/border-beam";
import { InteractiveHoverButton } from "@/components/vengeance/interactive-hover-button";
import { RadialGlowButton } from "@/components/vengeance/radial-glow-button";

const EASE = [0.22, 1, 0.36, 1] as const;

/** A condensed, live-looking peek at the real Māori workspace you're about to open. */
function WorkspacePeek() {
  return (
    <div className="bg-ink p-5 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#ffb454", boxShadow: "0 0 10px #ffb454" }}
          />
          <span className="font-display text-cream">Māori</span>
          <span className="text-xs text-faint">te reo Māori</span>
        </div>
        <span className="font-mono text-[11px] text-faint">41 phrases</span>
      </div>

      {/* Active flashcard */}
      <div className="mt-4 rounded-card border border-line bg-surface p-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
          say &ldquo;hello&rdquo;
        </p>
        <p className="mt-1.5 font-display text-3xl text-cream">Kia ora</p>
        <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-muted">
          <Volume2 className="h-3.5 w-3.5 text-ember/80" /> hear it
        </span>
      </div>

      {/* Grammar Lantern found, as a clean inline line */}
      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
        Tenses it worked out
      </p>
      <p className="mt-2 font-mono text-cream">
        <span className="text-ember">i</span> haere{"  ·  "}
        <span className="text-ember">kei te</span> haere{"  ·  "}
        <span className="text-ember">ka</span> haere
      </p>

      {/* Quiet progress line */}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full w-1/4 rounded-full bg-ember" />
        </div>
        <span className="font-mono text-[11px] text-faint">Lesson 1 of 6</span>
      </div>
    </div>
  );
}

/**
 * The "try it" CTA, as an asymmetric two-column card: the pitch and actions on
 * one side, a live-looking peek at the actual workspace on the other, so the
 * click point shows exactly what opens. No animated borders — the product carries it.
 */
export function TryItCTA() {
  const router = useRouter();
  return (
    <section className="mx-auto max-w-5xl px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="card overflow-hidden p-8 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)] sm:p-10"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,21rem)]">
          <div>
            <p className="section-index uppercase tracking-[0.18em] text-ember">
              See it for yourself
            </p>
            <h2 className="mt-5 max-w-md font-display text-3xl leading-tight text-cream sm:text-[2.6rem]">
              Watch Lantern learn Māori from those 41 phrases.
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Open the workspace: her words, the grammar it found, and a course you
              can take, right now in your browser.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <RadialGlowButton
                onClick={() => router.push("/lang/mi")}
                aria-label="Open the Māori workspace"
                style={{ borderRadius: 9999 }}
              >
                <span className="flex items-center gap-2">
                  Open the Māori workspace
                  <ArrowRight className="h-4 w-4" />
                </span>
              </RadialGlowButton>
              <InteractiveHoverButton
                onClick={() => router.push("/ark")}
                className="h-12 px-6 text-base font-medium"
              >
                See every language
              </InteractiveHoverButton>
            </div>

            <p className="mt-5 font-mono text-xs text-faint">
              No sign-up. The real app, running live.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <BrowserFrame url="lantern.app/lang/mi">
                <WorkspacePeek />
              </BrowserFrame>
              <BorderBeam
                size={220}
                duration={11}
                colorFrom="#ffb454"
                colorTo="#34d8a6"
                className="pointer-events-none"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
