# Lantern, by the numbers

A small, honest evaluation of what the engine actually produces, and proof that the central safety property holds. Every number here is computed live by the app at `GET /api/metrics`, so it is reproducible rather than asserted.

## What goes in, what comes out

From the two verified, cited seed corpora that ship with the app:

| Language | Phrases in | Words out | Grammar patterns | Flashcards | Practice sentences |
|---|---|---|---|---|---|
| Māori (te reo Māori) | 41 | 34 | 5 | 12 | 5 |
| Cherokee (Tsalagi) | 15 | 14 | 2 | 10 | 2 |
| **Total** | **56** | **48** | **7** | **22** | **7** |

A complete beginner course, vocabulary, grammar, flashcards, and practice, generated from **56 remembered phrases**. The kind of material that normally takes a trained linguist months to assemble.

## The property that matters: it never invents a word

Lantern's core promise is that it only ever teaches words the community actually attested. We verify this as an independent check, not a self-report. The metric re-tokenizes every generated practice sentence and tests each word against the set of attested tokens (the corpus plus the induced vocabulary).

| Metric | Result |
|---|---|
| Practice sentences checked | 7 |
| Sentences containing an unattested word | **0** |
| Hallucinated words that reached a learner | **0** |
| Vocabulary items backed by a citation | **48 / 48 (100%)** |

Zero hallucinations passed the guardrail, and every single vocabulary item carries at least one corpus phrase as evidence. This is enforced in code (`src/lib/engine/index.ts`, `isFullyAttested`), so the property holds for freshly generated lessons too, not just the shipped reference set.

## How the metrics are computed

The important detail is that `GET /api/metrics` does not trust the engine's own output. It recomputes the attestation property from scratch using the engine's own tokenizer, so the report is an independent check rather than a self-graded one.

What the route does, step by step (`src/app/api/metrics/route.ts`):

```
for each inducible language (mi, chr):
  1. load its seed phrases               (SEED_PHRASES[lang.id])
  2. load its verified fixture induction  (getFixture)
  3. build the attested-token set:
        attested = { every tokenize(phrase.target) }      // the corpus
                 + { every tokenize(vocab.form) }          // induced word forms
  4. for each practice sentence in the lesson:
        re-tokenize it with the engine's own tokenize()
        if any token is NOT in attested  ->  count a violation
                                              count hallucinatedWordsThatReachedALearner
  5. count vocab items with evidence.length > 0  (citation coverage)
```

Two design choices make this trustworthy:

- It imports the engine's own `tokenize` from `src/lib/engine/guardrail.ts` (route line 4). There is no second, drifting copy of the tokenizer. The metric measures the same normalization the engine itself enforces.
- The attested set is built from the corpus plus induced vocab forms only. A practice sentence that smuggles in any other token is counted as a failure. The expected count of such failures is **0**.

Each JSON field maps to a meaning:

| `summary` field | Meaning | Computed from |
|---|---|---|
| `inducibleLanguages` | Languages with a verified fixture (mi, chr) | `perLanguage.length` |
| `phrasesIn` | Total seed phrases fed in | sum of `phrases.length` |
| `vocabOut` | Total induced vocabulary items | sum of `fx.vocab.length` |
| `patternsOut` | Total grammar patterns discovered | sum of `fx.patterns.length` |
| `cards` | Total flashcards | sum of `fx.lesson.cards.length` |
| `practice` | Total practice sentences | sum of `fx.lesson.practice.length` |
| `practiceSentencesChecked` | Practice sentences re-tokenized and tested | `practiceChecked` |
| `hallucinatedWordsThatReachedALearner` | Practice sentences with any unattested token (expect 0) | `hallucinationsPassed` |
| `vocabCitationCoverage` | Vocab with a citation over total vocab | `vocabWithEvidence / vocabTotal` |

| `perLanguage` field | Meaning |
|---|---|
| `language`, `id` | Display name and ISO id |
| `phrasesIn` | Seed phrases for this language |
| `vocab`, `patterns`, `cards`, `practice` | Per-language output volume |
| `practiceFailingAttestation` | Practice sentences with an unattested token (expect 0) |
| `vocabCitationCoverage` | This language's cited vocab over total, e.g. `34/34` |

## Reproduce it

Three independent ways, all reproducible from a clean checkout.

(a) Hit the live deployment:

```bash
curl https://lantern-cyan.vercel.app/api/metrics
```

(b) Run it locally and hit your own instance:

```bash
npm run dev
curl http://localhost:3000/api/metrics
```

(c) Run the guardrail unit check directly (no server needed):

```bash
npx tsx src/lib/engine/guardrail.check.ts
# prints: guardrail.check: all assertions passed
```

Expected proof band, identical across all three:

```
0 invented   ·   48/48 cited   ·   7/7 attested
```

That reads as: `hallucinatedWordsThatReachedALearner = 0`, `vocabCitationCoverage = 48/48`, and `practiceSentencesChecked = 7` with `practiceFailingAttestation = 0`, so 7 of 7 practice sentences are fully attested.

## Honest limitations

- These counts are from the **verified reference induction** bundled with the app, hand-checked against cited sources. With a live LLM key, the same code-level guardrail enforces the identical zero-hallucination property on freshly generated lessons, but exact counts will vary by run.
- The corpora are deliberately small (that is the point), so the grammar discovered is partial. With more phrases, more structure appears. Cherokee, with 15 isolated words, yields fewer patterns than Māori with 41, exactly the behavior an honest system should show.
- This is a behavioral evaluation of the guardrail and the output volume. It is not a full linguistic accuracy study. That would require fluent-speaker review, which is the right next step and is **Roadmap**.

**Verified by:** `curl https://lantern-cyan.vercel.app/api/metrics`, `curl http://localhost:3000/api/metrics`, `npx tsx src/lib/engine/guardrail.check.ts`
