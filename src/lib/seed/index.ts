import type { Phrase } from "../types";
import { MAORI_PHRASES } from "./maori";
import { CHEROKEE_PHRASES } from "./cherokee";

/** Verified seed phrases, keyed by language id. The ground truth corpus. */
export const SEED_PHRASES: Record<string, Phrase[]> = {
  mi: MAORI_PHRASES,
  chr: CHEROKEE_PHRASES,
};

export const ALL_SEED_PHRASES: Phrase[] = [
  ...MAORI_PHRASES,
  ...CHEROKEE_PHRASES,
];

export function seedPhrasesFor(languageId: string): Phrase[] {
  return SEED_PHRASES[languageId] ?? [];
}
