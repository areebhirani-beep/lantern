<!-- PASTE-READY "About the project" for Youth Code x AI. Track: AI That Actually Helps People. -->

## Inspiration

Most "AI" you see is pointed at making something faster or flashier. We wanted to point it at one of the most human problems there is: a language goes silent somewhere on Earth about **every two weeks**, and the people losing theirs are overwhelmingly Indigenous and marginalized communities who already have the least support.

We kept picturing one person — a grandparent who still dreams in a language their grandchild was never taught, one of the last in the family who can speak it. Her language has no app and no course, not because no one cares, but because writing a language down and teaching it has always taken trained experts years, and most languages will never get that time. We wanted to put that power in the hands of the person who actually holds the words — not a researcher, not a company. So we built **Lantern**: AI that *actually helps a person* keep their own language alive, and that a non-expert can use on their phone.

## What it does

**Lantern is Duolingo for languages that are dying.** Pick a language so endangered that no app, no textbook, and no online course exists for it. Lantern takes a handful of remembered phrases, works out the grammar hidden inside them, and builds a real course you can actually learn from:

- **flashcards** with the word, the meaning, and **pronunciation you can hear out loud**;
- the **grammar it discovered**, explained in plain language (for Māori, how a small word before the verb changes past, present, and future);
- a **vocabulary bank** where every single word shows the exact phrase it came from;
- and a **Contribute** button: add one phrase you remember — like *Ka pai* ("good") — and the whole course rebuilds itself, a little richer, in seconds.

It comes pre-loaded with eight endangered languages; two of them — Māori and Cherokee — are fully learnable right now. The whole thing works on a phone, and a stranger understands what it does in one sentence.

Try it live at **https://lantern-cyan.vercel.app** — watch it learn Māori from 41 phrases, see the grammar it found, and take the course it built.

The one rule it never breaks is the most important part: **it only ever teaches words a real speaker actually said.** An AI can't truly know a language with fifty speakers, so instead of letting it make things up, Lantern only reorganizes and teaches the community's *own* words — and a check built into the code throws away any sentence containing a word nobody actually used.

## How we built it

- A **web app** in **Next.js 16 + TypeScript**, deployed on **Vercel**, so it runs on any phone or laptop with no install.
- An **AI induction engine** that reads only the phrases it's given, lines up each word with its meaning, and spots grammar by comparing similar phrases. We force the AI to return clean, structured data and double-check it with **Zod** before anything is shown.
- A **no-hallucination guardrail** written directly into the code: every sentence is split into words and each is checked against the real vocabulary; if even one word was never actually said, the sentence is deleted before any learner sees it.
- A **flashcard course** on the **SM-2** spaced-repetition algorithm with in-browser **text-to-speech** so you can hear the words.
- **Live AI** runs an **LLM — Llama 3.3 70B on Groq**, driven through the **Anthropic SDK** — with a hand-verified backup so the demo always works.

## Accomplishments we're proud of — and we measured it

We didn't just want to *say* it helps and that it's honest, so we measured it:

```
  FROM 41 MĀORI PHRASES, LANTERN BUILT
  ──────────────────────────────────────────────
    34   words you can learn, each one real and cited
     5   grammar patterns it discovered on its own
    12   flashcards on a smart review schedule
  ──────────────────────────────────────────────
     0   made-up words ever shown to a learner       ✓
  48/48  words backed by a real source               ✓
   7/7   practice sentences pass the honesty check   ✓
```

Reproducible live at `GET /api/metrics`. So: **zero made-up words ever reach a learner**, enforced by the code, not just a promise; it's **genuinely clear**; the interface is **warm and easy** so you never feel lost; and it's **real and live**, not a slideshow — the AI runs on the actual website.

## Why this is "AI that actually helps people"

- It solves a **real, human problem** for real people — not a demo, a tool a community can use today.
- It's **usable by a non-expert**: a grandparent, a kid, anyone who remembers a few words; no AI knowledge required.
- It's **honest by design** — the most respectful thing AI can do with someone's heritage is refuse to invent it. We made the AI do *less*, on purpose, and that's exactly what makes it trustworthy and genuinely helpful.

## What we learned

That the most helpful AI is sometimes the one that does *less*. By refusing to invent, Lantern became something a whole community — and even a language expert — could trust, and trust is everything when you're handling someone's heritage. We also learned how much a clear, kind interface matters: the best technology does nothing if the person who needs it can't use it.

## What's next

Real recordings from native speakers, a way for fluent speakers to review and approve lessons, printable booklets for communities without good internet, and controls so each community fully owns and governs its own words. The dream is a living library with a place for every endangered language, where anyone who still remembers can help bring theirs back — starting today.

---

*Built during the hackathon; we used AI as a coding and drafting accelerant, while the central insight (amplify, never originate) and the direction are ours. Seed data cited from the Te Aka Māori Dictionary, DAILP and the Cherokee Nation Language Department, Omniglot, and the UNESCO Atlas; some UI primitives adapted from Magic UI / 21st.dev.*
