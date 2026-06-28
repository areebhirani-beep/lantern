# The Guardrail: Lantern never teaches a word a real speaker did not say

This is the document that explains the one thing Lantern is willing to stake its whole
name on.

## 1. The promise

Lantern teaches endangered languages from tiny corpora, and the only honest way to do
that is to refuse to make anything up. When a language has roughly ten remaining native
speakers (Ainu, per `src/lib/languages.ts`), no model anywhere can truthfully claim to
"know" it. A model can only reason over the handful of phrases real speakers actually
contributed. So Lantern's identity is not "an AI that knows your language", it is "an AI
that will only ever repeat back to you what your community already attested". Every
vocabulary item, every flashcard answer, and every practice sentence a learner sees is
traceable to a real corpus phrase. A word that no speaker said never reaches a learner.
That refusal is the product.

## 2. The exact invariant

A generated string survives to a learner only if it is **fully attested**: it tokenizes
to a non-empty list, and every token is in the attested set. The attested set is the
corpus tokens PLUS only the vocab forms that independently passed verification (every
token of the form appears in one of that form's OWN cited evidence phrases).

```
attested(corpus, vocab) = { tokens of every corpus phrase.target }
                        ∪ { tokens of vocab form V | isVocabVerified(V) }

survives(string) ⇔ isFullyAttested(string, attested)
              ⇔ tokenize(string).length > 0
                ∧ ∀ t ∈ tokenize(string): t ∈ attested
```

The whole guarantee lives in two functions, quoted verbatim from
`src/lib/engine/guardrail.ts`.

`isVocabVerified` (`src/lib/engine/guardrail.ts:41-54`): a form is verified only if every
one of its tokens appears in one of its own cited phrases.

```ts
export function isVocabVerified(
  form: string,
  evidence: string[],
  phraseById: Map<string, Phrase>,
): boolean {
  const formToks = tokenize(form);
  if (formToks.length === 0) return false;
  const cited = new Set<string>();
  for (const id of evidence) {
    const ph = phraseById.get(id);
    if (ph) for (const t of tokenize(ph.target)) cited.add(t);
  }
  return formToks.every((t) => cited.has(t));
}
```

`isFullyAttested` (`src/lib/engine/guardrail.ts:57-60`): a generated string survives only
if every word in it is in the attested set.

```ts
export function isFullyAttested(target: string, attested: Set<string>): boolean {
  const toks = tokenize(target);
  return toks.length > 0 && toks.every((t) => attested.has(t));
}
```

Both stand on one canonical `tokenize` (`src/lib/engine/guardrail.ts:22-27`), which
case-folds via `normalizeToken` (`src/lib/engine/guardrail.ts:12-16`) so a
sentence-initial "Kia" matches the vocab form "kia", and drops the discontinuous-morpheme
gap markers in `GAP_TOKENS` (`src/lib/engine/guardrail.ts:20`) so Māori notation like
"e … ana" is not mistaken for words. The file is dependency-free: it calls no model and
no database.

| Function | Location | Rule |
|---|---|---|
| `normalizeToken` | guardrail.ts:12-16 | strip punctuation, trim, `toLowerCase` |
| `GAP_TOKENS` | guardrail.ts:20 | `…`, `...`, `—`, `-` ignored as notation |
| `tokenize` | guardrail.ts:22-27 | split on whitespace, normalize, drop empty + gap |
| `buildCorpusTokens` | guardrail.ts:30-34 | Set of every corpus `target` token (ground truth) |
| `isVocabVerified` | guardrail.ts:41-54 | form verified iff every token is in its own citations |
| `isFullyAttested` | guardrail.ts:57-60 | string survives iff non-empty and every token attested |

## 3. Why citation coverage must be 100%

The attested set is the only basis a generated string is checked against, and an uncited
or unverified vocab form never enters that basis. In `assemble()`
(`src/lib/engine/index.ts:116-119`) the basis is built corpus-first, and only verified
forms are added:

```ts
const attested = buildCorpusTokens(phrases);
for (const v of vocab) {
  if (v.verified) for (const t of tokenize(v.form)) attested.add(t);
}
```

So an unverified form cannot launder a hallucination into a lesson. If the model invents a
word and then writes a sentence using it, the invented word is not in the attested set, so
the sentence fails `isFullyAttested` and is dropped. The consequence is structural: every
word that reaches a learner is necessarily backed by a corpus phrase.

The live metric confirms there is nothing slipping through. `GET /api/metrics` reports:

```
vocabCitationCoverage : "48/48"
```

That is 48 of 48 induced vocab forms carrying at least one evidence citation, with no
uncited forms. Reproduce it:

```
curl -s https://lantern-cyan.vercel.app/api/metrics | jq '.summary.vocabCitationCoverage'
# => "48/48"
```

Per language it is 34/34 (Māori) and 14/14 (Cherokee), summing to 48/48. The coverage
count itself comes from `src/app/api/metrics/route.ts:47` (`v.evidence.length > 0`) and is
formatted at `route.ts:66` and `route.ts:80`.

## 4. The attestation gate on flashcards

It is not only practice sentences that pass through the gate. In `assemble()` BOTH
practice sentences AND flashcard answers are filtered by `isFullyAttested`. A flashcard
whose answer contains an unattested word is dropped and never shown.

Practice sentences (`src/lib/engine/index.ts:121-128`):

```ts
const practice: PracticeSentence[] = parsed.lesson.practice
  .filter((s) => isFullyAttested(s.target, attested))
  .map((s) => ({ ... }));
```

Flashcard answers (`src/lib/engine/index.ts:132-141`):

```ts
const cards: Flashcard[] = parsed.lesson.cards
  .filter((c) => isFullyAttested(c.answer, attested))
  .map((c, i) => ({ ... }));
```

This is a stated, load-bearing invariant in `CLAUDE.md`: "Attestation gates flashcard
answers, never surface an unverified answer."

```
                model output (zod-validated, OutputZ)
                          |
            vocab[] ---> isVocabVerified ---> attested set (corpus + verified forms)
                          |                         |
              cards[] ----+----> isFullyAttested(answer) --> drop if any token unattested
              practice[] -+----> isFullyAttested(target) --> drop if any token unattested
                          |
                   only attested cards + practice reach the learner
```

## 5. Worked example: rejecting "taniwha"

"taniwha" is a real Māori word (a water guardian), and the guardrail still refuses it,
because the toy corpus it is checked against does not attest it. The self-check encodes
exactly this attack at `src/lib/engine/guardrail.check.ts:49-61`.

The corpus for the check (`guardrail.check.ts:26-29`) is just two phrases:

```
mi-001  "Kia ora"
mi-017  "Kei te haere ana au"
```

Neither contains "taniwha". So:

```ts
const unverified = "taniwha";
assert.equal(
  isVocabVerified(unverified, ["mi-001"], byId),
  false,
  "invented vocab stays unverified",
);
assert.equal(
  isFullyAttested(`kia ${unverified}`, attested),
  false,
  "sentence laundering an invented word must be rejected",
);
```

Step by step, with the attested set being the corpus tokens plus `"ana"` (added at
`guardrail.check.ts:43-44` to stand in for one verified vocab form):

```
attested = { kia, ora, kei, te, haere, ana, au }   (corpus tokens + "ana")

1. isVocabVerified("taniwha", ["mi-001"], byId)
     tokenize("taniwha")        = ["taniwha"]
     cited tokens of mi-001     = { kia, ora }
     "taniwha" ∈ cited?         = NO
   => false                     ("taniwha" never joins the attested set)

2. isFullyAttested("kia taniwha", attested)
     candidate    : "kia taniwha"
     tokenize     : ["kia", "taniwha"]
     check "kia"     vs attested -> present
     check "taniwha" vs attested -> ABSENT
   => false   ===> REJECT  (sentence discarded, never shown)
```

The point is sharp: even a genuine word is refused until the corpus attests it. The
guardrail does not ask "is this a real word in the language?" It asks "did this
community's corpus actually show me this word?" Only the second question is answerable
honestly from ten phrases.

## 6. How the self-check enforces 0 hallucinations

The guarantee is defended in two independent places, and both must hold before anything
ships.

**The self-check.** `src/lib/engine/guardrail.check.ts` is a dependency-free
`node:assert/strict` self-check (no test framework). It pins `tokenize`,
`isVocabVerified`, and `isFullyAttested` against fixed inputs including the "taniwha"
laundering attack, and on success prints one line (`guardrail.check.ts:63`).

```
npx tsx src/lib/engine/guardrail.check.ts
# => guardrail.check: all assertions passed
```

**The independent recomputation.** `GET /api/metrics` does not trust a self-report. It
re-derives the attested set over the shipped reference induction using the engine's own
`tokenize` (imported at `src/app/api/metrics/route.ts:4`), then checks every fixture
practice sentence with the same logic as `isFullyAttested`
(`src/app/api/metrics/route.ts:36-45`):

```ts
for (const s of fx.lesson.practice) {
  practiceChecked++;
  const toks = tokenize(s.target);
  const fullyAttested = toks.length > 0 && toks.every((t) => attested.has(t));
  if (!fullyAttested) {
    violations++;
    hallucinationsPassed++;
  }
}
```

The result is reported at `route.ts:79`:

```
curl -s https://lantern-cyan.vercel.app/api/metrics \
  | jq '.summary | {hallucinatedWordsThatReachedALearner, practiceSentencesChecked}'
# => { "hallucinatedWordsThatReachedALearner": 0, "practiceSentencesChecked": 7 }
```

7 of 7 practice sentences attested, 0 hallucinated words reaching a learner. The two
defenses share one `tokenize` deliberately: `CLAUDE.md` requires `tokenize`/
`normalizeToken` to stay canonical and case-folded with no stale copy in the metrics
route.

`CLAUDE.md` makes this non-negotiable: any change under `src/lib/engine/` must keep
`guardrail.check.ts` passing, with 0 hallucinations and 100% vocab citation coverage in
fixture metrics.

| Defense | Command / endpoint | Expected result |
|---|---|---|
| Unit self-check | `npx tsx src/lib/engine/guardrail.check.ts` | `guardrail.check: all assertions passed` |
| Live recomputation | `GET /api/metrics` | `hallucinatedWordsThatReachedALearner: 0` |
| Citation coverage | `GET /api/metrics` | `vocabCitationCoverage: "48/48"` |
| Attestation proof | `GET /api/metrics` | 7 checked, `practiceFailingAttestation: 0` (7/7) |

## 7. Limits and honesty

The guardrail guarantees attestation, not full linguistic correctness. It proves that
every word shown came from a real corpus phrase; it does not prove the grammar of a
recombined practice sentence is idiomatic, that a gloss is perfectly nuanced, or that a
generated sentence is culturally appropriate. Those judgments belong to fluent speakers.

- **Roadmap:** fluent-speaker review of generated lessons, surfaced as a verification
  layer on top of attestation, so a human signs off before a recombined sentence is
  promoted.

The honest claim Lantern makes today is narrow and provable: no invented word reaches a
learner. That is the floor the guardrail holds, and it holds it on every lesson.

---

**Verified by:** `npx tsx src/lib/engine/guardrail.check.ts` · `GET https://lantern-cyan.vercel.app/api/metrics`
