<!-- PASTE-READY "About the project" for FutureHacks. Theme: future cities / civic tools. -->

## Inspiration

The future is a city. By 2050 about two-thirds of humanity will live in one — and that single migration is quietly the largest driver of language extinction on Earth. A language almost never dies where it was born; it dies one generation after that place's children move to the city for work and grow up speaking the dominant language instead. Linguists call it *language shift*, and the city is its engine. About **one language goes silent every two weeks**, and nearly half of the world's 7,000 languages are expected to be gone this century — most of them carried by the Indigenous, immigrant, and diaspora communities now packed into our biggest cities.

We started from one face inside that city: a grandmother who dreams in a language her grandchild was never taught, one of the last in her family who can still speak it — surrounded by millions of people and no one left to speak it with. Her language has no course not because no one cares, but because documenting and teaching a language has always taken trained linguists years, and the world runs out of linguists long before it runs out of dying languages. We built **Lantern** as the missing **civic infrastructure** for that city: a public tool that manufactures the missing course on demand, from the few words a community still remembers.

## What it does

**Lantern is Duolingo for languages that are dying.** Pick a language so endangered that no app, no textbook, and no course exists for it. Lantern takes a handful of remembered phrases, works out the grammar hidden inside them, and builds a real beginner course — in minutes — for a language that had nothing an hour before:

- a **cited vocabulary bank**, every word traceable to the exact phrase that attests it;
- the **grammar patterns** it discovered (for Māori: how tense rides on a particle before the verb, how number lives on the article, how possession marks by dropping a letter);
- **flashcards with pronunciation** on a spaced-repetition schedule;
- and a **Contribute** tab where adding one phrase — like *Ka pai* ("good") — rebuilds the entire course, richer, in seconds.

It ships with eight endangered languages, two of them (Māori and Cherokee) fully learnable today, including Ainu (about ten speakers left) and Manx and Cornish, both brought back from the brink by their own communities. It is, in effect, a **civic amenity for the multilingual city**: a place an urban family can go to keep its own language alive and hand it down.

Try it live at **https://lantern-cyan.vercel.app** — watch it learn Māori from 41 phrases, see the grammar it found, and take the course it built.

What makes it trustworthy is an inversion. An AI cannot truly *know* a language with fifty speakers, so asking it to "teach" one only produces confident hallucination — worse than useless for a critically endangered language. Lantern's model is therefore **not the source of knowledge; it is an amplifier of the community's.** It reasons only over the phrases it is given, cites every claim, and is **forbidden, in code, from ever teaching a word that was not attested.**

## How we built it

- **Next.js 16 + TypeScript**, deployed on **Vercel** — a civic tool any city resident opens in a browser, on a phone or a laptop, no install.
- An **induction engine** that does interlinear analysis on the seed corpus, induces morphology from minimal pairs, and writes a lesson by recombining only attested vocabulary, via forced structured output validated at runtime with **Zod**.
- **The guardrail, in code, not in the prompt** (`src/lib/engine/guardrail.ts`): every generated sentence *and* flashcard is tokenized and checked against the attested vocabulary; one unattested word and the item is discarded. That gives a probabilistic model a hard correctness property.
- A course on the **SM-2** spaced-repetition algorithm with in-browser **Web Speech** text-to-speech.
- **Live induction** runs an **LLM — Llama 3.3 70B on Groq**, driven through the **Anthropic SDK** — with a verified hand-checked fallback so the demo never breaks; the contribution flywheel persists in **MongoDB Atlas**.

## Accomplishments we're proud of — we measured it

This is not a concept video. It is a working web app, and we measured its behavior:

```
  FROM 41 MĀORI PHRASES, LANTERN RECOVERED
  ──────────────────────────────────────────────
    34   words, each cited to its source
     5   grammar patterns (tense, number, possession)
    12   flashcards on a spaced-repetition schedule
  ──────────────────────────────────────────────
     0   invented words reached a learner          ✓
  48/48  vocabulary items cited (both languages)   ✓
   7/7   generated practice sentences attested     ✓
```

Reproducible live at `GET /api/metrics` — the same numbers a judge can pull right now.

## How it maps to the judging criteria

- **Innovation & creativity** — an inversion: the AI is an *amplifier* of the community's knowledge, handed a hard, deterministic correctness property enforced in code, not a prompt.
- **Adherence to theme** — civic, public-good infrastructure aimed at the defining cultural problem of the urban future: the languages a city quietly erases as people migrate into it. Infrastructure for *who a city's people are*, not just how it runs.
- **Real-world impact & usefulness** — ships with eight real endangered languages, two fully learnable today, every word cited; the AI runs live on the deployed site, not a mockup.
- **Presentation** — a film, a working deployment, and reproducible measured results at `GET /api/metrics`; the demo stands on its own.
- **User experience** — Duolingo-simple: flashcards, audio you can hear, spaced repetition, and a one-field Contribute box that rebuilds the whole course in seconds.

## What's next

Speaker-recorded audio, fluent-speaker review, printable primers for offline communities, and formal data-sovereignty controls so each community owns and governs its own words. The endpoint is a living, community-governed **digital ark** with an entry for every endangered language — each revivable the moment one elder seeds it, a piece of cultural infrastructure as ordinary in tomorrow's city as a library is in today's.

---

*Built during the hackathon; we used AI as a coding and drafting accelerant, while the central insight (amplify, never originate) and the direction are ours. Seed data cited from the Te Aka Māori Dictionary, DAILP and the Cherokee Nation Language Department, Omniglot, and the UNESCO Atlas; some UI primitives adapted from Magic UI / 21st.dev.*
