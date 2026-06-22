import { MongoClient, type Db } from "mongodb";
import type { ArkStats, InductionResult, Phrase } from "./types";
import { LANGUAGES } from "./languages";
import { SEED_PHRASES } from "./seed";

// ---------------------------------------------------------------------------
// The living corpus, behind one interface. In-memory by default (zero config,
// always works), MongoDB Atlas when MONGODB_URI is set (persistent + unlocks
// the Atlas award). Adding a phrase invalidates that language's cached
// induction — so the next visit re-derives richer materials. That is the
// flywheel, expressed in code.
// ---------------------------------------------------------------------------

export interface Store {
  getPhrases(languageId: string): Promise<Phrase[]>;
  addPhrase(input: {
    languageId: string;
    target: string;
    english: string;
    romanization?: string;
    category?: string;
    contributedBy?: string;
  }): Promise<Phrase>;
  getInduction(languageId: string): Promise<InductionResult | null>;
  saveInduction(result: InductionResult): Promise<void>;
  recordContribution(languageId: string): Promise<void>;
  getStats(): Promise<ArkStats>;
}

function newId(languageId: string): string {
  return `${languageId}-u${Math.random().toString(36).slice(2, 8)}`;
}

function makePhrase(input: {
  languageId: string;
  target: string;
  english: string;
  romanization?: string;
  category?: string;
  contributedBy?: string;
}): Phrase {
  return {
    id: newId(input.languageId),
    languageId: input.languageId,
    target: input.target.trim(),
    english: input.english.trim(),
    romanization: input.romanization?.trim() || undefined,
    category: input.category?.trim() || "everyday",
    confidence: "medium",
    contributedBy: input.contributedBy?.trim() || "community",
    createdAt: Date.now(),
  };
}

// ---- In-memory store -------------------------------------------------------

interface MemState {
  phrases: Map<string, Phrase[]>;
  inductions: Map<string, InductionResult>;
  contributions: { languageId: string; at: number }[];
}

function freshMemState(): MemState {
  const phrases = new Map<string, Phrase[]>();
  for (const [lang, list] of Object.entries(SEED_PHRASES)) {
    phrases.set(lang, [...list]);
  }
  return { phrases, inductions: new Map(), contributions: [] };
}

class InMemoryStore implements Store {
  constructor(private state: MemState) {}

  async getPhrases(languageId: string): Promise<Phrase[]> {
    return this.state.phrases.get(languageId) ?? [];
  }

  async addPhrase(input: Parameters<Store["addPhrase"]>[0]): Promise<Phrase> {
    const phrase = makePhrase(input);
    const list = this.state.phrases.get(input.languageId) ?? [];
    list.push(phrase);
    this.state.phrases.set(input.languageId, list);
    this.state.inductions.delete(input.languageId); // invalidate → re-induce
    return phrase;
  }

  async getInduction(languageId: string): Promise<InductionResult | null> {
    return this.state.inductions.get(languageId) ?? null;
  }

  async saveInduction(result: InductionResult): Promise<void> {
    this.state.inductions.set(result.languageId, result);
  }

  async recordContribution(languageId: string): Promise<void> {
    this.state.contributions.push({ languageId, at: Date.now() });
  }

  async getStats(): Promise<ArkStats> {
    let phrases = 0;
    for (const list of this.state.phrases.values()) phrases += list.length;
    let vocab = 0;
    for (const ind of this.state.inductions.values()) vocab += ind.vocab.length;
    return {
      languages: LANGUAGES.length,
      phrases,
      vocab,
      contributions: this.state.contributions.length,
      recentContributions: this.state.contributions.slice(-12).reverse(),
    };
  }
}

// ---- MongoDB store ---------------------------------------------------------

class MongoStore implements Store {
  constructor(private db: Db) {}

  private phrasesCol() {
    return this.db.collection<Phrase>("phrases");
  }

  private async ensureSeeded(languageId: string): Promise<void> {
    const count = await this.phrasesCol().countDocuments({ languageId });
    if (count === 0 && SEED_PHRASES[languageId]?.length) {
      await this.phrasesCol().insertMany(SEED_PHRASES[languageId]);
    }
  }

  async getPhrases(languageId: string): Promise<Phrase[]> {
    await this.ensureSeeded(languageId);
    return this.phrasesCol()
      .find({ languageId }, { projection: { _id: 0 } })
      .sort({ createdAt: 1 })
      .toArray();
  }

  async addPhrase(input: Parameters<Store["addPhrase"]>[0]): Promise<Phrase> {
    const phrase = makePhrase(input);
    await this.phrasesCol().insertOne({ ...phrase });
    await this.db.collection("inductions").deleteOne({ languageId: input.languageId });
    return phrase;
  }

  async getInduction(languageId: string): Promise<InductionResult | null> {
    const doc = await this.db
      .collection<InductionResult>("inductions")
      .findOne({ languageId }, { projection: { _id: 0 } });
    return doc ?? null;
  }

  async saveInduction(result: InductionResult): Promise<void> {
    await this.db
      .collection("inductions")
      .replaceOne({ languageId: result.languageId }, result, { upsert: true });
  }

  async recordContribution(languageId: string): Promise<void> {
    await this.db.collection("contributions").insertOne({ languageId, at: Date.now() });
  }

  async getStats(): Promise<ArkStats> {
    const [phrases, contributions, inductions, recent] = await Promise.all([
      this.phrasesCol().countDocuments({}),
      this.db.collection("contributions").countDocuments({}),
      this.db.collection<InductionResult>("inductions").find({}).toArray(),
      this.db
        .collection<{ languageId: string; at: number }>("contributions")
        .find({}, { projection: { _id: 0 } })
        .sort({ at: -1 })
        .limit(12)
        .toArray(),
    ]);
    const vocab = inductions.reduce((n, i) => n + (i.vocab?.length ?? 0), 0);
    return {
      languages: LANGUAGES.length,
      phrases,
      vocab,
      contributions,
      recentContributions: recent,
    };
  }
}

// ---- Singleton resolution (survives dev HMR via globalThis) ----------------

const g = globalThis as unknown as {
  __lanternMem?: MemState;
  __lanternMongo?: { client: MongoClient; db: Db };
};

async function getMongoStore(uri: string): Promise<Store> {
  if (!g.__lanternMongo) {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || "lantern");
    g.__lanternMongo = { client, db };
  }
  return new MongoStore(g.__lanternMongo.db);
}

function getMemStore(): Store {
  if (!g.__lanternMem) g.__lanternMem = freshMemState();
  return new InMemoryStore(g.__lanternMem);
}

/** Resolve the active store. Mongo if configured, in-memory otherwise. */
export async function getStore(): Promise<Store> {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      return await getMongoStore(uri);
    } catch (err) {
      console.error("[store] Mongo connection failed, using in-memory:", err);
    }
  }
  return getMemStore();
}

export function isPersistent(): boolean {
  return Boolean(process.env.MONGODB_URI);
}
