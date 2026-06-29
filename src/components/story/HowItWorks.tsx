"use client";

import { SectionHead, StoryReveal } from "./primitives";
import { BorderBeam } from "@/components/vengeance/border-beam";

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
 * The narrated timeline, left-aligned as an editorial numbered list: a mono step
 * index in a left rail with a hairline connector, the title and body in a single
 * reading column, and one worked grammar example set as machine-checked data.
 */
export function HowItWorks() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <StoryReveal className="max-w-2xl">
        <SectionHead index="02" label="How it works" />
        <h2 className="mt-7 font-display text-3xl text-cream sm:text-4xl">
          A whole course took shape in minutes.
        </h2>
      </StoryReveal>

      <div className="mt-14">
        {STEPS.map((s, i) => (
          <StoryReveal key={s.n} delay={i * 0.05}>
            <div className="grid grid-cols-[auto_1fr] gap-5 sm:gap-7">
              {/* index rail + connector */}
              <div className="flex flex-col items-center">
                <span className="font-mono text-sm text-ember">{s.n}</span>
                {i < STEPS.length - 1 && (
                  <span className="mt-2 w-px flex-1 bg-gradient-to-b from-line to-line/20" />
                )}
              </div>

              <div className="pb-12">
                <h3 className="font-display text-xl text-cream sm:text-2xl">{s.title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-muted">{s.body}</p>

                {s.example && (
                  <div className="relative mt-5 max-w-md overflow-hidden rounded-card border border-line bg-ink p-5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]">
                    <BorderBeam
                      size={120}
                      duration={8}
                      colorFrom="#ffb454"
                      colorTo="#34d8a6"
                      className="pointer-events-none"
                    />
                    <div className="grid gap-1.5 font-mono text-sm text-cream sm:grid-cols-2">
                      {s.example.map(([particle, rest, gloss]) => (
                        <span key={particle}>
                          <span className="text-ember">{particle}</span> {rest}
                          <span className="text-faint">, {gloss}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </StoryReveal>
        ))}
      </div>
    </section>
  );
}
