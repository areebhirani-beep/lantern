# Contributing to Lantern

Welcome, and thank you for helping teach endangered languages from minimal corpora.

Lantern has exactly one rule that governs everything else: **never let the guardrail regress.** The project's whole identity is that it refuses to invent words. It only ever teaches what a real, cited corpus attests. Every contribution, in code or in seed data, has to keep that promise intact. If a change would let an unattested word reach a learner, the change is wrong, no matter how nice the rest of it looks.

## Dev setup

The app is zero-config. With no keys at all it boots and serves the verified reference fixtures.

```bash
git clone https://github.com/areebhirani-beep/lantern
cd lantern
npm install
npm run dev      # http://localhost:3000
```

Optional: copy `.env.example` to `.env.local` to wire an LLM key (Groq is the free default), MongoDB, auth, Firestore, or Vercel Blob. See the keys table in `README.md` for every variable and where to get it. Every one of those keys is optional: an empty `.env.local` still runs the whole app.

## Invariants you must not break

These come straight from `CLAUDE.md`. They are not suggestions.

| Invariant | What it means in practice | Where it lives |
|---|---|---|
| Guardrail never regresses | `guardrail.check.ts` must still pass: 0 hallucinations and 100% vocab citation coverage in fixture metrics | `src/lib/engine/guardrail.check.ts` |
| One canonical tokenizer | Exactly one `tokenize` / `normalizeToken`, case-folded. No stale copy in the metrics route or anywhere else | `src/lib/engine/guardrail.ts` |
| Attestation gates flashcards | An unverified answer is never surfaced. `isFullyAttested` filters `cards` and `practice` | `src/lib/engine/index.ts` (`assemble`) |
| Seed corpora are ground truth | Never add a word you cannot attribute to a real, cited source | `src/lib/seed/` |
| Docs cite only verified claims | No invented stats. Cite live `/api/metrics`, `docs/EVALUATION.md`, or the repo | `docs/`, `README.md` |

The tokenizer rule matters because the metrics route (`src/app/api/metrics/route.ts`) imports the engine's own `tokenize` on purpose, so its check is an independent recomputation, not a self-report. A second, drifting copy would silently break that guarantee.

## Verify before "done"

Run all of these before opening a PR. The first three apply to every change. The integration checks apply when you touch the matching subsystem.

| Check | Command | Covers |
|---|---|---|
| Lint | `npm run lint` | eslint |
| Build | `npm run build` | `next build` |
| Guardrail | `npx tsx src/lib/engine/guardrail.check.ts` | tokenize/normalize, `isVocabVerified`, `isFullyAttested`, the taniwha laundering attack |
| Fail-soft | `npx tsx scripts/failsoft.check.ts` | invalid LLM key + corpus grown past seed returns the fixture, never throws |
| Mongo | `npx tsx --env-file=.env.local scripts/mongo.check.ts` | Atlas connect, ping, insert, read, delete |
| Blob | `npx tsx --env-file=.env.local scripts/blob.check.ts` | Vercel Blob put, public fetch, delete |
| Firestore | `npx tsx --env-file=.env.local scripts/firestore.check.ts` | auth user store write, read, delete |

The guardrail check prints exactly `guardrail.check: all assertions passed` on success. The three integration checks that read `.env.local` need the matching keys present, so run them only when you have configured that subsystem.

## Adding seed phrases

Seed corpora are ground truth, so the bar is attribution, not volume.

- Every added phrase must be traceable to a reputable, cited source. The corpora that ship today draw from: Te Aka Māori Dictionary, university te reo Māori resources, DAILP and the Cherokee Nation, and Omniglot.
- Macrons (te reo Māori) and syllabary (Cherokee) must be verified against the source, character for character.
- Anything you cannot attribute is rejected. There is no "probably correct" tier. If it is unverifiable, it does not go in.

Seed data lives in `src/lib/seed/` (`maori.ts`, `cherokee.ts`, `index.ts`). A `Phrase` carries an optional `source` field; use it.

## Adding a language

The registry in `src/lib/languages.ts` lists 8 languages: mi (Māori), chr (Cherokee), haw (Hawaiian), ain (Ainu), gv (Manx), kw (Cornish), nv (Navajo), yi (Yiddish).

Today only two are inducible:

```
INDUCIBLE_LANGUAGE_IDS = ["mi", "chr"]   // src/lib/languages.ts
```

Those two have cited seed corpora, so the engine can reason over them. The other 6 are registry-only entries: they appear in the catalog but cannot be induced because no cited corpus exists yet. Making any of them inducible is **Roadmap** work, and it starts with a cited seed corpus in `src/lib/seed/`, not a code change. Add the verified corpus first, then add the id to `INDUCIBLE_LANGUAGE_IDS`.

## PR expectations

- Keep diffs small and focused. One concern per PR.
- Match the surrounding style. Read the file you are editing before you change it.
- Do not add a dependency for something a few lines can do. The engine guardrail (`src/lib/engine/guardrail.ts`) is deliberately dependency-free.
- Run the checks above. A PR that touches `src/lib/engine/` without a passing guardrail check will not be merged.

**Verified by:** `npm run lint`, `npm run build`, `npx tsx src/lib/engine/guardrail.check.ts`
