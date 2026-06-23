"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import type { Language, Phrase } from "@/lib/types";

const CATEGORIES = ["greeting", "everyday", "sentence", "number", "family"];

export function ContributeForm({
  language,
  onContributed,
}: {
  language: Language;
  onContributed: (phrase: Phrase) => void;
}) {
  const [target, setTarget] = useState("");
  const [english, setEnglish] = useState("");
  const [romanization, setRomanization] = useState("");
  const [category, setCategory] = useState("everyday");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSyllabary = language.script === "syllabary";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!target.trim() || !english.trim()) {
      setError("Both the phrase and its meaning are required.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId: language.id,
          target: target.trim(),
          english: english.trim(),
          romanization: romanization.trim() || undefined,
          category,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not add that phrase.");
      }
      const { phrase } = await res.json();
      setTarget("");
      setEnglish("");
      setRomanization("");
      onContributed(phrase);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <h3 className="font-display text-xl text-cream">Add a phrase</h3>
      <p className="mt-1 text-sm text-muted">
        Every phrase you add becomes part of the corpus, and the engine
        re-derives a richer course. This is how the ark grows.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Phrase in {language.name}
          </label>
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={isSyllabary ? "ᎣᏏᏲ" : "Kia ora"}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-cream outline-none placeholder:text-faint focus:border-ember/60"
          />
        </div>

        {isSyllabary && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              Romanization <span className="text-faint">(optional)</span>
            </label>
            <input
              value={romanization}
              onChange={(e) => setRomanization(e.target.value)}
              placeholder="osiyo"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-cream outline-none placeholder:text-faint focus:border-ember/60"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            What it means in English
          </label>
          <input
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="hello / be well"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-cream outline-none placeholder:text-faint focus:border-ember/60"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors ${
                  category === c
                    ? "border-ember/60 bg-ember/10 text-ember"
                    : "border-line text-muted hover:text-cream"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ember px-5 font-medium text-ink transition-transform hover:scale-[1.03] disabled:opacity-60"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Adding…
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> Add to the corpus
          </>
        )}
      </button>
    </form>
  );
}
