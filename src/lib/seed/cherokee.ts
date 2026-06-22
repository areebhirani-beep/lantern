import type { Phrase } from "../types";

// Verified Cherokee (Tsalagi) seed corpus. The syllabary strings are the
// authoritative forms (high confidence); romanization is not fully
// standardized across sources, so a couple of items are marked medium.
// Sources: DAILP (Northeastern Univ.), Cherokee Nation Language Dept.,
// Native History Association, Omniglot, Wikipedia (Cherokee language).

const SEED_AT = 1750000000000;

function p(
  n: number,
  target: string,
  romanization: string,
  english: string,
  category: string,
  source: string,
  confidence: Phrase["confidence"] = "high",
): Phrase {
  return {
    id: `chr-${String(n).padStart(3, "0")}`,
    languageId: "chr",
    target,
    romanization,
    english,
    category,
    source,
    confidence,
    contributedBy: "seed",
    createdAt: SEED_AT,
  };
}

export const CHEROKEE_PHRASES: Phrase[] = [
  p(1, "ᎣᏏᏲ", "osiyo", "hello (general / formal greeting)", "greeting", "DAILP; Cherokee Nation; Omniglot"),
  p(2, "ᏏᏲ", "siyo", "hi (informal, shortened)", "greeting", "DAILP; Omniglot"),
  p(3, "ᏙᎯᏧ?", "dohitsu?", "how are you?", "greeting", "DAILP; Native History Assoc."),
  p(4, "ᏩᏙ", "wado", "thank you", "everyday", "Native History Assoc.; Omniglot"),
  p(5, "ᎥᎥ", "vv", "yes", "everyday", "Omniglot"),
  p(6, "ᎥᏝ", "vtla", "no", "everyday", "Omniglot"),
  p(7, "ᎤᎵᎮᎵᏍᏗ", "ulihelisdi", "welcome", "greeting", "Omniglot", "medium"),
  p(8, "Ꮭ ᏱᎪᎵᎦ", "tla yigoliga", "I don't understand", "everyday", "Native History Assoc.; Omniglot"),
  p(9, "ᏐᏬ", "sowo", "one (1)", "number", "Omniglot", "medium"),
  p(10, "ᏔᎵ", "tali", "two (2)", "number", "Omniglot"),
  p(11, "ᏦᎢ", "tsoi", "three (3)", "number", "Omniglot"),
  p(12, "ᏅᎩ", "nvgi", "four (4)", "number", "Omniglot"),
  p(13, "ᎯᏍᎩ", "hisgi", "five (5)", "number", "Omniglot"),
  p(14, "ᏍᎪᎯ", "sgohi", "ten (10)", "number", "Omniglot"),
  p(15, "ᏣᎳᎩ", "tsalagi", "Cherokee (the people / the language)", "everyday", "Cherokee Nation; Wikipedia"),
];
