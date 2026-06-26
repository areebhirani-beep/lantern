"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type Step = {
  n: string;
  title: string;
  body: string;
  example?: [string, string, string][]; // [particle, verb+rest, gloss]
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "It started with her words",
    body: "The forty-one phrases became the ground truth. They are the only thing Lantern is allowed to learn from.",
  },
  {
    n: "02",
    title: "It found the grammar hiding inside them",
    body: "Lantern lined up her sentences and spotted a pattern: the verb never changes, and a small word in front of it carries the time.",
    example: [
      ["i", "haere au", "I went"],
      ["kei te", "haere au", "I’m going"],
      ["ka", "haere au", "I will go"],
      ["kua", "haere au", "I have gone"],
    ],
  },
  {
    n: "03",
    title: "It built a course you can take",
    body: "Flashcards, pronunciation you can hear, and spaced repetition that brings each word back just before you would forget it. The kind of thing that normally takes linguists years.",
  },
  {
    n: "04",
    title: "And it keeps growing",
    body: "Every new phrase she remembers, or anyone adds, makes the course richer. Her language stops shrinking and starts growing again.",
  },
];

/**
 * The narrated timeline, rebuilt as an editorial spine: large Fraunces numerals,
 * a vertical line that fills with ember as you read down, and one worked grammar
 * example. Form elevated, not more product mocks (the page shows those elsewhere).
 */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.6"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <section className="mx-auto max-w-4xl px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="max-w-2xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-ember">What happened next</p>
        <h2 className="mt-4 font-display text-3xl text-cream sm:text-4xl">
          A whole course took shape in minutes.
        </h2>
      </motion.div>

      <div ref={ref} className="relative mt-16 pl-9 sm:pl-12">
        {/* Spine: faint track + ember fill driven by scroll. */}
        <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-line" />
        <motion.div
          style={{ scaleY }}
          className="absolute left-1.5 top-1.5 bottom-1.5 w-px origin-top bg-gradient-to-b from-flame via-ember to-ember/20"
        />

        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
            className="relative pb-14 last:pb-0"
          >
            {/* Node on the spine. */}
            <span className="absolute -left-[1.875rem] top-2 grid h-4 w-4 place-items-center rounded-full bg-ink ring-1 ring-line sm:-left-[2.625rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_#ffb454]" />
            </span>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl leading-none text-faint/55 sm:text-4xl">
                {s.n}
              </span>
              <h3 className="font-display text-xl text-cream sm:text-2xl">{s.title}</h3>
            </div>
            <p className="mt-3 max-w-xl leading-relaxed text-muted">{s.body}</p>

            {s.example && (
              <div className="mt-5 max-w-lg rounded-2xl border border-line bg-surface/40 p-5">
                <div className="grid gap-1.5 font-display text-cream sm:grid-cols-2">
                  {s.example.map(([particle, rest, gloss]) => (
                    <span key={particle}>
                      <span className="text-ember">{particle}</span> {rest},{" "}
                      <span className="text-muted">{gloss}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
