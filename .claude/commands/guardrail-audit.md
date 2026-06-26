# /guardrail-audit

Verify the anti-hallucination guardrail still holds. Routes to @engine. Run before any submission or deploy.

1. Run the guardrail self-check logic in `src/lib/engine/guardrail.check.ts`.
2. Run fixture metrics (`src/lib/engine/fixtures.ts` → the metrics path): confirm
   **0 hallucinations** and **100% vocab citation coverage**.
3. Confirm `tokenize`/`normalizeToken` is the single canonical, case-folded implementation —
   no stale copy in `src/app/api/metrics/route.ts` or elsewhere.
4. Confirm attestation gates flashcard answers (no unverified answer can surface).
5. Report a pass/fail table. Any failure blocks deploy — fix before shipping.
