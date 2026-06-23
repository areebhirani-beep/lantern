import type { Phrase } from "../types";

// Verified, cited te reo Māori seed corpus.
// Macrons per Te Aka Māori Dictionary. The tense/aspect minimal pairs
// (i / kei te / e…ana / ka / kua + haere), te/ngā articles, tāku/āku
// possession, matua/mātua and tamaiti/tamariki plurals are deliberately
// included so the engine has real evidence to induce morphology from.
// Sources: Te Aka (maoridictionary.co.nz), Univ. of Auckland & Victoria Univ.
// of Wellington te reo resources, kupu.maori.nz, Omniglot.

const SEED_AT = 1750000000000;

function p(
  n: number,
  target: string,
  english: string,
  gloss: string,
  category: string,
  source: string,
  confidence: Phrase["confidence"] = "high",
): Phrase {
  return {
    id: `mi-${String(n).padStart(3, "0")}`,
    languageId: "mi",
    target,
    english,
    gloss,
    category,
    source,
    confidence,
    contributedBy: "seed",
    createdAt: SEED_AT,
  };
}

export const MAORI_PHRASES: Phrase[] = [
  p(1, "Kia ora", "Hello / be well (informal, to one person)", "Kia(let/may) ora(be.well)", "greeting", "Univ. of Auckland; Te Aka"),
  p(2, "Kia ora kōrua", "Hello to you two", "Kia(let) ora(be.well) kōrua(you.two)", "greeting", "Univ. of Auckland"),
  p(3, "Kia ora koutou katoa", "Hello to you all (three or more)", "Kia(let) ora(be.well) koutou(you.PL≥3) katoa(all)", "greeting", "Univ. of Auckland"),
  p(4, "Tēnā koe", "Greetings / hello (formal, to one person)", "Tēnā(greetings/that.by.you) koe(you.SG)", "greeting", "Univ. of Auckland; VUW"),
  p(5, "Tēnā kōrua", "Greetings (formal, to two people)", "Tēnā(greetings) kōrua(you.two)", "greeting", "Univ. of Auckland"),
  p(6, "Tēnā koutou katoa", "Greetings to you all (formal, three or more)", "Tēnā(greetings) koutou(you.PL≥3) katoa(all)", "greeting", "Univ. of Auckland"),
  p(7, "Mōrena", "Good morning", "Mōrena(good.morning) [loan from English 'morning']", "greeting", "Univ. of Auckland; VUW"),
  p(8, "Pō mārie", "Good night (peaceful night)", "Pō(night) mārie(peaceful)", "greeting", "Univ. of Auckland"),
  p(9, "Haere rā", "Goodbye (to the person leaving)", "Haere(go) rā(yonder/away)", "everyday", "Univ. of Auckland"),
  p(10, "E noho rā", "Goodbye (to the person staying)", "E(particle) noho(stay) rā(yonder)", "everyday", "Univ. of Auckland"),
  p(11, "Ka kite anō", "See you again", "Ka(TAM) kite(see) anō(again)", "everyday", "Univ. of Auckland"),
  p(12, "Ngā mihi", "Thanks / kind regards", "Ngā(the.PL) mihi(greetings/acknowledgements)", "everyday", "Univ. of Auckland"),
  p(13, "Kei te pēhea koe?", "How are you?", "Kei te(PRES) pēhea(how) koe(you.SG)", "everyday", "Univ. of Auckland"),
  p(14, "Kei te pai au", "I am well / fine", "Kei te(PRES) pai(good) au(I)", "everyday", "Univ. of Auckland"),
  p(15, "I haere au", "I went", "I(PAST) haere(go) au(I)", "sentence", "kupu.maori.nz"),
  p(16, "Kei te haere au", "I am going", "Kei te(PRES/PROG) haere(go) au(I)", "sentence", "kupu.maori.nz"),
  p(17, "E haere ana au", "I am going / I go", "E(TAM) haere(go) ana(continuous) au(I)", "sentence", "kupu.maori.nz"),
  p(18, "Ka haere au", "I will go", "Ka(TAM/future-inceptive) haere(go) au(I)", "sentence", "kupu.maori.nz"),
  p(19, "Kua haere au", "I have gone", "Kua(TAM/perfect) haere(go) au(I)", "sentence", "kupu.maori.nz"),
  p(20, "Kei te noho au i Pukerua Bay", "I am living in Pukerua Bay", "Kei te(PRES) noho(live) au(I) i(LOC) Pukerua-Bay(place)", "sentence", "kupu.maori.nz"),
  p(21, "E noho ana au i Pukerua Bay", "I live in Pukerua Bay", "E(TAM) noho(live) ana(continuous) au(I) i(LOC) Pukerua-Bay(place)", "sentence", "kupu.maori.nz"),
  p(22, "tahi", "one (1)", "tahi(one)", "number", "Omniglot"),
  p(23, "rua", "two (2)", "rua(two)", "number", "Omniglot"),
  p(24, "toru", "three (3)", "toru(three)", "number", "Omniglot"),
  p(25, "whā", "four (4)", "whā(four)", "number", "Omniglot"),
  p(26, "rima", "five (5)", "rima(five)", "number", "Omniglot"),
  p(27, "tekau", "ten (10)", "tekau(ten)", "number", "Omniglot"),
  p(28, "whānau", "extended family, family group; (verb) to be born", "whānau(extended.family / be.born)", "family", "Te Aka"),
  p(29, "matua", "father, parent (singular)", "matua(parent.SG)", "family", "Te Aka"),
  p(30, "mātua", "parents (plural of matua)", "mātua(parent.PL), plural by macron lengthening of first vowel", "family", "Te Aka"),
  p(31, "whaea", "mother, aunt", "whaea(mother/aunt)", "family", "Te Aka"),
  p(32, "tama", "son, boy, nephew", "tama(son/boy)", "family", "Te Aka"),
  p(33, "tamāhine", "daughter, girl", "tamāhine(daughter/girl)", "family", "Te Aka"),
  p(34, "tamaiti", "child (singular)", "tamaiti(child.SG)", "family", "Te Aka"),
  p(35, "tamariki", "children (used only in the plural)", "tamariki(child.PL), suppletive/irregular plural of tamaiti", "family", "Te Aka"),
  p(36, "te whare", "the house (singular)", "te(the.SG) whare(house)", "sentence", "kupu.maori.nz; VUW"),
  p(37, "ngā whare", "the houses (plural)", "ngā(the.PL) whare(house), plural marked on the article, noun unchanged", "sentence", "kupu.maori.nz"),
  p(38, "tāku pene", "my pen (one pen)", "tāku(my.SG) pene(pen)", "sentence", "kupu.maori.nz"),
  p(39, "āku pene", "my pens (more than one)", "āku(my.PL) pene(pen), possessor pluralised by dropping t-", "sentence", "kupu.maori.nz"),
  p(40, "wai", "water", "wai(water)", "everyday", "VUW"),
  p(41, "kai", "food; (verb) to eat", "kai(food / eat)", "everyday", "Te Aka"),
];
