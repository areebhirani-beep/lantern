"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Check,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sprout,
  Volume2,
  X,
} from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { SectionHead } from "./primitives";
import { BorderBeam } from "@/components/vengeance/border-beam";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

function Card({
  icon: Icon,
  title,
  body,
  children,
  className = "",
  surface = "p-6 sm:p-7",
  beam,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  children?: React.ReactNode;
  className?: string;
  surface?: string;
  beam?: { from: string; to: string; delay?: number };
}) {
  return (
    <motion.div variants={item} className={className}>
      <SpotlightCard className={`flex h-full flex-col ${surface}`}>
        {beam && (
          <BorderBeam
            size={160}
            duration={10}
            delay={beam.delay ?? 0}
            colorFrom={beam.from}
            colorTo={beam.to}
            className="pointer-events-none"
          />
        )}
        <Icon className="h-5 w-5 text-ember" />
        <h3 className="mt-5 font-display text-xl text-cream">{title}</h3>
        <p className="mt-2 leading-relaxed text-muted">{body}</p>
        {children && <div className="mt-auto pt-6">{children}</div>}
      </SpotlightCard>
    </motion.div>
  );
}

/**
 * The feature section, rebuilt as an asymmetric bento where every card carries
 * a small inline proof of the product working, not just a claim. Adapted from a
 * 21st.dev bento pattern, rendered fully in the Lantern system.
 */
export function FeatureBento() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="max-w-2xl"
      >
        <SectionHead index="05" label="What you get" />
        <h2 className="mt-7 font-display text-3xl text-cream sm:text-4xl">
          Everything a learner needs, generated from almost nothing.
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6"
      >
        {/* Hero card, the whole premise, with a from-nothing proof. */}
        <Card
          icon={Sprout}
          title="A course for a language that never had one"
          body="No textbook, no app, no data online. Lantern starts from whatever words are left and builds the rest."
          className="sm:col-span-2 lg:col-span-4"
          surface="p-7 sm:p-9 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]"
          beam={{ from: "#ffb454", to: "#34d8a6", delay: 0 }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1.5">
              {["No textbook", "No app", "No data online"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-faint">
                  <X className="h-3.5 w-3.5" />
                  <span className="line-through">{t}</span>
                </div>
              ))}
            </div>
            <ArrowRight className="h-5 w-5 text-ember" />
            <div className="rounded-xl border border-ember/30 bg-ember/[0.06] px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-faint">
                Lantern builds
              </div>
              <div className="mt-0.5 font-display text-lg text-cream">
                A course you can take
              </div>
            </div>
          </div>
        </Card>

        {/* The differentiator, shown as cited vs rejected. */}
        <Card
          icon={ShieldCheck}
          title="Never invents a word"
          body="Every word it teaches is real and cited. Anything it cannot trace to her words is rejected in code."
          className="lg:col-span-2"
          surface="rounded-xl! p-6 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]"
          beam={{ from: "#ffb454", to: "#34d8a6", delay: 2 }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-data border border-line bg-ink/40 px-3 py-2">
              <span className="font-display text-cream">whānau</span>
              <span className="flex items-center gap-1 font-mono text-xs text-pounamu">
                <Check className="h-3.5 w-3.5" /> cited
              </span>
            </div>
            <div className="flex items-center justify-between rounded-data border border-line/60 bg-ink/25 px-3 py-2">
              <span className="font-display text-faint line-through">a word she never said</span>
              <span className="font-mono text-xs text-faint">removed</span>
            </div>
          </div>
        </Card>

        {/* Audio, shown as a player. */}
        <Card
          icon={Volume2}
          title="Hear every word"
          body="Built-in pronunciation, so you can speak it, not only read it."
          className="lg:col-span-2"
          surface="p-6 sm:p-7 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]"
          beam={{ from: "#ffb454", to: "#34d8a6", delay: 4 }}
        >
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember text-ink">
              <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-px" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <div className="flex h-7 items-end gap-[3px]" aria-hidden>
              {[10, 18, 8, 24, 14, 20, 11, 22, 9, 16].map((h, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-ember/55"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <span className="ml-1 font-display text-cream">Kia ora</span>
          </div>
        </Card>

        {/* Grammar, shown as the discovered tense table. */}
        <Card
          icon={Brain}
          title="Real grammar, discovered"
          body="It works out tense, plurals, and patterns from the examples it is given."
          className="lg:col-span-2"
          surface="rounded-xl! p-6 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]"
          beam={{ from: "#ffb454", to: "#34d8a6", delay: 6 }}
        >
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {[
              ["past", "i", "haere"],
              ["now", "kei te", "haere"],
              ["future", "ka", "haere"],
            ].map(([t, particle, verb]) => (
              <span
                key={t}
                className="rounded-data bg-surface-2 px-2.5 py-1"
              >
                <span className="text-faint">{t} </span>
                <span className="text-ember">{particle}</span>{" "}
                <span className="text-cream">{verb}</span>
              </span>
            ))}
          </div>
        </Card>

        {/* Compounding, shown as add-a-phrase growth. */}
        <Card
          icon={RefreshCw}
          title="It grows every time someone uses it"
          body="Add a phrase and the whole course re-derives, richer. The record compounds instead of fading."
          className="lg:col-span-2"
          surface="p-7 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]"
          beam={{ from: "#ffb454", to: "#34d8a6", delay: 8 }}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1.5 text-sm text-ember">
              <Plus className="h-3.5 w-3.5" /> add a phrase
            </span>
            <ArrowRight className="h-4 w-4 text-faint" />
            <span className="font-mono text-base text-cream">
              41 <span className="text-faint">→</span> 42
            </span>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
