import { LANGUAGES, isInducible } from "@/lib/languages";
import { SEED_PHRASES } from "@/lib/seed";
import { getFixture } from "@/lib/engine/fixtures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Same tokenization the engine guardrail uses, recomputed here so the metric is
// an independent check rather than a self-report.
function tokenize(s: string): string[] {
  return s
    .split(/\s+/)
    .map((t) => t.replace(/[.,!?؟；;:·"'“”()¿¡]/g, "").trim())
    .filter(Boolean);
}

// GET /api/metrics — verifiable "by the numbers" for the writeups + paper.
export async function GET() {
  const perLanguage = [];
  let phrasesIn = 0;
  let vocabOut = 0;
  let patternsOut = 0;
  let cards = 0;
  let practice = 0;
  let practiceChecked = 0;
  let hallucinationsPassed = 0;
  let vocabWithEvidence = 0;
  let vocabTotal = 0;

  for (const lang of LANGUAGES) {
    if (!isInducible(lang.id)) continue;
    const phrases = SEED_PHRASES[lang.id] ?? [];
    const fx = getFixture(lang.id, phrases.length);
    if (!fx) continue;

    // attested vocabulary = every token in the corpus + every induced word form
    const attested = new Set<string>();
    for (const p of phrases) for (const t of tokenize(p.target)) attested.add(t);
    for (const v of fx.vocab) for (const t of tokenize(v.form)) attested.add(t);

    let violations = 0;
    for (const s of fx.lesson.practice) {
      practiceChecked++;
      const toks = tokenize(s.target);
      const fullyAttested = toks.length > 0 && toks.every((t) => attested.has(t));
      if (!fullyAttested) {
        violations++;
        hallucinationsPassed++;
      }
    }

    const withEvidence = fx.vocab.filter((v) => v.evidence.length > 0).length;
    vocabWithEvidence += withEvidence;
    vocabTotal += fx.vocab.length;

    phrasesIn += phrases.length;
    vocabOut += fx.vocab.length;
    patternsOut += fx.patterns.length;
    cards += fx.lesson.cards.length;
    practice += fx.lesson.practice.length;

    perLanguage.push({
      language: lang.name,
      id: lang.id,
      phrasesIn: phrases.length,
      vocab: fx.vocab.length,
      patterns: fx.patterns.length,
      cards: fx.lesson.cards.length,
      practice: fx.lesson.practice.length,
      practiceFailingAttestation: violations,
      vocabCitationCoverage: `${withEvidence}/${fx.vocab.length}`,
    });
  }

  return Response.json({
    summary: {
      inducibleLanguages: perLanguage.length,
      phrasesIn,
      vocabOut,
      patternsOut,
      cards,
      practice,
      practiceSentencesChecked: practiceChecked,
      hallucinatedWordsThatReachedALearner: hallucinationsPassed, // expect 0
      vocabCitationCoverage: `${vocabWithEvidence}/${vocabTotal}`,
    },
    perLanguage,
    note: "Counts are from the verified reference induction shipped with the app. With a live LLM key, the same code-level attestation guardrail enforces the identical zero-hallucination property on freshly generated lessons.",
  });
}
