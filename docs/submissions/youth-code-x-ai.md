# Lantern, Youth Code x AI submission

**Track:** AI That Actually Helps People
**Tagline:** Duolingo for languages that are dying. Lantern turns the few words an elder still remembers into a real course to learn their language, and it never invents a word.

## What it does (in one breath)

Pick a language so endangered that no app, no textbook, and no online course exists for it. Lantern takes a handful of remembered phrases, works out the grammar hidden inside them, and builds a real learning course: flashcards, pronunciation you can hear, and spaced repetition. Then it grows: every phrase someone adds rebuilds the course, richer. The one rule it never breaks is that it only teaches words real speakers actually said.

Try it live and watch it learn Māori from 41 phrases, see the grammar it found, and take the course it built.

## Inspiration

A language goes silent somewhere on Earth about every two weeks. Usually not because no one cares, but because writing a language down and teaching it has always taken trained experts years, and most languages will never get that time. We wanted to put that power in the hands of the people who still hold the words: a grandparent, an elder, anyone who remembers.

## How we built it

- **Next.js 16 + TypeScript** web app, works on a phone or a laptop.
- An **AI induction engine** that reads only the phrases it is given, aligns words to meanings, and discovers grammar from minimal pairs (for example, how Māori marks past, present, and future with a small word before the verb).
- A **flashcard course** with the SM-2 spaced-repetition algorithm and in-browser text-to-speech.
- A **no-hallucination guardrail**: every generated sentence is checked, in code, against the real vocabulary. If one word is not attested, the sentence is deleted before any learner sees it.

## Accomplishments we are proud of

- It is genuinely clear what it does. A stranger understands it in one sentence.
- It is honest. We measured it: from 56 cited phrases it produced 48 words and 7 grammar patterns, with **zero hallucinated words** ever reaching a learner and **every vocabulary item cited** (see `docs/EVALUATION.md`).
- The interface is warm and easy. You always know what a word means and where to go.

## Challenges we ran into

The hardest part was resisting the obvious approach. An AI cannot actually know a language with fifty speakers, so the tempting move, letting it generate fluent-sounding output, would have produced confident nonsense and disrespected the people who carry the language. Building the engine to reason only over real, cited words, and enforcing that in code, was the whole challenge and the whole point.

## What we learned

That the honest version of an AI tool is often the more powerful one. By refusing to invent, Lantern became something a community and a linguist could both trust.

## What is next

Speaker-recorded audio, fluent-speaker review, export to printable primers for communities offline, and data-sovereignty controls so each community owns and governs its own words.

## Built with

next.js, typescript, react, tailwindcss, framer-motion, mongodb, web-speech-api, ai, spaced-repetition
