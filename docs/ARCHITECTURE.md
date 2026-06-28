# Lantern: Architecture

Lantern turns the few words an elder still remembers into a real course, with an
engine that discovers grammar from those words and never invents one. This document
is the engineering deep-dive: how the app is shaped, how a course gets induced, and
why nothing breaks when the keys are missing.

One rule governs the whole system: **the model proposes, the code disposes.** An LLM
may suggest vocabulary and lessons, but a dependency-free guardrail (`src/lib/engine/guardrail.ts`)
decides what a learner is allowed to see. The full worked example of that guardrail
(the tokenize / verify / attest walk, plus the "taniwha laundering" attack) lives in
the companion doc [`GUARDRAIL.md`](./GUARDRAIL.md); this file links to it rather than
repeating it.

Stack: Next.js 16.2.9, React 19.2.4, TypeScript 5, Tailwind v4. Live at
https://lantern-cyan.vercel.app. License MIT.

---

## 1. System overview

Lantern is **one deployable Next.js 16 app** (App Router + React Server Components).
Marketing pages, the learning workspace, and the induction API all live in one tree
under `src/app`. There is no separate backend service: API route handlers run in the
same deployment as the pages.

```
                    ┌───────────────────────────────────────────────┐
                    │  Browser                                       │
                    │  RSC-rendered marketing + learning workspace,  │
                    │  client components for Induce / Contribute     │
                    └───────────────────────┬───────────────────────┘
                                            │  fetch()
                    ┌───────────────────────▼───────────────────────┐
                    │  API route handlers  (src/app/api/*)           │
                    │  induce · contribute · languages · stats ·     │
                    │  metrics · audio · auth/[...nextauth]          │
                    └───────┬───────────────────────────┬───────────┘
                            │                            │
              ┌─────────────▼─────────────┐   ┌──────────▼───────────┐
              │  Induction engine         │   │  Store               │
              │  src/lib/engine/index.ts  │   │  src/lib/store.ts     │
              │  runInduction() +         │   │  Phrases, inductions, │
              │  assemble() + guardrail   │   │  contributions, stats │
              └───────┬───────────┬───────┘   └──────────┬───────────┘
                      │           │                       │
          ┌───────────▼──┐  ┌─────▼────────┐   ┌──────────▼───────────┐
          │ LLM provider │  │ Seed corpora │   │ MongoDB Atlas   OR   │
          │ src/lib/llm  │  │ + fixtures   │   │ in-memory (default)  │
          │ (proposes)   │  │ (ground truth)│  └──────────────────────┘
          └──────────────┘  └──────────────┘
```

Every arrow into the engine is a proposal; every arrow out has passed the guardrail.

---

## 2. Request lifecycle: inducing a course

`POST /api/induce` is the "watch the structure appear" endpoint
(`src/app/api/induce/route.ts:12-40`). Runtime is `nodejs`, `dynamic = "force-dynamic"`,
`maxDuration = 60`.

| Step | What happens | Where |
|------|--------------|-------|
| 1 | Parse `{ languageId, force? }`; resolve `getLanguageMeta`. Unknown id returns 404. | route.ts:13-20 |
| 2 | `getStore()` resolves the active store (Mongo if configured, else in-memory). | route.ts:22 |
| 3 | If `!force` and a cached induction exists, return it immediately (`cached: true`). `force: true` skips the cache and re-runs. | route.ts:24-27 |
| 4 | Load `store.getPhrases(languageId)`. Empty corpus returns 400 ("contribute a few phrases first"). | route.ts:29-35 |
| 5 | `runInduction(language, phrases)` produces an `InductionResult`. | route.ts:37 |
| 6 | `store.saveInduction(induction)` caches it; respond `{ induction, cached: false }`. | route.ts:38-39 |

Inside `runInduction` (`src/lib/engine/index.ts:172-207`) the decision flow is:

```
runInduction(language, phrases)
   │
   ├─ seedCount = SEED_PHRASES[language.id]?.length            (index.ts:183)
   │   if seedCount>0 AND phrases.length <= seedCount:
   │        return getFixture(...)   ← verified curated result   (index.ts:184-187)
   │        (seed corpus unmodified → pristine pinned induction)
   │
   ├─ if !hasLLMKey():
   │        return getFixture(...)   ← no provider key            (index.ts:189-192)
   │
   └─ try:
   │     raw    = callInduction(systemPrompt, userPrompt)         (index.ts:195-198)
   │     parsed = OutputZ.parse(raw)   ← reject malformed         (index.ts:199)
   │     return assemble(..., source:"ai")                        (index.ts:200)
   │  catch (err):
   │     console.error("[induction] falling back to fixture:", err)
   │     return getFixture(...)   ← fixture; rethrow only if none (index.ts:201-206)
```

`assemble()` is where the guardrail bites: zod-parsed model output is filtered so
**unattested practice sentences and unattested flashcard answers are dropped** before
the result is ever returned (see Section 3).

### The flywheel: `POST /api/contribute`

`src/app/api/contribute/route.ts:21-42` adds one phrase to a language's living corpus.
The body is validated by a zod schema (`BodyZ`, contribute/route.ts:8-16): `languageId`,
`target` (1-200 chars) and `english` (1-200 chars) are required; `romanization`,
`category`, `contributedBy`, `audioUrl` are optional. On success it:

1. `store.addPhrase(...)`, which **invalidates that language's cached induction**
   (`store.ts:86` in-memory, `store.ts:144` Mongo).
2. `store.recordContribution(...)`.
3. Returns `{ phrase, phraseCount }`.

Because the cache is invalidated, the next `POST /api/induce` re-derives over a richer
corpus that now exceeds the seed count, so the live engine (not the pinned fixture)
takes over. **That is the flywheel:** contribute -> invalidate -> re-induce richer.

### Read routes

| Route | Method | Returns | Source |
|-------|--------|---------|--------|
| `/api/languages` | GET | Ark roster: each language plus `phraseCount`, `vocabCount`, `inducible` (= `phrases.length > 0`). | languages/route.ts:8-23 |
| `/api/stats` | GET | `ArkStats` counters powering the Living Ark dashboard. | stats/route.ts:7-11 |
| `/api/metrics` | GET | Independently recomputed "by the numbers" attestation proof (Section 4). | metrics/route.ts:13-85 |

---

## 3. The induction engine

`src/lib/engine/index.ts` owns three things: schema validation, the assembly /
filtering step, and the `runInduction` decision flow.

**`OutputZ` (the zod contract, index.ts:27-75).** The model must return exactly this
shape or `OutputZ.parse` throws (and the engine falls back):

| Field | Shape |
|-------|-------|
| `vocab[]` | `{ form, meaning, pos?, notes?, confidence(high\|medium\|low), evidence: string[] (default []) }` |
| `patterns[]` | `{ label, description, examples: string[], confidence }` |
| `lesson` | `{ title, intro, cards[], practice[] }` |
| `lesson.cards[]` | `{ prompt, answer, romanization?, hint?, category? }` |
| `lesson.practice[]` | `{ target, english, usesVocab: string[], note? }` |

**`assemble()` (index.ts:81-163)** turns parsed output into an `InductionResult`:

1. Each vocab item gets `verified = isVocabVerified(form, evidence, phraseById)`
   (index.ts:101). Unverified items are kept (they may be a real segmentation guess)
   but are not trusted.
2. The **attested basis** is built (index.ts:116-119): start from
   `buildCorpusTokens(phrases)` (every token in the real corpus), then add the form
   tokens of **only the verified** vocab. An unverified form never becomes ground
   truth, so it cannot launder a hallucination into a lesson.
3. `practice` is filtered to sentences where `isFullyAttested(s.target, attested)`
   (index.ts:121-128). Unattested practice sentences are dropped.
4. `cards` is filtered to those where `isFullyAttested(c.answer, attested)`
   (index.ts:132-141). A card whose answer contains an unattested word is dropped,
   never shown to a learner.

**`InductionResult`** carries `source: "ai" | "fixture"` (types.ts:123) so callers can
tell real inference from a cached fallback. `assemble` stamps `source:"ai"` on live
runs (index.ts:200); fixtures carry `source:"fixture"`.

---

## 4. The guardrail's tokenize / normalize / cite logic

`src/lib/engine/guardrail.ts` is deliberately **dependency-free**: it calls no model
and no database, so the no-hallucination property can be reasoned about and unit-tested
in isolation.

| Function | Behavior | Line |
|----------|----------|------|
| `normalizeToken(t)` | Strip punctuation `[.,!?؟；;:·"'""()¿¡]`, trim, `toLowerCase()`. Case-folds so sentence-initial "Kia" matches vocab "kia"; macrons and syllabary fold correctly. | :12-16 |
| `GAP_TOKENS` | Set of `…`, `...`, `—`, `-`. Discontinuous-morpheme markers (e.g. Māori "e … ana"), dropped as notation, not words. | :20 |
| `tokenize(s)` | `split(/\s+/)` -> normalize -> drop empty + gap tokens. | :22-27 |
| `buildCorpusTokens(phrases)` | `Set` of every `tokenize(p.target)` token: the only ground truth. | :30-34 |
| `isVocabVerified(form, evidence, phraseById)` | True iff **every** token of `form` occurs in one of its OWN cited evidence phrases. Empty form -> false. Catches invented forms AND miscitations. | :41-54 |
| `isFullyAttested(target, attested)` | `toks = tokenize(target)`; true iff `toks.length > 0 && toks.every(t => attested.has(t))`. | :57-60 |

`GET /api/metrics` imports the **same** `tokenize` (metrics/route.ts:4) and
independently recomputes the attestation property over the shipped fixtures
(metrics/route.ts:31-45): it rebuilds the attested set (corpus tokens + induced vocab
form tokens), runs `isFullyAttested` on every fixture practice sentence, and counts any
that fail as `hallucinatedWordsThatReachedALearner`. This is an independent
recomputation, not a self-report. There is exactly one `tokenize`/`normalizeToken`
implementation; the metrics route must never keep a stale copy.

Live `GET /api/metrics` (fetched 2026-06-27):

| Summary | Value |
|---------|-------|
| inducibleLanguages | 2 |
| phrasesIn | 56 |
| vocabOut | 48 |
| patternsOut | 7 |
| cards | 22 |
| practice / practiceSentencesChecked | 7 / 7 |
| hallucinatedWordsThatReachedALearner | 0 |
| vocabCitationCoverage | 48/48 |

Per language: Māori (mi) phrasesIn 41, vocab 34, patterns 5, cards 12, practice 5,
practiceFailingAttestation 0, vocab coverage 34/34. Cherokee (chr) phrasesIn 15,
vocab 14, patterns 2, cards 10, practice 2, practiceFailingAttestation 0, coverage
14/14. The PROOF BAND "0 invented · 48/48 cited · 7/7 attested" maps directly to these
three numbers. For the full worked tokenize / verify / attest example and the taniwha
laundering attack, see [`GUARDRAIL.md`](./GUARDRAIL.md).

---

## 5. Fail-soft layers

The app boots and serves verified content with a completely empty `.env`. Every
external dependency degrades instead of crashing.

| Layer | Healthy | Degraded | Mechanism |
|-------|---------|----------|-----------|
| LLM | Live induction on the active provider | Verified fixture | No key (`!hasLLMKey()`) or any error -> `getFixture()`; error path logs `[induction] falling back to fixture` (engine/index.ts:189-206). |
| Persistence | MongoDB Atlas | In-memory store | `getStore()`: if `MONGODB_URI` set, try Mongo; on connect error log `[store] Mongo connection failed, using in-memory` and fall back (store.ts:211-221). |
| Auth | Google / GitHub / Credentials sign-in | Graceful, no UI errors | Providers register only when their env exists; `authConfigured() = Boolean(AUTH_SECRET)`; Credentials `authorize()` returns `null` cleanly when Firestore is absent (auth.ts:16-52). |
| Audio storage | Clip stored on Vercel Blob | 503, app keeps working | `POST /api/audio` returns 503 when `BLOB_READ_WRITE_TOKEN` is unset (`!storageConfigured()`, audio/route.ts:10-15). |

The same fixture fallback is exercised by `scripts/failsoft.check.ts`: with an invalid
Groq key and a corpus grown one past the seed, `runInduction` returns the fixture
(`source: "fixture"`) instead of throwing, so Contribute never errors for mi/chr.

---

## 6. Data model

Domain types live in `src/lib/types.ts` and are the contract between engine, store,
and UI. `AppUser` lives in `src/lib/users.ts`.

**`Phrase`: the ground truth the engine reasons over (types.ts:40-53).**

| Field | Meaning |
|-------|---------|
| `id`, `languageId` | Identity + which language this phrase belongs to. |
| `target` | The phrase in correct orthography. |
| `romanization?` | Latin transliteration (used for syllabary scripts). |
| `english` | The meaning. |
| `gloss?` | Interlinear gloss (human- or AI-supplied). |
| `category` | greeting / everyday / number / family / sentence / ... |
| `audioUrl?` | Speaker-recorded pronunciation (Vercel Blob URL). |
| `source?` | Citation for trust. |
| `confidence` | high / medium / low. |
| `contributedBy` | "seed" or a contributor handle. |
| `createdAt` | Epoch ms. |

The engine never invents words outside what these phrases attest.

**`AppUser`: the Firestore user record (users.ts:13-23).**

| Field | Meaning |
|-------|---------|
| `id` | Firestore doc id (becomes the session uid). |
| `email` | Lowercased, unique lookup key. |
| `name?`, `image?` | Display profile. |
| `passwordHash?` | bcryptjs hash for credentials accounts; `null` for OAuth. |
| `provider?` | "credentials", "google", "github". |
| `createdAt` | Epoch ms. |
| `emailVerified?` | Epoch ms verified, or `null`/undefined = unverified. Additive only; never gates sign-in. |

**Other key fields:**

| Type | Field | Meaning |
|------|-------|---------|
| `VocabItem` | `verified?` | True only if every non-gap token of `form` occurs in one of its cited evidence phrases (types.ts:56-69). Set by `isVocabVerified`. |
| `PracticeSentence` | `usesVocab[]` | The vocab forms the sentence relies on; each must already exist in the induced bank. Generated by recombining KNOWN vocab only (types.ts:96-101). |
| `InductionResult` | `source` | `"ai"` (real inference) or `"fixture"` (cached fallback), plus `corpusSize`, `generatedAt`, `model` (types.ts:115-124). |

---

## 7. Auth flow

Auth.js v5 (`next-auth ^5.0.0-beta.31`), JWT sessions, `pages.signIn = "/signin"`,
`trustHost: true` (auth.ts:54-58). Sign-in is **additive**: it syncs progress and
attributes contributions, but never gates the demo.

```
 Google / GitHub / Email+password
            │
            ▼
   ┌──────────────────────────────────────────────┐
   │ Auth.js v5  (NextAuth, session.strategy "jwt")│
   │  providers registered CONDITIONALLY:          │
   │   Google   iff GOOGLE_CLIENT_ID + _SECRET     │  auth.ts:16-23
   │   GitHub   iff GITHUB_ID + _SECRET            │  auth.ts:25-32
   │   Credentials ALWAYS (authorize→null if no DB)│  auth.ts:36-52
   └───────────────────┬──────────────────────────┘
                       │  jwt callback (auth.ts:60-81)
                       ▼
   ┌──────────────────────────────────────────────┐
   │ First non-credentials sign-in AND             │
   │ isFirebaseConfigured():                       │
   │   token.uid = upsertOAuthUser(...)  (Firestore)│
   │ Credentials sign-in:                          │
   │   token.uid = user.id  (Firestore doc id)     │
   └───────────────────┬──────────────────────────┘
                       │  session callback (auth.ts:82-87)
                       ▼
              session.user.id = token.uid
```

Notes:

- **Conditional registration** means an empty `.env` still boots the whole app; the
  Credentials form is always present and fails cleanly when Firestore is unconfigured.
- Passwords are hashed with **bcryptjs, 10 rounds** (`createCredentialsUser`
  users.ts:50, `setPassword` users.ts:85); `verifyCredentials` uses `bcrypt.compare`
  (users.ts:91-99).
- Email verification is **additive and never gates sign-in**: new credentials accounts
  start `emailVerified: null` (users.ts:61) and `markEmailVerified` only sets a
  timestamp later.
- `authConfigured() = Boolean(AUTH_SECRET)`, the one var Auth.js v5 hard-requires. When
  false, no auth UI renders and no failing `/api/auth/session` calls fire.
- Auth API routes: `api/auth/[...nextauth]`, `/register`, `/request-reset`, `/reset`,
  `/verify-email`. Helpers: `src/lib/auth-tokens.ts`, `src/lib/email.ts`.

---

## 8. Storage + persistence summary

| Concern | Default (zero-config) | Configured | Notes |
|---------|----------------------|------------|-------|
| Living corpus | `InMemoryStore`, seeded from `SEED_PHRASES`, survives dev HMR via `globalThis.__lanternMem` | `MongoStore` when `MONGODB_URI` is set (collections: phrases, inductions, contributions; `MONGODB_DB` defaults "lantern") | One `Store` interface (store.ts:14-29). Mongo auto-seeds a language on first read if its collection is empty (store.ts:126-131). `isPersistent() = Boolean(MONGODB_URI)`. |
| Speaker audio | 503 (storage not configured) | Vercel Blob via `@vercel/blob` `put` | `storageConfigured() = Boolean(BLOB_READ_WRITE_TOKEN)`. Bounds: `MAX_BYTES = 5 * 1024 * 1024` (5MB), MIME allowlist (webm/ogg/mp3/m4a/wav), path `pronunciations/<lang>/clip.<ext>`. |

**globalThis singletons.** Both stores are resolved through `globalThis`
(`__lanternMem`, `__lanternMongo`, store.ts:190-208) so in-memory state and the Mongo
client survive Next.js dev hot-module reloads instead of being re-created per request.

**LLM provider resolution** (`src/lib/llm.ts`) is provider-agnostic by priority
(llm.ts:16-21): `GEMINI_API_KEY || GOOGLE_API_KEY` -> gemini; `GROQ_API_KEY ||
OPENAI_API_KEY` -> openai-compatible; `ANTHROPIC_API_KEY` -> anthropic; else `null`
(fixtures). Groq is **one** supported provider (the free, no-card default), not the
only one: any OpenAI-compatible endpoint works (Groq, OpenRouter, Cerebras, Together,
GitHub Models, OpenAI). All calls use temperature 0.2 and `max_tokens` 8000 (Gemini
`maxOutputTokens` 8192).

> **Roadmap / discrepancy:** `.env.example` lists `AWS_REGION` / `AWS_ACCESS_KEY_ID` /
> `AWS_SECRET_ACCESS_KEY` / `S3_BUCKET` for audio, but **no code reads them**. Audio is
> served by Vercel Blob (`BLOB_READ_WRITE_TOKEN`). Treat S3 as not-yet-wired (Roadmap);
> Vercel Blob is the real path today.

---

**Verified by:** reading `src/lib/engine/index.ts`, `src/lib/engine/guardrail.ts`,
`src/lib/llm.ts`, `src/lib/store.ts`, `src/auth.ts`, `src/lib/users.ts`,
`src/lib/types.ts`, `src/app/api/induce/route.ts`, `src/app/api/contribute/route.ts`,
`src/app/api/metrics/route.ts`, `src/app/api/languages/route.ts`,
`src/app/api/stats/route.ts`, `src/app/api/audio/route.ts`; the live `GET /api/metrics`
endpoint (fetched 2026-06-27); plus `npx tsx src/lib/engine/guardrail.check.ts` and
`npx tsx scripts/failsoft.check.ts`.
