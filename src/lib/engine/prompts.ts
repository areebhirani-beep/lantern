import type { Language, Phrase } from "../types";

// ---------------------------------------------------------------------------
// The induction engine's prompt + structured-output contract.
//
// Core principle: the model is documenting an endangered language from a SMALL,
// community-provided corpus. It reasons over the corpus it can SEE — it never
// invents words from outside knowledge. Every claim must trace back to the
// corpus, and every generated practice word must be attested. This is what
// keeps Lantern honest in front of linguists.
// ---------------------------------------------------------------------------

export const INDUCTION_TOOL_NAME = "report_induction";

export const INDUCTION_TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    vocab: {
      type: "array",
      description:
        "Words/morphemes attested in the corpus, aligned to meaning. ONLY forms that appear in the provided phrases.",
      items: {
        type: "object",
        properties: {
          form: { type: "string", description: "The word/morpheme as it appears in the corpus." },
          meaning: { type: "string" },
          pos: { type: "string", description: "Hypothesized part of speech / function." },
          notes: { type: "string" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          evidence: {
            type: "array",
            items: { type: "string" },
            description: "ids of corpus phrases that attest this item.",
          },
        },
        required: ["form", "meaning", "confidence", "evidence"],
        additionalProperties: false,
      },
    },
    patterns: {
      type: "array",
      description:
        "Grammatical regularities supported by minimal pairs in the corpus (e.g. tense markers, plural strategies). Omit anything the corpus does not actually show.",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          description: { type: "string" },
          examples: {
            type: "array",
            items: { type: "string" },
            description: "Short illustrative strings drawn from the corpus.",
          },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: ["label", "description", "examples", "confidence"],
        additionalProperties: false,
      },
    },
    lesson: {
      type: "object",
      properties: {
        title: { type: "string" },
        intro: { type: "string", description: "1–2 warm sentences orienting the learner." },
        cards: {
          type: "array",
          description: "Flashcards drawn from the corpus.",
          items: {
            type: "object",
            properties: {
              prompt: { type: "string", description: "Shown first — the English meaning." },
              answer: { type: "string", description: "The target-language form." },
              romanization: { type: "string" },
              hint: { type: "string" },
              category: { type: "string" },
            },
            required: ["prompt", "answer"],
            additionalProperties: false,
          },
        },
        practice: {
          type: "array",
          description:
            "Practice sentences built by RECOMBINING known vocab + patterns only. Every word in `target` must be an attested vocab form listed in `usesVocab`. Prefer corpus sentences; only recombine where a pattern licenses it.",
          items: {
            type: "object",
            properties: {
              target: { type: "string" },
              english: { type: "string" },
              usesVocab: {
                type: "array",
                items: { type: "string" },
                description: "Every vocab form used in `target`. All must be attested.",
              },
              note: { type: "string", description: "Which pattern licenses this recombination." },
            },
            required: ["target", "english", "usesVocab"],
            additionalProperties: false,
          },
        },
      },
      required: ["title", "intro", "cards", "practice"],
      additionalProperties: false,
    },
  },
  required: ["vocab", "patterns", "lesson"],
  additionalProperties: false,
};

// For providers that use JSON mode instead of tool-use (e.g. Gemini), this
// describes the exact object to return. Mirrors INDUCTION_TOOL_SCHEMA.
export const INDUCTION_JSON_HINT = [
  "Respond with ONLY a JSON object (no markdown, no prose) of this shape:",
  "{",
  '  "vocab": [{ "form": string, "meaning": string, "pos"?: string, "notes"?: string, "confidence": "high"|"medium"|"low", "evidence": string[] }],',
  '  "patterns": [{ "label": string, "description": string, "examples": string[], "confidence": "high"|"medium"|"low" }],',
  '  "lesson": {',
  '    "title": string, "intro": string,',
  '    "cards": [{ "prompt": string, "answer": string, "romanization"?: string, "hint"?: string, "category"?: string }],',
  '    "practice": [{ "target": string, "english": string, "usesVocab": string[], "note"?: string }]',
  "  }",
  "}",
  "evidence holds the ids (e.g. mi-015) of corpus phrases attesting the item. Every word in a practice `target` must be attested and listed in usesVocab.",
].join("\n");

export function buildSystemPrompt(language: Language): string {
  return [
    `You are a careful field linguist and language teacher helping a community revitalize ${language.name} (${language.endonym}), a ${language.status.replace(/-/g, " ")} language of ${language.region}.`,
    "",
    "You are given a SMALL corpus of phrases the community has documented. Your job is to (1) extract a vocabulary bank, (2) induce grammatical patterns, and (3) build a beginner micro-lesson — strictly from this corpus.",
    "",
    "NON-NEGOTIABLE RULES:",
    "1. Evidence only. Every vocab item and every grammatical pattern must be supported by the provided phrases. Cite phrase ids as evidence.",
    "2. No invention. Never output a word form that does not appear in the corpus. You may segment phrases into morphemes that appear in the corpus, but you may not introduce vocabulary from outside knowledge — even if you happen to know the language.",
    "3. Controlled generation. Practice sentences must be built ONLY by recombining attested vocab according to a pattern you actually found (e.g. swapping a known tense marker, a known noun after a known article). List every vocab form used in `usesVocab`; all must be attested. When in doubt, reuse a corpus sentence verbatim rather than risk an unattested form.",
    "4. Honest confidence. With thin evidence, mark medium/low confidence or omit. A linguist will check your work; being wrong is worse than being incomplete.",
    "5. Respect. This is living cultural heritage. Be accurate and humble; do not flatten nuance.",
    "",
    "Return your analysis by calling the report_induction tool. Do not write prose outside the tool call.",
  ].join("\n");
}

export function buildUserPrompt(language: Language, phrases: Phrase[]): string {
  const lines = phrases.map((p) => {
    const parts = [`[${p.id}] ${p.target}`];
    if (p.romanization) parts.push(`(${p.romanization})`);
    parts.push(`= "${p.english}"`);
    if (p.gloss) parts.push(`| gloss: ${p.gloss}`);
    return parts.join(" ");
  });

  return [
    `Corpus for ${language.name} — ${phrases.length} phrases:`,
    "",
    ...lines,
    "",
    "Analyze this corpus and call report_induction with:",
    "- vocab: every attested word/morpheme aligned to meaning, with evidence ids.",
    "- patterns: grammatical regularities the corpus actually demonstrates (look hard for minimal pairs — same word with different markers).",
    "- lesson: a warm beginner micro-lesson (8–12 cards) plus 4–8 practice sentences built only from attested vocab.",
  ].join("\n");
}
