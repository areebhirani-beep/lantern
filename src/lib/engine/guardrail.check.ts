import assert from "node:assert/strict";
import type { Phrase } from "../types";
import {
  buildCorpusTokens,
  isFullyAttested,
  isVocabVerified,
  tokenize,
} from "./guardrail";

// Run: npx tsx src/lib/engine/guardrail.check.ts
// One self-contained check of the no-hallucination guardrail. No framework.

function phrase(id: string, target: string): Phrase {
  return {
    id,
    languageId: "mi",
    target,
    english: "",
    category: "test",
    confidence: "high",
    contributedBy: "seed",
    createdAt: 0,
  };
}

const corpus = [
  phrase("mi-001", "Kia ora"),
  phrase("mi-017", "Kei te haere ana au"), // attests the "e … ana"-style frame
];
const byId = new Map(corpus.map((p) => [p.id, p]));

// tokenize drops punctuation and gap markers, keeps real words.
assert.deepEqual(tokenize("Kia ora!"), ["kia", "ora"]);
assert.deepEqual(tokenize("e … ana"), ["e", "ana"], "gap marker must be dropped");

// A vocab form is verified only against ITS OWN citations.
assert.equal(isVocabVerified("ora", ["mi-001"], byId), true);
assert.equal(isVocabVerified("ora", ["mi-017"], byId), false, "miscitation must fail");
assert.equal(isVocabVerified("whetu", ["mi-001"], byId), false, "invented form must fail");
assert.equal(isVocabVerified("ana", [], byId), false, "no evidence must fail");

// Attestation basis = corpus tokens + verified-vocab tokens only.
const attested = buildCorpusTokens(corpus);
attested.add("ana"); // pretend "ana" was a verified vocab form
assert.equal(isFullyAttested("kia ora", attested), true);
assert.equal(isFullyAttested("kia whetu", attested), false, "invented word must be rejected");
assert.equal(isFullyAttested("", attested), false, "empty sentence must be rejected");

// The attack the guardrail exists to stop: an unverified (invented) vocab form
// must NOT enter the attestation basis, so a sentence using it is dropped.
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

console.log("guardrail.check: all assertions passed");
