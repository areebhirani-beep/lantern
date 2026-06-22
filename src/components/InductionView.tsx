import { Sparkles, BookOpen, Quote } from "lucide-react";
import type { InductionResult, Language } from "@/lib/types";
import { ConfidenceDot } from "./ui";

export function InductionView({
  language,
  induction,
}: {
  language: Language;
  induction: InductionResult;
}) {
  const isSyllabary = language.script === "syllabary";

  return (
    <div className="space-y-10">
      {/* provenance line */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-faint">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-ember" />
          {induction.source === "ai" ? (
            <>Induced live by <span className="text-muted">{induction.model}</span></>
          ) : (
            <>Verified reference induction</>
          )}
        </span>
        <span>·</span>
        <span>
          from <span className="text-muted">{induction.corpusSize}</span> cited phrases
        </span>
        <span>·</span>
        <span>
          <span className="text-muted">{induction.vocab.length}</span> words ·{" "}
          <span className="text-muted">{induction.patterns.length}</span> patterns
        </span>
      </div>

      {/* patterns */}
      {induction.patterns.length > 0 && (
        <div>
          <h3 className="font-display text-xl text-cream">Grammar the engine found</h3>
          <p className="mt-1 text-sm text-muted">
            Regularities induced from minimal pairs in the corpus — not from
            outside knowledge.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {induction.patterns.map((p) => (
              <div key={p.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-medium text-cream">{p.label}</h4>
                  <ConfidenceDot level={p.confidence} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
                <ul className="mt-3 space-y-1">
                  {p.examples.map((ex, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-faint"
                    >
                      <Quote className="mt-0.5 h-3 w-3 shrink-0 text-line" />
                      <span className={isSyllabary ? "font-display" : ""}>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* vocab bank */}
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-ember" />
          <h3 className="font-display text-xl text-cream">Vocabulary bank</h3>
        </div>
        <p className="mt-1 text-sm text-muted">
          Every entry is aligned to a meaning and traceable to the phrases that
          attest it.
        </p>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {induction.vocab.map((v) => (
            <div key={v.id} className="card flex flex-col p-4">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`text-lg text-cream ${isSyllabary ? "font-display" : "font-medium"}`}
                >
                  {v.form}
                </span>
                <ConfidenceDot level={v.confidence} />
              </div>
              <span className="mt-0.5 text-sm text-muted">{v.meaning}</span>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-faint">
                {v.pos && (
                  <span className="rounded-full bg-surface-2 px-2 py-0.5">{v.pos}</span>
                )}
                <span>{v.evidence.length} cited</span>
              </div>
              {v.notes && (
                <span className="mt-2 text-[11px] italic leading-snug text-faint">
                  {v.notes}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
