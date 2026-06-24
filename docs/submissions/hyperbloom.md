# Lantern, Hyperbloom Summer submission

**Theme:** Social good, mapped to **UN Sustainable Development Goal 4 (Quality Education)**, with **SDG 10 (Reduced Inequalities)** and the preservation of cultural heritage.
**Tagline:** Half the world's languages will fall silent this century. Lantern is a tool that lets any community turn the words they still remember into a living course to learn their language, with AI that never invents a word.

## How it maps to the theme (SDG 4)

SDG 4 is universal, inclusive, quality education. For roughly 3,000 endangered languages there is no course, no textbook, no app, so for those communities quality education *in their own language* does not exist to be accessed. Lantern manufactures that missing education on demand: it turns a handful of remembered phrases into a real beginner course, in minutes, for a language that had no learning materials an hour before. It also speaks to SDG 10, the people losing their languages are overwhelmingly Indigenous and marginalized communities, and to the safeguarding of intangible cultural heritage.

> Note for judging: everything below is demonstrated on screen in the 2-minute film, the working app, the live induction, and the measured results, so the video stands on its own without opening the repo.

## The problem (and why it is a social-good problem)

Of roughly 7,000 languages alive today, nearly half are endangered, and one disappears about every two weeks. When the last speaker goes, an entire way of seeing the world goes unwritten. The usual framing treats this as inevitable. We treat it as a tooling problem: the cost of documenting a language and building pedagogy for it has always been measured in linguist-years, and that cost is the real bottleneck on revival. Lower that cost by a hundred times and the math of language survival changes for the long tail of languages no expert will reach in time.

## What it does

Lantern takes a small set of phrases a community remembers, induces the grammar inside them, and generates a complete beginner course: a cited vocabulary bank, the grammatical patterns it discovered, flashcards, pronunciation, and spaced repetition. Every learner contribution rebuilds the course, so the language's record compounds with use instead of fading. It is, in effect, computational language documentation that a community can run itself.

## Why it is feasible (we measured it)

This is not a concept video. It is a working web app, and we evaluated its behavior. From 56 cited phrases across Māori and Cherokee, the engine produced 48 vocabulary items, 7 grammar patterns, and 22 flashcards. Critically, an independent attestation check found **zero hallucinated words** reaching a learner and **100% (48/48) of vocabulary backed by a citation**. The full method and reproducible numbers are in `docs/EVALUATION.md` and at the live `GET /api/metrics` endpoint.

## Innovation

The novel move is amplification under an honesty constraint. A model cannot truly know a language with fifty speakers, so instead of generating a language from nothing, Lantern reasons only over the community's own words and enforces, in code, that it never teaches a word that was not attested. The same constraint that keeps it honest is what makes it general: it works for any language, because it relies on the community's data, not the model's memory.

## Impact

Lantern gives the 3,000 languages currently triaged out of expert attention a path that does not depend on a linguist arriving in time. A language with ten speakers and a phone can begin teaching itself the same day. We ship it pre-loaded with eight endangered languages, including Ainu (about ten speakers) and the brought-back-from-dormant Manx and Cornish.

## Ethics and respect

Endangered-language data carries real ownership and governance concerns. Our stance is that communities own and govern their corpus; Lantern is a tool they wield on their own data, not an extraction pipeline. Seed data is cited from public, reputable sources, and pronunciation is presented honestly as an approximate guide. Fluent-speaker review and formal data-sovereignty controls are the first items on the roadmap.

## Built with

next.js, typescript, react, tailwindcss, framer-motion, mongodb, web-speech-api, ai, spaced-repetition

See also the full blueprint in `docs/MOONSHOT_PAPER.md`.
