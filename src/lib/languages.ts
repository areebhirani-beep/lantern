import type { Language } from "./types";

// ---------------------------------------------------------------------------
// The curated registry of languages in the Lantern Ark.
// `mi` (Māori) and `chr` (Cherokee) ship with verified, cited seed corpora and
// are fully inducible. The rest populate the Ark to show the mission's scale, // including the near-silent (Ainu, ~10 speakers) and the brought-back-from-
// dormant (Manx, Cornish), which prove revival is possible.
// Figures follow the UNESCO Atlas of the World's Languages in Danger framing.
// ---------------------------------------------------------------------------

export const LANGUAGES: Language[] = [
  {
    id: "mi",
    name: "Māori",
    endonym: "te reo Māori",
    iso639: "mi",
    status: "vulnerable",
    region: "Aotearoa New Zealand",
    speakers: "~50,000 highly fluent; a national revival underway",
    color: "#34d8a6", // pounamu, greenstone
    script: "latin",
    blurb:
      "The poster child for revival: from near-loss to kōhanga reo immersion nests and a Māori Language Act. Proof it can be done.",
    ttsLang: "mi-NZ",
    featured: true,
  },
  {
    id: "chr",
    name: "Cherokee",
    endonym: "ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ (Tsalagi Gawonihisdi)",
    iso639: "chr",
    status: "critically-endangered",
    region: "Oklahoma & North Carolina, USA",
    speakers: "~1,500–2,000 first-language speakers, most over 50",
    color: "#ff8a5b", // fire
    script: "syllabary",
    blurb:
      "Sequoyah's syllabary made the Cherokee literate in a generation. Today fluent speakers are counted in the hundreds.",
    ttsLang: "chr",
  },
  {
    id: "haw",
    name: "Hawaiian",
    endonym: "ʻŌlelo Hawaiʻi",
    iso639: "haw",
    status: "critically-endangered",
    region: "Hawaiʻi, USA",
    speakers: "~24,000 speakers; immersion schooling rebuilding fluency",
    color: "#5ec5c0", // lagoon
    script: "latin",
    blurb:
      "Banned in schools for decades, now taught in Pūnana Leo immersion nests, a revival that helped inspire Māori kōhanga reo.",
    ttsLang: "haw",
  },
  {
    id: "ain",
    name: "Ainu",
    endonym: "アイヌ・イタㇰ (Aynu itak)",
    iso639: "ain",
    status: "critically-endangered",
    region: "Hokkaidō, Japan",
    speakers: "~10 native speakers, a language at the edge of silence",
    color: "#7aa2ff", // snow
    script: "latin",
    blurb:
      "An isolate with no proven relatives. Each elder lost takes irreplaceable grammar, story, and song with them.",
  },
  {
    id: "gv",
    name: "Manx",
    endonym: "Gaelg",
    iso639: "gv",
    status: "severely-endangered",
    region: "Isle of Man",
    speakers: "Declared 'extinct' in 2009, then brought back by its children",
    color: "#e2574c",
    script: "latin",
    blurb:
      "Its last native speaker died in 1974. A bunscoill immersion school has since raised a new generation of speakers.",
  },
  {
    id: "kw",
    name: "Cornish",
    endonym: "Kernewek",
    iso639: "kw",
    status: "severely-endangered",
    region: "Cornwall, UK",
    speakers: "Revived from dormant; a few hundred fluent today",
    color: "#ffcf5c",
    script: "latin",
    blurb:
      "Functionally dormant by ~1800, reconstructed from texts in the 20th century, and now spoken at home again by some families.",
  },
  {
    id: "nv",
    name: "Navajo",
    endonym: "Diné bizaad",
    iso639: "nv",
    status: "vulnerable",
    region: "Southwestern USA",
    speakers: "~150,000 speakers, but fewer children learning it",
    color: "#d98a5b", // canyon
    script: "latin",
    blurb:
      "The Code Talkers' language. Still widely spoken, yet intergenerational transmission is thinning fast.",
  },
  {
    id: "yi",
    name: "Yiddish",
    endonym: "ייִדיש",
    iso639: "yi",
    status: "definitely-endangered",
    region: "Diaspora, worldwide",
    speakers: "Resilient in some communities; lost in many others",
    color: "#b58bff",
    script: "latin",
    blurb:
      "A thousand years of Ashkenazi life carried in one language, devastated in the 20th century, quietly persisting now.",
  },
];

const BY_ID = new Map(LANGUAGES.map((l) => [l.id, l]));

export function getLanguageMeta(id: string): Language | undefined {
  return BY_ID.get(id);
}

/** Languages that ship with a real, inducible seed corpus. */
export const INDUCIBLE_LANGUAGE_IDS = ["mi", "chr"] as const;

export function isInducible(id: string): boolean {
  return (INDUCIBLE_LANGUAGE_IDS as readonly string[]).includes(id);
}
