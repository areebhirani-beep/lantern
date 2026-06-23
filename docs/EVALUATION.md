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

## Honest limitations

- These counts are from the **verified reference induction** bundled with the app, hand-checked against cited sources. With a live LLM key, the same code-level guardrail enforces the identical zero-hallucination property on freshly generated lessons, but exact counts will vary by run.
- The corpora are deliberately small (that is the point), so the grammar discovered is partial. With more phrases, more structure appears. Cherokee, with 15 isolated words, yields fewer patterns than Māori with 41, exactly the behavior an honest system should show.
- This is a behavioral evaluation of the guardrail and the output volume. It is not a full linguistic accuracy study; that would require fluent-speaker review, which is the right next step and part of the roadmap.

## Reproduce it

```bash
npm run dev
curl http://localhost:3000/api/metrics
```
