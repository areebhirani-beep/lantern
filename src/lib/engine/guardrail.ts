import type { Phrase } from "../types";

// ---------------------------------------------------------------------------
// The no-hallucination guardrail, isolated and dependency-free so it can be
// reasoned about and tested on its own. Nothing here calls a model or a DB.
//
// The property it enforces: no word reaches a learner unless it is attested by
// the community corpus. "Attested" means it appears in a real corpus phrase, or
// in a vocab form we independently verified against that form's own citations.
// ---------------------------------------------------------------------------

function normalizeToken(t: string): string {
  // Case-fold so a sentence-initial "Kia" matches the vocab form "kia". Macrons
  // and syllabary fold correctly under toLowerCase; syllabary has no case.
  return t.replace(/[.,!?؟；;:·"'“”()¿¡]/g, "").trim().toLowerCase();
}

// Discontinuous-morpheme gap markers (e.g. Māori "e … ana"). Notation, not
// words, so they are ignored when checking whether a form is attested.
const GAP_TOKENS = new Set(["…", "...", "—", "-"]);

export function tokenize(s: string): string[] {
  return s
    .split(/\s+/)
    .map(normalizeToken)
    .filter((t) => t && !GAP_TOKENS.has(t));
}

/** Tokens that actually appear in the community corpus — the only ground truth. */
export function buildCorpusTokens(phrases: Phrase[]): Set<string> {
  const set = new Set<string>();
  for (const p of phrases) for (const t of tokenize(p.target)) set.add(t);
  return set;
}

/**
 * A vocab item is verified only if every token of its `form` occurs in one of
 * its OWN cited evidence phrases. This turns "the model claims this word" into
 * "the corpus shows this word", and catches both invented forms and miscitations.
 */
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

/** A generated string survives only if EVERY word in it is attested. */
export function isFullyAttested(target: string, attested: Set<string>): boolean {
  const toks = tokenize(target);
  return toks.length > 0 && toks.every((t) => attested.has(t));
}
