"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="text-ember underline decoration-dotted underline-offset-2 hover:text-flame">
    {children}
  </Link>
);

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "What is Lantern?",
    a: (
      <>
        It&rsquo;s Duolingo for languages that are dying. Lantern takes the handful of
        phrases a community still remembers and builds a real beginner course — a cited
        vocabulary, the grammar it found, and flashcards — in minutes, for languages no
        app or textbook covers.
      </>
    ),
  },
  {
    q: "How can an AI teach a language with only a few speakers left?",
    a: (
      <>
        It doesn&rsquo;t pretend to. An AI can&rsquo;t truly know a language with fifty
        speakers, so Lantern never asks it to. The model reasons only over the real
        phrases it&rsquo;s given, cites every word to the phrase that attests it, and is
        forbidden — <span className="text-cream">in code</span> — from ever teaching a
        word no speaker said. It amplifies the community&rsquo;s knowledge; it never
        invents.
      </>
    ),
  },
  {
    q: "Is this real, or just a concept?",
    a: (
      <>
        It&rsquo;s a working app, and the honesty is measurable:{" "}
        <span className="text-cream">0</span> invented words have ever reached a learner,{" "}
        <span className="text-cream">48/48</span> vocabulary items are cited, and{" "}
        <span className="text-cream">7/7</span> practice sentences pass attestation. You
        can recompute the numbers yourself at <A href="/api/metrics">/api/metrics</A>.
      </>
    ),
  },
  {
    q: "Where does the language data come from?",
    a: (
      <>
        Verified seed corpora, each cited — the Te Aka Māori Dictionary, DAILP and the
        Cherokee Nation Language Department, Omniglot, and the UNESCO Atlas. New phrases
        come from contributors and are attributed to them.
      </>
    ),
  },
  {
    q: "Can I add my own language or phrases?",
    a: (
      <>
        Yes — that&rsquo;s the whole flywheel. The Contribute tab lets anyone add a
        phrase, and the engine re-derives a richer course in seconds. Every phrase makes
        the course better. <A href="/lang/mi">Try it on Māori</A>.
      </>
    ),
  },
  {
    q: "Who owns the language data?",
    a: (
      <>
        The community does. Endangered-language data carries real ownership and
        governance concerns, so Lantern treats the community — not the model — as the
        owner, cites every source, and is building formal data-sovereignty controls so
        each community governs its own words.
      </>
    ),
  },
  {
    q: "Do I need an account? Is it free?",
    a: (
      <>
        No account needed, and it&rsquo;s free. You can browse, learn, hear
        pronunciation, and contribute fully signed-out. Signing in (Google, GitHub, or
        email) only adds saved spaced-repetition progress and credits your
        contributions.
      </>
    ),
  },
  {
    q: "How does pronunciation work?",
    a: (
      <>
        In-browser text-to-speech gives a spoken guide using the closest available
        voice — honest about being a guide, since fluent voices rarely exist for these
        languages. Speaker-recorded audio from real fluent speakers is rolling out so you
        can hear the genuine sound.
      </>
    ),
  },
  {
    q: "Which languages are supported?",
    a: (
      <>
        Eight endangered languages are aboard the <A href="/ark">Living Ark</A>, with
        Māori and Cherokee fully learnable today — including Ainu (about ten speakers
        left), and Manx and Cornish, both declared gone and brought back by their own
        communities.
      </>
    ),
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-10 border-y border-line">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={i > 0 ? "border-t border-line/60" : ""}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display text-lg leading-snug text-cream">{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-ember transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-9 leading-relaxed text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
