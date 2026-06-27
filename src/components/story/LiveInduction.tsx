"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Check, X } from "lucide-react";

// The corpus -> cited vocabulary, live. A judge watches Lantern lift real words
// out of real phrases, each cited, and watches the guardrail discard an invented
// one. This is the one thing a marketing site cannot fake.

type Item = { word: string; meaning: string; from: string | null };

const STREAM: Item[] = [
  { word: "kia ora", meaning: "hello", from: "Kia ora" },
  { word: "haere", meaning: "go", from: "I haere au" },
  { word: "au", meaning: "I, me", from: "I haere au" },
  { word: "whānau", meaning: "family", from: "whānau" },
  { word: "ka", meaning: "future marker", from: "ka haere au" },
  { word: "taniwha", meaning: "water spirit", from: null }, // not in the corpus
];

const SOURCES = ["Kia ora", "I haere au", "whānau", "ka haere au"];
const TICK = 1300;

export function LiveInduction() {
  // step 0 = idle; 1..N = processing STREAM[step-1]; N+1, N+2 = hold; then loop.
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % (STREAM.length + 3)), TICK);
    return () => clearInterval(t);
  }, []);

  const current = step >= 1 && step <= STREAM.length ? STREAM[step - 1] : null;
  const rejecting = current ? current.from === null : false;
  const accepted = STREAM.slice(0, Math.min(step, STREAM.length)).filter((x) => x.from);

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      {/* corpus */}
      <div className="rounded-2xl border border-line bg-ink/70 p-5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">The corpus</p>
        <p className="mt-1 text-sm text-muted">Real phrases, the only thing it may learn from.</p>
        <div className="mt-4 space-y-2">
          {SOURCES.map((s) => {
            const active = current?.from === s;
            return (
              <div
                key={s}
                className={`rounded-data border px-3.5 py-2 font-display text-cream transition-colors duration-300 ${
                  active ? "border-ember/60 bg-ember/10" : "border-line bg-ink"
                }`}
              >
                {s}
              </div>
            );
          })}
        </div>
      </div>

      {/* engine */}
      <div className="flex flex-col items-center justify-center gap-2 px-1 text-center">
        <motion.span
          className="grid h-12 w-12 place-items-center rounded-full border border-line bg-ink text-ember"
          animate={{ scale: current ? [1, 1.12, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          <ShieldCheck className="h-5 w-5" />
        </motion.span>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">guardrail</p>
        <div className="h-5">
          <AnimatePresence mode="wait">
            {current && (
              <motion.p
                key={current.word}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className={`font-mono text-[11px] ${rejecting ? "text-rose-300" : "text-pounamu"}`}
              >
                {rejecting ? "checking…" : "cited ✓"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* learned vocabulary */}
      <div className="rounded-2xl border border-line bg-ink/70 p-5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Cited vocabulary</p>
        <p className="mt-1 text-sm text-muted">Every word traceable to a phrase.</p>
        <div className="mt-4 min-h-[11rem] space-y-2">
          <AnimatePresence initial={false}>
            {accepted.map((v) => (
              <motion.div
                key={v.word}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-between gap-3 rounded-data border border-line bg-surface px-3 py-2"
              >
                <span className="font-display text-cream">
                  {v.word} <span className="text-sm text-muted">{v.meaning}</span>
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-pounamu">
                  <Check className="h-3 w-3" /> {v.from}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* the guardrail catching an invented word */}
          <AnimatePresence>
            {rejecting && current && (
              <motion.div
                key="reject"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex items-center justify-between gap-3 rounded-data border border-rose-400/40 bg-rose-400/5 px-3 py-2"
              >
                <span className="font-display text-rose-200/80 line-through decoration-rose-400/70">
                  {current.word}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-rose-300">
                  <X className="h-3 w-3" /> not attested, discarded
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-3 border-t border-line/60 pt-3 font-mono text-[10px] leading-relaxed text-faint">
          An invented word never reaches a learner. Enforced in code, not in a prompt.
        </p>
      </div>
    </div>
  );
}
