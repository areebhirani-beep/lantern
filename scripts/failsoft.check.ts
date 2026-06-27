import assert from "node:assert/strict";
import { runInduction } from "../src/lib/engine/index";
import { getLanguageMeta } from "../src/lib/languages";
import { SEED_PHRASES } from "../src/lib/seed/index";

// Prove PHASE 0 fail-soft: when the corpus has grown past the seed (the Contribute
// case) and the live LLM call fails, runInduction must NOT throw — it returns the
// verified fixture so Contribute never shows an error page.
// Run: npx tsx scripts/failsoft.check.ts
//
// Provider config is read lazily (inside llm.ts functions), so setting env here —
// after the hoisted imports but before the call — still forces the failing path.

async function main() {
  process.env.GROQ_API_KEY = "gsk_invalid_key_to_force_a_failure";
  delete process.env.GEMINI_API_KEY;
  delete process.env.GOOGLE_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;

  for (const id of ["mi", "chr"]) {
    const language = getLanguageMeta(id)!;
    // grow the corpus one past the seed → live engine takes over (pin no longer applies)
    const grown = [
      ...SEED_PHRASES[id],
      { ...SEED_PHRASES[id][0], id: `${id}-test`, contributedBy: "community" },
    ];

    const result = await runInduction(language, grown);
    assert.equal(result.source, "fixture", `${id}: must fail soft to fixture on LLM failure`);
    assert.ok(result.vocab.length > 0, `${id}: fixture must still carry vocab`);
    assert.equal(result.corpusSize, grown.length, `${id}: corpusSize reflects grown corpus`);
    console.log(`failsoft.check: ${id} grown to ${grown.length} → ${result.source} (${result.vocab.length} vocab) ✓`);
  }

  console.log("failsoft.check: all assertions passed — Contribute never throws for hero languages");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
