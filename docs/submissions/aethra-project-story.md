## Inspiration

A language goes silent somewhere on Earth about every two weeks, usually not because no one cares, but because writing one down and teaching it has always taken trained linguists years, and most languages will never get that time. We started from one face: a grandmother who dreams in a language her grandchild was never taught, one of the last in her family who can still speak it. We didn't want an AI that pretends to know her language. We wanted to build the tool that could bring it back from the handful of words she still remembers. We call it **Lantern**.

The deeper realization, the one this whole project is built on: **language death is not destiny, it is a tooling problem.** A field linguist can spend years documenting a single language, and there are thousands of endangered languages and almost no linguists or years to go around. So the world triages: a few languages get attention, most run out of time. If you collapse the cost of turning *what a community remembers* into *teachable material* from years to minutes, that triage math inverts, and revival becomes possible for the long tail nobody can reach in time.

## What it does

**Lantern is Duolingo for languages that are dying.** Pick a language so endangered that no app, no textbook, and no course exists for it. Lantern takes a few remembered phrases, works out the grammar hidden inside them, and builds a real beginner course you can take today:

- a **cited vocabulary bank**, every word traceable to the exact phrase that attests it;
- the **grammar patterns** it discovered (for Māori: how tense rides on a particle before the verb, how number lives on the article, how possession marks by dropping a letter);
- **flashcards with pronunciation** on a spaced-repetition schedule;
- and a **Contribute** tab where adding one phrase, say *Ka pai* ("good"), rebuilds the entire course, richer, in seconds.

It ships pre-loaded with eight endangered languages, two of them, Māori and Cherokee, fully learnable today.

The move that makes it work is an inversion. Most "AI for X" asks the model to *be* the expert, and a model that has barely seen a fifty-speaker language will only hallucinate, confidently and wrongly, which for a critically endangered language is worse than useless. So Lantern's model is **not the source of knowledge, it is an amplifier of the community's.** It reasons only over the phrases it is given, cites its evidence for every claim, and is **forbidden, in code, from ever teaching a word that was not attested.** The same rule that keeps it honest is what makes it general: it works for *any* language, because it leans on the community's data, not the model's memory. The full thesis is in our **Moonshot Paper**.

Here is the whole system as one self-growing loop:

```
  ┌────────┐   ┌─────────────┐   ┌──────────────┐   ┌────────────┐
  │  SEED  │──▶│   INDUCE    │──▶│  GUARDRAIL   │──▶│  GENERATE  │
  │ cited  │   │ align words │   │ every word   │   │ flashcards │
  │ phrases│   │ + grammar   │   │ attested?    │   │ + practice │
  └────────┘   └─────────────┘   └──────┬───────┘   └─────┬──────┘
       ▲                         fail ──┘ discard          │
       │                                                   ▼
       │           ┌───────────────────┐         ┌──────────────┐
       └───────────│  GROW  (+1 phrase) │◀────────│    LEARN     │
                   │  re-derives, richer│         │ SRS + speech │
                   └───────────────────┘         └──────────────┘
```

## How we built it

- **Next.js 16 + TypeScript**, runs on a phone or a laptop, deployed on **Vercel**.
- An **induction engine** that does interlinear analysis on the seed corpus, induces morphology from minimal pairs, and writes a lesson by recombining only attested vocabulary, driven through **forced structured output** and validated at runtime with **Zod**.
- **The guardrail, in code, not in the prompt.** Before any generated sentence reaches a learner it is tokenized, and every token is checked against the attested vocabulary. One unattested word and the sentence is discarded. This is the heart of the design: it converts a probabilistic model into a system with a *hard correctness property*, the thing a prompt instruction can never guarantee.
- A course on the **SM-2** spaced-repetition algorithm with in-browser **Web Speech** text-to-speech.
- **Live induction on Groq (Llama 3.3 70B)** with a verified hand-checked fallback so the demo never breaks, and the contribution flywheel persisted in **MongoDB Atlas** (with an in-memory fallback).

## Challenges we ran into

- **Resisting the obvious build.** Letting the model free-generate would have demoed beautifully and produced confident nonsense. We chose to make it reason only over real, cited words and to enforce that in code, the harder path, and the entire point.
- **Honesty under scarcity.** With a tiny corpus the engine finds vocabulary but little grammar. From 15 isolated Cherokee words it correctly reports that there is not enough to induce much grammar, a lead, not a law. We chose to surface that truthfully rather than fabricate patterns, because that restraint is exactly the behavior the design should produce.
- **Making the guardrail airtight.** Tokenization across macrons, syllabary, and punctuation had to be exact, because a single normalization bug would let an unattested word slip through and quietly break the one promise the product makes.

## Accomplishments that we're proud of

We didn't want to just claim it is honest, so we measured it:

```
  FROM 41 MĀORI PHRASES, LANTERN RECOVERED
  ──────────────────────────────────────────────
    34   words, each cited to its source
     5   grammar patterns (tense, number, possession)
    12   flashcards on a spaced-repetition schedule
  ──────────────────────────────────────────────
     0   invented words reached a learner          ✓
  48/48  vocabulary items cited (both languages)   ✓
```

- We gave a probabilistic model a **hard, code-level correctness property**: no unattested word ever reaches a learner, and every figure above is reproducible live at `GET /api/metrics`.
- It is **genuinely clear**, a stranger understands what it does in one sentence.
- It is **real and live**, the AI runs on the deployed site, not a concept video.

## What we learned

That the honest version of an AI tool is often the more powerful one. Most teams reach for "make the model do more." The leap here was to make it do *less*, to forbid it from inventing, and in exchange win a guarantee. By refusing to originate, Lantern became something a community *and* a linguist could both trust, and for endangered-language data, trust is the whole game.

## What's next for Lantern

Speaker-recorded audio, fluent-speaker review, export to printable primers for offline communities, and formal data-sovereignty controls so each community owns and governs its own words. The endpoint is a living, community-governed **digital ark** with an entry for every endangered language, each one revivable the moment a single elder seeds it. A language with ten speakers and a phone could begin teaching itself the same day.

---

*Built during the hackathon. We used AI as a coding and drafting accelerant; the central insight (amplify, never originate) and the product direction are ours. Seed data cited from the Te Aka Māori Dictionary, DAILP and the Cherokee Nation Language Department, Omniglot, and the UNESCO Atlas of the World's Languages in Danger; some UI primitives adapted from Magic UI / 21st.dev.*
