@AGENTS.md

# CLAUDE.md — Lantern

Lantern teaches endangered languages from minimal corpora. Its differentiator is an
anti-hallucination guardrail that refuses to invent words. Protect that above everything.

## Invariants (never break these)

- **Never let the guardrail regress.** Any change under `src/lib/engine/` must keep
  `src/lib/engine/guardrail.check.ts` passing, with **0 hallucinations** and **100% vocab
  citation coverage** in fixture metrics.
- Keep `tokenize`/`normalizeToken` canonical and case-folded — one implementation,
  no stale copy in `src/app/api/metrics/route.ts` or anywhere else.
- Attestation gates flashcard answers — never surface an unverified answer.
- Corpora in `src/lib/seed/` are ground truth; never add a word you can't attribute to a real source.
- Submission docs cite only verified claims (live `/api/metrics`, `docs/EVALUATION.md`, the repo) — no invented stats.

## Next.js

This is a breaking Next.js version — read the relevant guide in `node_modules/next/dist/docs/`
before writing frontend code. See `@AGENTS.md`.

## Verify before "done"

`npm run lint`, `npm run build`, and the guardrail self-check (`/guardrail-audit`).

## Commands

- `/guardrail-audit` — verify the anti-hallucination guardrail holds. Run before any deploy or submission.
- `/submission <event>` — draft/refine a competition submission with verified claims only.
- `/daily-sync` — status + health (lint, build, guardrail).

## State

`data/projects/lantern.json` — repo, live URL, metrics endpoint, key paths, competitions.
