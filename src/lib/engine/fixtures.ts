import type { InductionResult, Lesson, Pattern, VocabItem } from "../types";

// ---------------------------------------------------------------------------
// Verified, hand-checked induction results for the two shipped corpora.
// Used when no ANTHROPIC_API_KEY is configured, or as a safety net if a live
// call fails — so the demo is always honest AND always works. Every item here
// is traceable to the seed corpus in ../seed.
// ---------------------------------------------------------------------------

const MODEL = "lantern-verified-fixture";

function v(
  langId: string,
  n: number,
  form: string,
  meaning: string,
  pos: string,
  confidence: VocabItem["confidence"],
  evidence: string[],
  notes?: string,
): VocabItem {
  return {
    id: `${langId}-v${n}`,
    languageId: langId,
    form,
    meaning,
    pos,
    notes,
    confidence,
    evidence,
  };
}

// ---- Māori -----------------------------------------------------------------

const MI_VOCAB: VocabItem[] = [
  v("mi", 1, "kia", "let / may (particle introducing a wish)", "particle", "high", ["mi-001"]),
  v("mi", 2, "ora", "be alive, well, healthy", "stative verb", "high", ["mi-001"]),
  v("mi", 3, "koe", "you (one person)", "pronoun", "high", ["mi-004", "mi-013"]),
  v("mi", 4, "kōrua", "you (two people)", "pronoun", "high", ["mi-002", "mi-005"]),
  v("mi", 5, "koutou", "you (three or more)", "pronoun", "high", ["mi-003", "mi-006"]),
  v("mi", 6, "katoa", "all", "modifier", "high", ["mi-003", "mi-006"]),
  v("mi", 7, "tēnā", "greetings / that (by you)", "particle", "medium", ["mi-004"]),
  v("mi", 8, "au", "I, me", "pronoun", "high", ["mi-014", "mi-015"]),
  v("mi", 9, "haere", "go", "verb", "high", ["mi-015", "mi-016", "mi-018", "mi-019"]),
  v("mi", 10, "noho", "stay, live, sit", "verb", "high", ["mi-010", "mi-020", "mi-021"]),
  v("mi", 11, "kite", "see", "verb", "high", ["mi-011"]),
  v("mi", 12, "i", "past-tense marker (also a locative 'at')", "TAM particle", "high", ["mi-015"], "Same surface form also marks location in mi-020."),
  v("mi", 13, "kei te", "present / progressive marker ('-ing')", "TAM particle", "high", ["mi-013", "mi-014", "mi-016"]),
  v("mi", 14, "e … ana", "continuous marker (wraps the verb)", "TAM particle", "high", ["mi-017", "mi-021"]),
  v("mi", 15, "ka", "future / inceptive marker", "TAM particle", "high", ["mi-011", "mi-018"]),
  v("mi", 16, "kua", "perfect marker ('have …')", "TAM particle", "high", ["mi-019"]),
  v("mi", 17, "pai", "good", "stative verb", "high", ["mi-014"]),
  v("mi", 18, "pēhea", "how, in what way", "interrogative", "high", ["mi-013"]),
  v("mi", 19, "te", "the (singular)", "article", "high", ["mi-036"]),
  v("mi", 20, "ngā", "the (plural)", "article", "high", ["mi-012", "mi-037"]),
  v("mi", 21, "whare", "house", "noun", "high", ["mi-036", "mi-037"]),
  v("mi", 22, "tāku", "my (one thing possessed)", "possessive", "high", ["mi-038"]),
  v("mi", 23, "āku", "my (more than one thing)", "possessive", "high", ["mi-039"]),
  v("mi", 24, "pene", "pen", "noun", "high", ["mi-038", "mi-039"]),
  v("mi", 25, "matua", "parent (one)", "noun", "high", ["mi-029"]),
  v("mi", 26, "mātua", "parents (more than one)", "noun", "high", ["mi-030"]),
  v("mi", 27, "tamaiti", "child (one)", "noun", "high", ["mi-034"]),
  v("mi", 28, "tamariki", "children", "noun", "high", ["mi-035"]),
  v("mi", 29, "whānau", "extended family", "noun", "high", ["mi-028"]),
  v("mi", 30, "tahi", "one", "numeral", "high", ["mi-022"]),
  v("mi", 31, "rua", "two", "numeral", "high", ["mi-023"]),
  v("mi", 32, "toru", "three", "numeral", "high", ["mi-024"]),
  v("mi", 33, "wai", "water", "noun", "high", ["mi-040"]),
  v("mi", 34, "kai", "food; to eat", "noun / verb", "high", ["mi-041"]),
];

const MI_PATTERNS: Pattern[] = [
  {
    id: "mi-p1",
    languageId: "mi",
    label: "Tense lives in a particle before the verb",
    description:
      "The verb 'haere' (go) never changes form. Time is carried by a particle in front of it — a textbook minimal-pair set the corpus shows in full.",
    examples: [
      "I haere au — I went (past)",
      "Kei te haere au — I am going (present)",
      "Ka haere au — I will go (future)",
      "Kua haere au — I have gone (perfect)",
    ],
    confidence: "high",
  },
  {
    id: "mi-p2",
    languageId: "mi",
    label: "Number is marked on the article, not the noun",
    description:
      "'whare' (house) is identical in singular and plural. Only the article changes: te → ngā.",
    examples: ["te whare — the house", "ngā whare — the houses"],
    confidence: "high",
  },
  {
    id: "mi-p3",
    languageId: "mi",
    label: "Possessive 'my' shows number by dropping t-",
    description:
      "To go from one possessed thing to many, the initial t- of the possessive falls away: tāku → āku.",
    examples: ["tāku pene — my pen", "āku pene — my pens"],
    confidence: "high",
  },
  {
    id: "mi-p4",
    languageId: "mi",
    label: "Some nouns lengthen a vowel (macron) to pluralize",
    description:
      "A minority of nouns mark plural by lengthening the first vowel rather than changing the article.",
    examples: ["matua — parent", "mātua — parents"],
    confidence: "medium",
  },
  {
    id: "mi-p5",
    languageId: "mi",
    label: "Pronouns count people precisely",
    description:
      "Address forms distinguish one / two / three-or-more listeners — a feature English lacks.",
    examples: ["koe — you (1)", "kōrua — you (2)", "koutou — you (3+)"],
    confidence: "high",
  },
];

const MI_LESSON: Lesson = {
  id: "mi-lesson",
  languageId: "mi",
  createdAt: 1750000000000,
  title: "Your first words of te reo Māori",
  intro:
    "Start where every speaker starts — with warmth. Here are greetings, a few people, and one verb you can already bend through time.",
  cards: [
    { id: "mi-c1", prompt: "hello / be well", answer: "Kia ora", category: "greeting" },
    { id: "mi-c2", prompt: "greetings (formal, to one person)", answer: "Tēnā koe", category: "greeting" },
    { id: "mi-c3", prompt: "how are you?", answer: "Kei te pēhea koe?", category: "greeting" },
    { id: "mi-c4", prompt: "I am well", answer: "Kei te pai au", category: "everyday" },
    { id: "mi-c5", prompt: "thanks / kind regards", answer: "Ngā mihi", category: "everyday" },
    { id: "mi-c6", prompt: "extended family", answer: "whānau", category: "family" },
    { id: "mi-c7", prompt: "child", answer: "tamaiti", hint: "children = tamariki", category: "family" },
    { id: "mi-c8", prompt: "the house", answer: "te whare", category: "everyday" },
    { id: "mi-c9", prompt: "water", answer: "wai", category: "everyday" },
    { id: "mi-c10", prompt: "go", answer: "haere", category: "verb" },
    { id: "mi-c11", prompt: "I / me", answer: "au", category: "everyday" },
    { id: "mi-c12", prompt: "one", answer: "tahi", category: "number" },
  ],
  practice: [
    {
      target: "Kei te haere au",
      english: "I am going",
      usesVocab: ["kei te", "haere", "au"],
      note: "Present marker 'kei te' on the verb 'haere'.",
    },
    {
      target: "Ka noho au",
      english: "I will stay",
      usesVocab: ["ka", "noho", "au"],
      note: "Future marker 'ka' recombined with the known verb 'noho'.",
    },
    {
      target: "Kua kite au",
      english: "I have seen",
      usesVocab: ["kua", "kite", "au"],
      note: "Perfect marker 'kua' on the known verb 'kite'.",
    },
    {
      target: "I noho au",
      english: "I stayed",
      usesVocab: ["i", "noho", "au"],
      note: "Past marker 'i' applied to 'noho'.",
    },
    {
      target: "ngā tamariki",
      english: "the children",
      usesVocab: ["ngā", "tamariki"],
      note: "Plural article 'ngā' with the plural noun 'tamariki'.",
    },
  ],
};

// ---- Cherokee --------------------------------------------------------------

const CHR_VOCAB: VocabItem[] = [
  v("chr", 1, "ᎣᏏᏲ", "hello (formal)", "greeting", "high", ["chr-001"], "osiyo"),
  v("chr", 2, "ᏏᏲ", "hi (informal)", "greeting", "high", ["chr-002"], "siyo — a shortened osiyo"),
  v("chr", 3, "ᏙᎯᏧ", "how are you?", "greeting", "high", ["chr-003"], "dohitsu"),
  v("chr", 4, "ᏩᏙ", "thank you", "everyday", "high", ["chr-004"], "wado"),
  v("chr", 5, "ᎥᎥ", "yes", "everyday", "high", ["chr-005"], "vv"),
  v("chr", 6, "ᎥᏝ", "no", "everyday", "high", ["chr-006"], "vtla"),
  v("chr", 7, "Ꮭ", "not (negator)", "particle", "medium", ["chr-008"], "tla — seen in 'tla yigoliga'"),
  v("chr", 8, "ᏣᎳᎩ", "Cherokee (people / language)", "noun", "high", ["chr-015"], "tsalagi"),
  v("chr", 9, "ᏐᏬ", "one", "numeral", "medium", ["chr-009"], "sowo (also saquu in some dialects)"),
  v("chr", 10, "ᏔᎵ", "two", "numeral", "high", ["chr-010"], "tali"),
  v("chr", 11, "ᏦᎢ", "three", "numeral", "high", ["chr-011"], "tsoi"),
  v("chr", 12, "ᏅᎩ", "four", "numeral", "high", ["chr-012"], "nvgi"),
  v("chr", 13, "ᎯᏍᎩ", "five", "numeral", "high", ["chr-013"], "hisgi"),
  v("chr", 14, "ᏍᎪᎯ", "ten", "numeral", "high", ["chr-014"], "sgohi"),
];

const CHR_PATTERNS: Pattern[] = [
  {
    id: "chr-p1",
    languageId: "chr",
    label: "Greetings have a full and a shortened form",
    description:
      "The formal 'osiyo' shortens to 'siyo' in casual speech — the corpus shows both.",
    examples: ["ᎣᏏᏲ osiyo — hello", "ᏏᏲ siyo — hi"],
    confidence: "medium",
  },
  {
    id: "chr-p2",
    languageId: "chr",
    label: "Negation centers on a 'tla' particle",
    description:
      "'no' (ᎥᏝ vtla) and 'I don't understand' (Ꮭ ᏱᎪᎵᎦ tla yigoliga) both carry a tla- negator. With only 15 words, this is a lead, not a law — more data would confirm it.",
    examples: ["ᎥᏝ vtla — no", "Ꮭ ᏱᎪᎵᎦ tla yigoliga — I don't understand"],
    confidence: "low",
  },
];

const CHR_LESSON: Lesson = {
  id: "chr-lesson",
  languageId: "chr",
  createdAt: 1750000000000,
  title: "First words in Tsalagi",
  intro:
    "Sequoyah invented this syllabary in the 1820s and made a whole nation literate within years. Each character is a syllable — start by recognizing a few.",
  cards: [
    { id: "chr-c1", prompt: "hello (formal)", answer: "ᎣᏏᏲ", romanization: "osiyo", category: "greeting" },
    { id: "chr-c2", prompt: "hi (informal)", answer: "ᏏᏲ", romanization: "siyo", category: "greeting" },
    { id: "chr-c3", prompt: "how are you?", answer: "ᏙᎯᏧ?", romanization: "dohitsu", category: "greeting" },
    { id: "chr-c4", prompt: "thank you", answer: "ᏩᏙ", romanization: "wado", category: "everyday" },
    { id: "chr-c5", prompt: "yes", answer: "ᎥᎥ", romanization: "vv", category: "everyday" },
    { id: "chr-c6", prompt: "no", answer: "ᎥᏝ", romanization: "vtla", category: "everyday" },
    { id: "chr-c7", prompt: "one", answer: "ᏐᏬ", romanization: "sowo", category: "number" },
    { id: "chr-c8", prompt: "two", answer: "ᏔᎵ", romanization: "tali", category: "number" },
    { id: "chr-c9", prompt: "three", answer: "ᏦᎢ", romanization: "tsoi", category: "number" },
    { id: "chr-c10", prompt: "Cherokee (the language)", answer: "ᏣᎳᎩ", romanization: "tsalagi", category: "everyday" },
  ],
  practice: [
    {
      target: "ᎣᏏᏲ",
      english: "hello",
      usesVocab: ["ᎣᏏᏲ"],
      note: "Recognize the greeting on its own first.",
    },
    {
      target: "ᏙᎯᏧ?",
      english: "how are you?",
      usesVocab: ["ᏙᎯᏧ"],
      note: "A full question from one corpus phrase.",
    },
  ],
};

// ---- Lookup ----------------------------------------------------------------

const FIXTURES: Record<string, Omit<InductionResult, "generatedAt" | "corpusSize" | "source" | "model">> = {
  mi: { languageId: "mi", vocab: MI_VOCAB, patterns: MI_PATTERNS, lesson: MI_LESSON },
  chr: { languageId: "chr", vocab: CHR_VOCAB, patterns: CHR_PATTERNS, lesson: CHR_LESSON },
};

export function getFixture(languageId: string, corpusSize: number): InductionResult | null {
  const base = FIXTURES[languageId];
  if (!base) return null;
  return {
    ...base,
    corpusSize,
    generatedAt: Date.now(),
    model: MODEL,
    source: "fixture",
  };
}
