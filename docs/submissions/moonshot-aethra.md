# Lantern, Moonshot Aethra submission

**Tagline:** A self-growing digital ark for endangered languages. Lantern amplifies the words a community still remembers into a living course to learn their language, under one unbreakable rule: it never invents a word.

**Required deliverables, where to find them**
- **Prototype:** the working web app (live demo link plus the repository).
- **Moonshot Paper (the blueprint):** `docs/MOONSHOT_PAPER.md`.
- **Vision presentation:** the film at `lantern-video/out/lantern-promo.mp4`.
- **Evidence:** reproducible metrics in `docs/EVALUATION.md` and at `GET /api/metrics`.

## The zero-to-one insight

Most "AI for X" projects ask a model to be an expert. Lantern asks the opposite. A language with fifty speakers has almost no presence in any training corpus, so asking a model to "teach" it produces confident hallucination, which for a critically endangered language is worse than useless. Our first-principles move is to invert the role: the model is not the source of knowledge, it is an amplifier of the community's knowledge. It reasons only over the phrases it is given, cites its evidence for every claim, and is forbidden, in code, from teaching a word that was not attested. The same constraint that makes it honest is what makes it general. It works for any language because it depends on the community's data, not the model's memory.

The reframed thesis: language death is largely a tooling problem. Documenting a language and building pedagogy for it has always cost linguist-years, and that cost is the rate-limiter on revival. Collapse that cost by two orders of magnitude and the triage math that dooms the long tail of languages inverts.

## Technical and scientific depth

The engine performs interlinear analysis on the seed corpus (aligning words to meanings), induces morphology from minimal pairs, and generates lessons by controlled recombination of attested vocabulary only. Output is produced through forced structured tool-use and validated with a runtime schema. The safety property is then enforced as a hard, code-level guardrail: every generated sentence is tokenized and checked against the attested vocabulary, and any sentence with an unattested word is discarded before a learner sees it. We evaluated this: from 56 cited phrases, 48 words and 7 patterns were produced, with zero hallucinations passing the guardrail and 48 of 48 vocabulary items cited. A probabilistic model is thereby given a hard correctness property.

## Long-term vision and impact

The endpoint is a living, community-governed digital ark with an entry for every endangered language, each one revivable the moment a single elder seeds it. At scale this changes the economics of language survival. The deeper stake is civilizational: each language is a distinct, irreplaceable hypothesis about what a mind can be. Lantern is a bet that the cheapest, most scalable way to keep those hypotheses alive is to amplify the people who still hold them, honestly, at the speed of software.

## Feasibility and execution

It is a working web app today (Next.js 16, TypeScript), running with zero configuration via verified reference induction and upgrading to live frontier-model induction with a key. Persistence and the contribution flywheel are backed by a **MongoDB Atlas** integration, with an in-memory fallback. The significant original contribution here, the honest amplification engine, its guardrail, and the full product around it, was built during the hackathon.

## Built with

next.js, typescript, react, tailwindcss, framer-motion, mongodb-atlas, web-speech-api, ai, spaced-repetition
