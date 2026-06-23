<div align="center">

<br/>

# 🏮 &nbsp;Lantern

### Carry the light of a language forward.

**Duolingo for languages that are dying.**
Lantern turns the few words an elder still remembers into a real course to learn their language, with AI that learns the grammar from those words and **never invents one.**

<br/>

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-ffb454?style=for-the-badge)](LICENSE)

<br/>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fareebhirani-beep%2Flantern&env=GEMINI_API_KEY,MONGODB_URI&envDescription=Optional.%20A%20free%20Gemini%20key%20turns%20on%20live%20induction.)

<br/>

![Lantern](docs/screenshots/home.png)

</div>

---

<div align="center">

### 👇 &nbsp;Watch it learn a language, live

![Lantern demo](docs/demo.gif)

*From 41 remembered phrases, Lantern works out the grammar and builds a course. Nothing is invented.*

</div>

---

## What it does, in one breath

Pick a language so endangered that no app, no textbook, and no online course exists for it. Lantern takes a handful of remembered phrases, works out the grammar hidden inside them, and builds a real learning course: flashcards, pronunciation you can hear, and spaced repetition. Then it grows. Every phrase someone adds rebuilds the course, richer. The one rule it never breaks is that it only teaches words real speakers actually said.

> A language goes silent somewhere on Earth about every two weeks. The reason is rarely that no one cares. It is that documenting a language and building lessons for it has always taken trained experts years, and most languages will never get that time. Lantern collapses that cost so a community can do it themselves.

## Proof, not promises

Every number below is computed live by the app at [`/api/metrics`](src/app/api/metrics/route.ts), so it is reproducible rather than asserted ([full method](docs/EVALUATION.md)):

<div align="center">

| Phrases in | Words out | Grammar patterns | Flashcards | Hallucinated words | Vocabulary cited |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **56** | **48** | **7** | **22** | **0** | **48 / 48** |

</div>

**Zero hallucinated words ever reach a learner, and every vocabulary item is cited.** That property is not a prompt instruction, it is enforced in code (`src/lib/engine/index.ts`).

## How it works

```
   Seed              Induce                Learn               Grow
 ┌────────┐      ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 │ a few  │ ───> │ align words, │ ──> │ flashcards,  │ ──> │ every learner│
 │ cited  │      │ find grammar,│     │ pronunciation│     │ adds a phrase│
 │ phrases│      │ build vocab  │     │ spaced rep.  │     │   ┐          │
 └────────┘      └──────────────┘     └──────────────┘     └───┼──────────┘
                        ▲                                      │
                        └──────────────────────────────────────┘
                     the corpus compounds: a self-growing digital ark
```

1. **Seed.** A speaker contributes a few phrases with meanings. Even 20 is enough.
2. **Induce.** The model aligns words to meanings, induces grammar from minimal pairs (for example, how Māori marks past, present, and future), and builds a cited vocabulary bank.
3. **Learn.** A beginner course materializes: flashcards on an SM-2 spaced-repetition schedule, with text-to-speech.
4. **Grow.** Every contribution rebuilds the course, richer. The language's record compounds instead of fading.

### The rule that makes it trustworthy

> **It never makes up a word.**

An AI cannot truly know a language with fifty speakers left, because there is almost nothing to learn it from. So Lantern reasons only over the phrases it is given, cites its evidence for every word, and runs a code-level guardrail: every generated sentence is tokenized and checked against the attested vocabulary, and any sentence with an unattested word is discarded before a learner sees it.

## A look around

| The workspace, the grammar it found | Learn, with audio + spaced repetition |
|---|---|
| ![Workspace](docs/screenshots/workspace.png) | ![Learn](docs/screenshots/learn.png) |

| Contribute, and the course rebuilds | The Living Ark of endangered languages |
|---|---|
| ![Contribute](docs/screenshots/contribute.png) | ![Ark](docs/screenshots/ark.png) |

## Architecture

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router, RSC) | One codebase, server + client |
| Language | **TypeScript** end to end | A typed domain model is the contract |
| Reasoning | **Frontier LLM** (Gemini free tier or Claude), forced structured output + zod | Deep, citable induction |
| Persistence | **MongoDB Atlas** (optional) + in-memory fallback | The living corpus and flywheel |
| Styling | **Tailwind v4**, Framer Motion | The Lantern design system |
| Pronunciation | **Web Speech API** | Free, in-browser, no key |

```
src/lib/
  types.ts            the domain model, the contract between engine, store, UI
  languages.ts        the Ark registry (8 languages, 2 fully inducible)
  seed/               verified, CITED seed corpora (Māori, Cherokee)
  engine/
    prompts.ts        field-linguist system prompt + structured-output schema
    index.ts          runInduction(): call the model, validate, enforce the guardrail
    fixtures.ts       verified cached induction (offline + demo safety net)
  llm.ts              provider-agnostic: Gemini, Claude, or fixtures
  store.ts            Store interface: in-memory or MongoDB Atlas
  srs.ts              SM-2 spaced repetition
src/app/api/          induce, contribute, languages, stats, metrics
src/app/              /  ·  /ark  ·  /lang/[id]
```

**Runs with zero configuration.** No key, no database, it serves verified, hand-checked induction so the demo never breaks. Add a key and the engine runs live; add a database and the corpus persists.

## Quickstart

```bash
git clone https://github.com/areebhirani-beep/lantern
cd lantern
npm install
npm run dev          # http://localhost:3000, works immediately
```

To turn on **live** induction and a persistent corpus, copy `.env.example` to `.env.local`:

```bash
GEMINI_API_KEY=...                # free at aistudio.google.com/apikey
# or ANTHROPIC_API_KEY=sk-ant-... # Claude, if you have credits
MONGODB_URI=mongodb+srv://...     # optional: persists the living corpus
```

## Deploy

One click with the button at the top, or import this repo into [Vercel](https://vercel.com/new). It is a standard Next.js app, no extra configuration needed. Set `GEMINI_API_KEY` in the Vercel dashboard to enable live induction.

## The languages aboard

Māori and Cherokee ship with verified, cited corpora and are fully inducible. The rest populate the Ark, including **Ainu** (about ten speakers) and the brought-back-from-dormant **Manx** and **Cornish**, proof that revival is possible.

🟢 Māori · 🟠 Cherokee · Hawaiian · Ainu · Manx · Cornish · Navajo · Yiddish

## More

- 📄 **[The Moonshot Paper](docs/MOONSHOT_PAPER.md)** : the full blueprint, philosophy, architecture, and long-term vision.
- 📊 **[Evaluation](docs/EVALUATION.md)** : reproducible metrics and the no-hallucination check.
- 🎬 **The film** : a 90-second story, built in Remotion (see `video/`).

## Honesty and provenance

Seed phrases are cited from public, reputable sources (Te Aka Māori Dictionary, university te reo resources, DAILP and Cherokee Nation, Omniglot). Macrons and syllabary are verified. Pronunciation is presented honestly as an approximate guide. Endangered-language data carries real ownership concerns: communities own and govern their corpus, and Lantern is a tool they wield on their own data, not an extraction pipeline.

## License

[MIT](LICENSE).

<div align="center">

<br/>

*A language only dies when the last person stops speaking it. Lantern makes the next speaker easier to find.*

</div>
