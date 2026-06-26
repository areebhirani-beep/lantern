# Lantern — canonical submission kit (paste into all 4 DevPost entries)

One source of truth so every hackathon submission is identical. Fields map 1:1 to
the DevPost "Edit project" form. Description + tagline are textarea fields (I set
those on DevPost directly). Built-with tags + gallery are the by-hand parts —
follow the order/captions below exactly and every entry matches.

---

## Project name
Lantern

## Elevator pitch (tagline)
A language dies every two weeks. Lantern is Duolingo for dying languages: it turns the words a community still remembers into a real course, with AI that never invents a word.

## Built with  (add each as a tag in the "Built with" field)
`Next.js` · `TypeScript` · `React` · `Tailwind CSS` · `Vercel` · `MongoDB` · `Anthropic Claude` · `Zod` · `Web Speech API` · `Framer Motion` · `cobe`

## Links
- **Try it (live):** https://lantern-cyan.vercel.app
- **Repository:** https://github.com/areebhirani-beep/lantern
- **Video:** _upload `video/out/lantern-promo.mp4` to YouTube (Unlisted), paste link_

## Thumbnail
`futurehacks-media/00-thumbnail.png`  (3:2)

---

## About the project  (paste into the Markdown "About the project" box)

## Inspiration

A language goes silent somewhere in the world about every two weeks, and nearly half of the world's 7,000 languages are expected to be gone this century. Not usually because no one cares — but because the people who could save a language, the elders who still carry its words, were never given a tool simple enough to use. Documenting and teaching a language has always been a job for trained linguists with years to spare, and the world runs out of linguists long before it runs out of dying languages.

We kept picturing one person: a grandparent who still dreams in a language their grandchild was never taught, one of the last in the family who can speak it. The communities losing their languages are overwhelmingly Indigenous, immigrant, and diaspora — the people who already have the least support. We wanted to put real power in the hands of that grandparent, not a researcher, not a company. So we built **Lantern**: an AI that helps a community keep its own language alive, from the few words it still remembers.

## What it does

**Lantern is Duolingo for languages that are dying.** Pick a language so endangered that no app, no textbook, and no course exists for it. Lantern takes a handful of remembered phrases, works out the grammar hidden inside them, and builds a real beginner course — in minutes — for a language that had nothing an hour before:

- a **cited vocabulary bank**, every word traceable to the exact phrase that attests it;
- the **grammar patterns** it discovered (for Māori: how tense rides on a particle before the verb, how number lives on the article, how possession marks by dropping a letter);
- **flashcards with pronunciation** on a spaced-repetition schedule;
- and a **Contribute** tab where adding one phrase — like *Ka pai* ("good") — rebuilds the entire course, richer, in seconds.

It ships with eight endangered languages, two of them (Māori and Cherokee) fully learnable today, including Ainu (about ten speakers left) and Manx and Cornish, both brought back from the brink by their own communities.

Try it live at **https://lantern-cyan.vercel.app** — watch it learn Māori from 41 phrases, see the grammar it found, and take the course it built.

What makes it trustworthy is an inversion. An AI cannot truly *know* a language with fifty speakers, so asking it to "teach" one only produces confident hallucination — which for a critically endangered language is worse than useless. Lantern's model is therefore **not the source of knowledge; it is an amplifier of the community's.** It reasons only over the phrases it is given, cites every claim, and is **forbidden, in code, from ever teaching a word that was not attested.** The same rule that keeps it honest makes it general: it works for *any* language, because it depends on the community's data, not the model's memory.

## How we built it

- **Next.js 16 + TypeScript** web app, deployed on **Vercel** — runs on a phone or a laptop, no install.
- An **induction engine** that does interlinear analysis on the seed corpus, induces morphology from minimal pairs, and writes a lesson by recombining only attested vocabulary, driven through **forced structured output** and validated at runtime with **Zod**.
- **The guardrail, in code, not in the prompt** (`src/lib/engine/guardrail.ts`): every generated sentence *and* flashcard is tokenized and checked against the attested vocabulary. One unattested word and the item is discarded. That is what gives a probabilistic model a hard correctness property.
- A course on the **SM-2** spaced-repetition algorithm with in-browser **Web Speech** text-to-speech.
- **Live induction** on a frontier model with a verified hand-checked fallback so the demo never breaks, and the contribution flywheel persisted in **MongoDB Atlas**.

## Challenges we ran into

- **Resisting the obvious build.** Letting the model free-generate would have demoed beautifully and produced confident nonsense. We chose to make it reason only over real, cited words and enforce that in code — the harder path, and the entire point.
- **Closing the guardrail's own gaps.** A flashcard or an invented vocabulary word can smuggle a hallucination to a learner just as easily as a practice sentence. So the guardrail filters flashcard answers too, verifies every vocabulary form against its *own* citation, and trusts only verified forms — so an invented word can never launder itself into a lesson.
- **Honesty under scarcity.** With a tiny corpus the engine finds vocabulary but little grammar, and we report that truthfully rather than fabricate patterns.
- **Respecting the data.** Endangered-language data carries real ownership and governance concerns, so we cite every source and treat the community, not the model, as the owner of the corpus.

## Accomplishments that we're proud of

This is not a concept video — it is a working web app, and we measured its behavior:

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

A probabilistic model given a **hard, code-level correctness property**, reproducible live at `GET /api/metrics` — the same numbers a judge can pull right now. It is real and live: the AI runs on the deployed site.

## What we learned

That the honest version of an AI tool is often the more powerful one. By refusing to invent, Lantern became something a community *and* a linguist could both trust — and for endangered-language data and the people it belongs to, trust is the whole game.

## What's next for Lantern

Speaker-recorded audio, fluent-speaker review, printable primers for offline communities, and formal data-sovereignty controls so each community owns and governs its own words. The endpoint is a living, community-governed **digital ark** with an entry for every endangered language, each revivable the moment one elder seeds it.

---

*Built during the hackathon; we used AI as a coding and drafting accelerant, while the central insight (amplify, never originate) and the direction are ours. Seed data cited from the Te Aka Māori Dictionary, DAILP and the Cherokee Nation Language Department, Omniglot, and the UNESCO Atlas; some UI primitives adapted from Magic UI / 21st.dev.*

---

## Gallery — upload in THIS order, paste each caption (theme-neutral, identical for all 4)

| # | File | Caption |
|---|------|---------|
| 1 (thumbnail) | `00-thumbnail.png` | Lantern: a living course for any language, from the few words a community still remembers. |
| 2 | `08-diagram-pipeline.png` | How Lantern works: the AI amplifies a community, and a code-level guardrail discards any unattested word. |
| 3 | `01-home-hero.png` | Lantern: Duolingo for languages that are dying. |
| 4 | `09-diagram-architecture.png` | One TypeScript codebase: client, API, the induction engine and guardrail, swappable providers and data. |
| 5 | `02-workspace-grammar.png` | The workspace: grammar and a cited vocabulary bank, induced from real phrases. |
| 6 | `10-diagram-metrics.png` | Reproducible proof at GET /api/metrics: 0 hallucinated words, 48/48 cited, 7/7 practice sentences pass attestation. |
| 7 | `03-demo.gif` | Live: Lantern learning Māori from 41 remembered phrases. |
| 8 | `04-contribute-flywheel.png` | Contribute one phrase and the whole course re-derives, richer, in seconds. |
| 9 | `05-learn-flashcards.png` | Learn: flashcards with pronunciation on a spaced-repetition schedule. |
| 10 | `06-ark-eight-languages.png` | The Ark: eight endangered languages, each revivable the moment one elder seeds it. |

Images live in `docs/submissions/futurehacks-media/`. Same set, same order, same captions on every entry.
