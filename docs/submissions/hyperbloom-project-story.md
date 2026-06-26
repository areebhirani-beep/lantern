## Inspiration

Half of the world's roughly 7,000 languages are expected to fall silent this century, about one every two weeks. **UN Sustainable Development Goal 4 calls for inclusive, quality education for all, yet for the ~3,000 most endangered languages there is no course, no textbook, and no app, so quality education *in your own language* simply does not exist to be accessed.** The communities affected are overwhelmingly Indigenous and marginalized, which makes this SDG 10 (reduced inequalities) and the safeguarding of intangible cultural heritage all at once.

We started from one face: a grandmother who dreams in a language her grandchild was never taught, one of the last in her family who can still speak it. The reason her language has no course is not that no one cares, it is that documenting and teaching a language has always taken trained linguists years, and the world runs out of those before it runs out of dying languages. We built **Lantern** to remove that bottleneck, to manufacture the missing education on demand, from the few words a community still remembers.

## What it does

**Lantern is Duolingo for languages that are dying.** Pick a language so endangered that no learning materials exist for it. Lantern takes a handful of remembered phrases, works out the grammar hidden inside them, and builds a real beginner course, in minutes, for a language that had nothing an hour before:

- a **cited vocabulary bank**, every word traceable to the phrase that attests it;
- the **grammar patterns** it discovered (for Māori: how tense rides on a particle before the verb);
- **flashcards with pronunciation** on a spaced-repetition schedule;
- and a **Contribute** tab where adding one phrase, like *Ka pai* ("good"), rebuilds the entire course, richer, in seconds.

It ships pre-loaded with eight endangered languages, two of them, Māori and Cherokee, fully learnable today, including languages like Ainu (about ten speakers left) and Manx and Cornish, both brought back from the brink by their own communities.

What makes it trustworthy is an inversion. An AI cannot truly know a language with fifty speakers, so asking it to "teach" one only produces confident hallucination. Lantern's model is therefore **not the source of knowledge, it is an amplifier of the community's.** It reasons only over the phrases it is given, cites every claim, and is **forbidden, in code, from ever teaching a word that was not attested.** The same rule that keeps it honest makes it general: it works for *any* language, because it depends on the community's data, not the model's memory. The full loop:

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

- **Next.js 16 + TypeScript** web app, runs on a phone or a laptop, deployed on **Vercel**.
- An **induction engine** that does interlinear analysis on the seed corpus, induces morphology from minimal pairs, and writes a lesson by recombining only attested vocabulary, driven through **forced structured output** and validated at runtime with **Zod**.
- **The guardrail, in code, not in the prompt:** every generated sentence is tokenized and checked against the attested vocabulary; one unattested word and the sentence is discarded. That is what gives a probabilistic model a hard correctness property.
- A course on the **SM-2** spaced-repetition algorithm with in-browser **Web Speech** text-to-speech.
- **Live induction on Groq (Llama 3.3 70B)** with a verified hand-checked fallback so the demo never breaks, and the contribution flywheel persisted in **MongoDB Atlas**.

## Challenges we ran into

- **Resisting the obvious build.** Letting the model free-generate would have demoed beautifully and produced confident nonsense. We chose to make it reason only over real, cited words and to enforce that in code, the harder path, and the entire point.
- **Honesty under scarcity.** With a tiny corpus the engine finds vocabulary but little grammar, and we chose to report that truthfully rather than fabricate patterns, because that restraint is exactly the behavior the design should produce.
- **Respecting the data.** Endangered-language data carries real ownership and governance concerns, so we cite every source and treat the community, not the model, as the owner of the corpus.

## Accomplishments that we're proud of

This is not a concept video, it is a working web app, and we measured its behavior:

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

- A probabilistic model given a **hard, code-level correctness property**, reproducible live at `GET /api/metrics`.
- **Quality education created where there was none**, a real course for a language that had zero materials an hour earlier.
- It is **real and live**, the AI runs on the deployed site.

## What we learned

That the honest version of an AI tool is often the more powerful one. By refusing to invent, Lantern became something a community *and* a linguist could both trust, and for endangered-language data and the people it belongs to, trust is the whole game. Pointed at SDG 4, the lesson is that "education for all" sometimes means *manufacturing* the education that was never written down, without ever falsifying it.

## What's next for Lantern

Speaker-recorded audio, fluent-speaker review, printable primers for offline communities, and formal data-sovereignty controls so each community owns and governs its own words. The endpoint is a living, community-governed **digital ark** with an entry for every endangered language, each revivable the moment one elder seeds it, a direct, scalable path toward quality education and reduced inequality for the 3,000 communities currently triaged out of reach.

---

*Everything above is demonstrated on screen in our 2-minute film, the working app, the live induction, and the measured results, so the video stands on its own. Built during the hackathon; we used AI as a coding and drafting accelerant, while the central insight (amplify, never originate) and the direction are ours. Seed data cited from the Te Aka Māori Dictionary, DAILP and the Cherokee Nation Language Department, Omniglot, and the UNESCO Atlas; some UI primitives adapted from Magic UI / 21st.dev.*
