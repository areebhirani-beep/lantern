"use client";

import { motion } from "framer-motion";

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
 * The narrated timeline, centered and clean: large Fraunces numerals, a thin
 * connector between steps, and one worked grammar example.
 */
export function HowItWorks() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-ember">What happened next</p>
        <h2 className="mt-4 font-display text-3xl text-cream sm:text-4xl">
          A whole course took shape in minutes.
        </h2>
      </motion.div>

      <div className="mt-16 flex flex-col items-center">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex w-full flex-col items-center">
            {i > 0 && (
              <span className="my-7 h-10 w-px bg-gradient-to-b from-line/60 to-transparent" />
            )}
            <div className="text-center">
              <span className="font-display text-4xl leading-none text-faint/45 sm:text-5xl">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-xl text-cream sm:text-2xl">{s.title}</h3>
              <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">{s.body}</p>

              {s.example && (
                <div className="mx-auto mt-6 max-w-md rounded-[14px] border border-line bg-ink p-5 text-left shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]">
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
