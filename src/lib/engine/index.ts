import { z } from "zod";
import type {
  Flashcard,
  InductionResult,
  Language,
  Lesson,
  Pattern,
  Phrase,
  PracticeSentence,
  VocabItem,
} from "../types";
import { ANTHROPIC_MODEL, getAnthropic, hasAnthropicKey } from "../anthropic";
import {
  INDUCTION_TOOL_NAME,
  INDUCTION_TOOL_SCHEMA,
  buildSystemPrompt,
  buildUserPrompt,
} from "./prompts";
import { getFixture } from "./fixtures";

// ---- Runtime validation of the model's structured output -------------------

const ConfidenceZ = z.enum(["high", "medium", "low"]);

const OutputZ = z.object({
  vocab: z
    .array(
      z.object({
        form: z.string(),
        meaning: z.string(),
        pos: z.string().optional(),
        notes: z.string().optional(),
        confidence: ConfidenceZ,
        evidence: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  patterns: z
    .array(
      z.object({
        label: z.string(),
        description: z.string(),
        examples: z.array(z.string()).default([]),
        confidence: ConfidenceZ,
      }),
    )
    .default([]),
  lesson: z.object({
    title: z.string(),
    intro: z.string(),
    cards: z
      .array(
        z.object({
          prompt: z.string(),
          answer: z.string(),
          romanization: z.string().optional(),
          hint: z.string().optional(),
          category: z.string().optional(),
        }),
      )
      .default([]),
    practice: z
      .array(
        z.object({
          target: z.string(),
          english: z.string(),
          usesVocab: z.array(z.string()).default([]),
          note: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

type Output = z.infer<typeof OutputZ>;

// ---- The no-hallucination guardrail (enforced in code, not just the prompt) -

function normalizeToken(t: string): string {
  return t.replace(/[.,!?؟；;:·"'“”()¿¡]/g, "").trim();
}

function tokenize(s: string): string[] {
  return s.split(/\s+/).map(normalizeToken).filter(Boolean);
}

/** Every whitespace token attested anywhere in the corpus or the vocab bank. */
function buildAttestedTokens(phrases: Phrase[], vocab: VocabItem[]): Set<string> {
  const set = new Set<string>();
  for (const p of phrases) for (const t of tokenize(p.target)) set.add(t);
  for (const v of vocab) for (const t of tokenize(v.form)) set.add(t);
  return set;
}

/** A generated sentence survives only if EVERY word in it is attested. */
function isFullyAttested(target: string, attested: Set<string>): boolean {
  const toks = tokenize(target);
  return toks.length > 0 && toks.every((t) => attested.has(t));
}

// ---- Assembly --------------------------------------------------------------

function assemble(
  language: Language,
  phrases: Phrase[],
  parsed: Output,
  source: "ai" | "fixture",
  model: string,
  generatedAt: number,
): InductionResult {
  const id = language.id;

  const vocab: VocabItem[] = parsed.vocab.map((v, i) => ({
    id: `${id}-v${i + 1}`,
    languageId: id,
    form: v.form,
    meaning: v.meaning,
    pos: v.pos,
    notes: v.notes,
    confidence: v.confidence,
    evidence: v.evidence,
  }));

  const patterns: Pattern[] = parsed.patterns.map((p, i) => ({
    id: `${id}-p${i + 1}`,
    languageId: id,
    label: p.label,
    description: p.description,
    examples: p.examples,
    confidence: p.confidence,
  }));

  const attested = buildAttestedTokens(phrases, vocab);
  const practice: PracticeSentence[] = parsed.lesson.practice
    .filter((s) => isFullyAttested(s.target, attested))
    .map((s) => ({
      target: s.target,
      english: s.english,
      usesVocab: s.usesVocab,
      note: s.note,
    }));

  const cards: Flashcard[] = parsed.lesson.cards.map((c, i) => ({
    id: `${id}-c${i + 1}`,
    prompt: c.prompt,
    answer: c.answer,
    romanization: c.romanization,
    hint: c.hint,
    category: c.category,
  }));

  const lesson: Lesson = {
    id: `${id}-lesson`,
    languageId: id,
    title: parsed.lesson.title,
    intro: parsed.lesson.intro,
    cards,
    practice,
    createdAt: generatedAt,
  };

  return {
    languageId: id,
    vocab,
    patterns,
    lesson,
    corpusSize: phrases.length,
    generatedAt,
    model,
    source,
  };
}

// ---- Model call ------------------------------------------------------------

async function callModel(language: Language, phrases: Phrase[]): Promise<unknown> {
  const client = getAnthropic();
  const res = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 8000,
    temperature: 0.2,
    system: buildSystemPrompt(language),
    tools: [
      {
        name: INDUCTION_TOOL_NAME,
        description:
          "Report the vocabulary, grammatical patterns, and beginner lesson induced strictly from the provided corpus.",
        input_schema: INDUCTION_TOOL_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: INDUCTION_TOOL_NAME },
    messages: [{ role: "user", content: buildUserPrompt(language, phrases) }],
  });

  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    throw new Error("Induction model returned no tool_use block");
  }
  return block.input;
}

// ---- Public entry point ----------------------------------------------------

/**
 * Induce vocabulary, grammar, and a lesson for a language from its corpus.
 * Uses Claude when an API key is present; otherwise (or on any failure) falls
 * back to a verified cached result so the experience never breaks.
 */
export async function runInduction(
  language: Language,
  phrases: Phrase[],
): Promise<InductionResult> {
  const generatedAt = Date.now();

  if (!hasAnthropicKey()) {
    const fx = getFixture(language.id, phrases.length);
    if (fx) return fx;
  }

  try {
    const raw = await callModel(language, phrases);
    const parsed = OutputZ.parse(raw);
    return assemble(language, phrases, parsed, "ai", ANTHROPIC_MODEL, generatedAt);
  } catch (err) {
    console.error("[induction] falling back to fixture:", err);
    const fx = getFixture(language.id, phrases.length);
    if (fx) return fx;
    throw err;
  }
}
