# Lantern — A Blueprint for AI-Amplified Language Revival

*The philosophy, reasoning, and architecture behind a self-growing digital ark for endangered languages.*

---

## Abstract

Half of the world's ~7,000 languages are expected to fall silent this century — roughly one every two weeks. The dominant framing treats this as a sociopolitical inevitability. We argue it is, in large part, a **tooling** problem: the cost of *documenting* a language and *building pedagogy* for it has always been measured in linguist-years, and that cost is the rate-limiter on revival. Lantern proposes that modern language models can collapse this cost by roughly two orders of magnitude — **but only under a strict honesty constraint** that turns the AI from an untrustworthy oracle into a trustworthy *amplifier*. The core contribution is a loop — seed → induce → generate → learn → grow — in which AI never originates linguistic knowledge, only restructures and multiplies the knowledge a community already holds, with every claim cited and every generated form checked, in code, against attested evidence.

## 1. The problem: documentation is the bottleneck

A language does not die for lack of a dictionary. But revival — the actual project of getting a new generation to speak — depends on materials: glossaries, grammars, graded lessons, audio. Producing these is slow, specialist work. A field linguist may spend years documenting a single language, and there are far more endangered languages than there are linguists or years. The result is triage: a few languages get attention; most do not, and time runs out.

This is the leverage point. If the marginal cost of turning *what a community remembers* into *teachable material* drops from years to minutes, the triage math inverts. Revival becomes possible for the long tail.

## 2. The original insight: amplification under an honesty constraint

The naive application of AI here fails, and fails dangerously. A language with fifty speakers has essentially zero presence in any training corpus. Ask a model to "teach" it and the model will **confabulate** — producing plausible, fluent, wrong material. For a critically endangered language this is worse than useless: it pollutes the record and disrespects the people who carry it. A linguist will catch it immediately; a learner will not.

Our insight is that the honesty constraint is not a limitation to work around — **it is the design that makes the system work.** Lantern reframes the model's job from *knowing the language* (impossible) to *reasoning over the community's own data* (tractable, and exactly what field linguists do). Concretely:

- The model receives a small **seed corpus**: phrases with meanings, contributed by speakers or drawn from cited sources.
- It performs **interlinear analysis on that corpus only** — aligning words to meanings, hypothesizing morphology from minimal pairs — and must **cite the phrases that attest each claim.**
- It may **recombine** attested vocabulary according to patterns it actually found, but it may **never introduce a word from outside the corpus.**

The zero-to-one is this inversion: not "an AI that speaks dying languages," but **a community-in-the-loop amplifier that makes a tiny amount of human knowledge teach at scale, without ever fabricating.** The same mechanism that keeps it honest is the mechanism that makes it general — it works for *any* language, because it relies on the community's data, not the model's memory.

## 3. Architecture

The system is a single loop with four stages and one invariant.

```
 Seed ──▶ Induce ──▶ Generate ──▶ Learn ──▶ (contribute) ──▶ Seed′ ──▶ …
                    │                                          ▲
                    └────────── corpus compounds ──────────────┘
```

**Seed.** A typed corpus of `Phrase` records (target, gloss, meaning, source, confidence). Ground truth.

**Induce.** A `report_induction` tool call to Claude Opus, constrained by a field-linguist system prompt and a JSON schema. It returns a **vocabulary bank** (each item carrying `evidence` = the phrase ids that attest it) and **grammar patterns** (each carrying corpus examples and a confidence). The output is validated with a runtime schema (zod) before use.

**Generate.** From the *induced* vocabulary and patterns, the model builds a beginner lesson: flashcards plus practice sentences. Each practice sentence declares the vocabulary it uses.

**The invariant — enforced in code, not prose.** Before any generated sentence reaches a learner, it is tokenized and every token is checked against the set of attested tokens (corpus + induced vocab). **A sentence containing even one unattested word is discarded.** This is `isFullyAttested()` in `engine/index.ts`. The guardrail is the heart of the design: it converts a probabilistic model into a system with a hard correctness property.

**Learn.** The lesson is delivered through an SM-2 spaced-repetition loop with Web Speech pronunciation — a real course for a language that had no materials an hour before.

**Grow (the flywheel).** Every learner contribution appends to the corpus and *invalidates the cached induction*. The next visit re-derives richer vocabulary, firmer patterns, more practice. The language's digital record **compounds with use.** A store abstraction (in-memory by default, MongoDB Atlas for persistence) makes the corpus durable.

## 4. Why now

Three things converged. (1) Frontier models can finally do reliable **structured interlinear reasoning** — alignment, morphology induction, controlled generation — when constrained to provided data. (2) Forced tool-use makes their output **machine-checkable**, which is what lets us bolt a hard guardrail onto a soft model. (3) The web platform makes the **learner the contributor**: the same person studying the language can grow its corpus, closing the loop at near-zero marginal cost.

## 5. Evidence

Lantern ships two verified, cited corpora. From 41 Māori phrases, the engine recovers a full tense-aspect system carried entirely by pre-verbal particles (`i` past, `kei te` present, `e…ana` continuous, `ka` future, `kua` perfect, all on the verb *haere*), number marked on the article (`te`/`ngā`) rather than the noun, possessive number by t-dropping (`tāku`/`āku`), and macron-lengthening vs. suppletive plurals (`matua`/`mātua`, `tamaiti`/`tamariki`) — then generates new, fully-attested practice like *Ka noho au* ("I will stay"). From 15 Cherokee items it recovers a vocabulary and *honestly reports* that 15 isolated words yield little productive grammar — a lead, not a law — which is exactly the behavior the honesty constraint should produce. The contrast between the two is itself the argument: **more data, more structure; never invention.**

## 6. Long-term vision

The endpoint is a **digital ark**: a living, community-governed corpus for every endangered language, each one a candidate for revival the moment a single elder seeds it. At scale this changes the economics of language survival. Documentation stops being a bottleneck. A language with ten speakers and a phone can begin teaching itself the same day. The 3,000 languages currently triaged out of attention get a path that does not depend on a linguist arriving in time.

The deeper stake is civilizational. Each language is a distinct way of carving up reality — kinship systems, evidentiality, spatial frames, cosmology — that exists nowhere else. Losing one is not losing a redundant copy; it is losing an irreplaceable hypothesis about what a mind can be. Lantern is a bet that the cheapest, most scalable way to keep those hypotheses alive is to **amplify the people who still hold them**, honestly, at the speed of software.

## 7. Limitations and ethics

- **Pronunciation.** Web Speech voices rarely exist for these languages; playback is an approximate guide and the UI says so. Speaker-recorded audio is the right long-term answer.
- **Low-resource honesty.** With a tiny corpus the engine finds vocabulary but little grammar. This is correct, not a bug — and the flywheel is the cure.
- **Data sovereignty.** Indigenous language data carries real ownership and governance concerns. Lantern's stance is that **communities own and govern their corpus**; the engine is a tool they wield on their own data, not an extraction pipeline. Formal sovereignty controls are the first item on the roadmap.
- **Not a replacement.** Lantern does not replace speakers, elders, or immersion. It lowers the cost of the materials around them.

## 8. Why this is a moonshot

Most "AI for X" projects ask a model to *be* an expert. Lantern asks the opposite: it constrains the model into an honest amplifier and puts the human community at the center of the loop. The bet is that this inversion — *multiply, don't originate* — is the unlock for an entire class of problems where the knowledge exists but the labor to scale it does not. If it works for the 3,000 languages racing the clock, it changes who gets to keep their voice.

A language only dies when the last person stops speaking it. Lantern is an attempt to make the next speaker easier to find.

---

### References (seed-corpus provenance)

- Te Aka Māori Dictionary — maoridictionary.co.nz
- University of Auckland & Victoria University of Wellington — te reo Māori learner resources
- kupu.maori.nz — te reo grammar (tense/aspect, articles, possession)
- DAILP (Digital Archive of Indigenous Language Persistence), Northeastern University; Cherokee Nation Language Department; Native History Association — Cherokee
- Omniglot — Māori & Cherokee number/phrase tables
- UNESCO Atlas of the World's Languages in Danger — vitality classifications
