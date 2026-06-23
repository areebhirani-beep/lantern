"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Layers,
  GraduationCap,
  Plus,
  MapPin,
  Users,
  Sparkles,
  AlertCircle,
  Info,
  ArrowLeft,
} from "lucide-react";
import type { InductionResult, Language, Phrase } from "@/lib/types";
import { StatusBadge } from "./ui";
import { InductionView } from "./InductionView";
import { Flashcards } from "./Flashcards";
import { ContributeForm } from "./ContributeForm";

type Tab = "structure" | "learn" | "contribute";
type Status = "idle" | "inducing" | "ready" | "error" | "empty";

const LOADER_STEPS = [
  "Reading the corpus",
  "Aligning words to meanings",
  "Inducing grammar from minimal pairs",
  "Building your lesson",
];

export function Workspace({
  language,
  initialPhrases,
}: {
  language: Language;
  initialPhrases: Phrase[];
}) {
  const [phrases, setPhrases] = useState<Phrase[]>(initialPhrases);
  const [induction, setInduction] = useState<InductionResult | null>(null);
  const [status, setStatus] = useState<Status>(
    initialPhrases.length === 0 ? "empty" : "idle",
  );
  const [tab, setTab] = useState<Tab>("structure");
  const [error, setError] = useState<string | null>(null);
  const [grewTo, setGrewTo] = useState<number | null>(null);

  const induce = useCallback(
    async (force = false) => {
      setStatus("inducing");
      setError(null);
      try {
        const res = await fetch("/api/induce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ languageId: language.id, force }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Induction failed.");
        }
        const { induction } = await res.json();
        setInduction(induction);
        setStatus("ready");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      }
    },
    [language.id],
  );

  useEffect(() => {
    if (status === "idle") induce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onContributed = useCallback(
    (phrase: Phrase) => {
      setPhrases((prev) => {
        const next = [...prev, phrase];
        setGrewTo(next.length);
        return next;
      });
      setStatus((s) => (s === "empty" ? "idle" : s));
      setTab("structure");
      induce(true);
    },
    [induce],
  );

  return (
    <main className="mx-auto max-w-5xl px-5 pb-16 pt-10">
      {/* header */}
      <Link
        href="/ark"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-cream"
      >
        <ArrowLeft className="h-4 w-4" /> The Living Ark
      </Link>
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="h-3.5 w-3.5 rounded-full"
            style={{ backgroundColor: language.color, boxShadow: `0 0 14px ${language.color}` }}
          />
          <h1 className="font-display text-4xl text-cream sm:text-5xl">{language.name}</h1>
          <StatusBadge status={language.status} />
        </div>
        <p className="font-display text-lg text-muted">
          {language.endonym}
          <span className="text-faint">, what its speakers call it</span>
        </p>
        <p className="max-w-2xl leading-relaxed text-muted">{language.blurb}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-faint">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {language.region}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {language.speakers}
          </span>
        </div>
      </div>

      {/* what is this page */}
      <div className="mt-6 flex gap-3 rounded-2xl border border-line bg-surface/40 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
        <p className="text-sm leading-relaxed text-muted">
          Lantern read{" "}
          <span className="text-cream">{phrases.length} real phrases</span> this
          community remembers, worked out the grammar, and built a course from
          them, without inventing a single word.{" "}
          <span className="text-cream">Structure</span> shows what it found,{" "}
          <span className="text-cream">Learn</span> is the course, and{" "}
          <span className="text-cream">Contribute</span> grows it. New here? Start
          with <span className="text-ember">Learn</span>.
        </p>
      </div>

      {/* flywheel toast */}
      <AnimatePresence>
        {grewTo !== null && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setTimeout(() => setGrewTo(null), 2600)}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-pounamu/30 bg-pounamu/10 px-4 py-2 text-sm text-pounamu"
          >
            <Sparkles className="h-4 w-4" />
            Corpus grew to {grewTo} phrases, re-deriving the course…
          </motion.div>
        )}
      </AnimatePresence>

      {/* tabs */}
      <div className="mt-8 flex gap-1 border-b border-line">
        {[
          { id: "structure", label: "Structure", icon: Layers },
          { id: "learn", label: "Learn", icon: GraduationCap },
          { id: "contribute", label: "Contribute", icon: Plus },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.id ? "text-cream" : "text-muted hover:text-cream"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-ember"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {/* STRUCTURE */}
        {tab === "structure" && (
          <>
            {status === "empty" && (
              <EmptyState language={language} onGo={() => setTab("contribute")} />
            )}
            {status === "inducing" && <InductionLoader />}
            {status === "error" && (
              <ErrorState message={error} onRetry={() => induce(true)} />
            )}
            {status === "ready" && induction && (
              <div className="space-y-12">
                <InductionView language={language} induction={induction} />
                <CorpusPanel phrases={phrases} language={language} />
              </div>
            )}
          </>
        )}

        {/* LEARN */}
        {tab === "learn" && (
          <div className="mx-auto max-w-xl">
            {induction ? (
              <>
                <div className="mb-6">
                  <h2 className="font-display text-2xl text-cream">
                    {induction.lesson.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{induction.lesson.intro}</p>
                </div>
                <Flashcards language={language} lesson={induction.lesson} />
                <PracticeList induction={induction} language={language} />
              </>
            ) : (
              <p className="text-muted">Induce the structure first to build a lesson.</p>
            )}
          </div>
        )}

        {/* CONTRIBUTE */}
        {tab === "contribute" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <ContributeForm language={language} onContributed={onContributed} />
            <CorpusPanel phrases={phrases} language={language} />
          </div>
        )}
      </div>
    </main>
  );
}

// ---- sub-views -------------------------------------------------------------

function InductionLoader() {
  return (
    <div className="card flex flex-col items-center gap-6 p-12">
      <Loader2 className="h-7 w-7 animate-spin text-ember" />
      <div className="space-y-2.5 text-center">
        {LOADER_STEPS.map((s, i) => (
          <motion.p
            key={s}
            initial={{ opacity: 0.25 }}
            animate={{ opacity: [0.25, 1, 0.5] }}
            transition={{ duration: 1.6, delay: i * 0.5, repeat: Infinity, repeatDelay: 1.4 }}
            className="text-sm text-muted"
          >
            {s}
          </motion.p>
        ))}
      </div>
      <p className="text-xs text-faint">Reasoning only over the cited corpus.</p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="card flex flex-col items-center p-12 text-center">
      <AlertCircle className="h-7 w-7 text-rose-300" />
      <p className="mt-4 max-w-sm text-sm text-muted">
        {message || "The engine hit a snag."}
      </p>
      <button
        onClick={onRetry}
        className="mt-5 rounded-full border border-line px-5 py-2.5 text-sm text-cream hover:bg-surface"
      >
        Try again
      </button>
    </div>
  );
}

function EmptyState({
  language,
  onGo,
}: {
  language: Language;
  onGo: () => void;
}) {
  return (
    <div className="card flex flex-col items-center p-12 text-center">
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: language.color, boxShadow: `0 0 14px ${language.color}` }}
      />
      <h3 className="mt-5 font-display text-2xl text-cream">
        {language.name} is aboard the Ark, but silent.
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted">
        No one has seeded {language.endonym} yet. Add the first few phrases and
        watch the engine begin to learn it.
      </p>
      <button
        onClick={onGo}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-ink hover:scale-[1.03]"
      >
        <Plus className="h-4 w-4" /> Seed the first phrase
      </button>
    </div>
  );
}

function CorpusPanel({
  phrases,
  language,
}: {
  phrases: Phrase[];
  language: Language;
}) {
  const isSyllabary = language.script === "syllabary";
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-cream">The corpus</h3>
        <span className="text-xs text-faint">{phrases.length} phrases</span>
      </div>
      <p className="mt-1 text-sm text-muted">
        The ground truth. Everything the engine claims traces back here.
      </p>
      <div className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
        {phrases.map((p) => (
          <div key={p.id} className="card p-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className={`text-cream ${isSyllabary ? "font-display text-lg" : ""}`}>
                {p.target}
                {p.romanization && (
                  <span className="ml-2 text-sm text-faint">{p.romanization}</span>
                )}
              </span>
              <span className="shrink-0 text-xs text-muted">{p.english}</span>
            </div>
            {p.gloss && <p className="mt-1 text-[11px] text-faint">{p.gloss}</p>}
            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-faint">
              <span className="rounded-full bg-surface-2 px-1.5 py-0.5">{p.category}</span>
              {p.source && <span>{p.source}</span>}
              {p.contributedBy !== "seed" && (
                <span className="text-pounamu">· you</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticeList({
  induction,
  language,
}: {
  induction: InductionResult;
  language: Language;
}) {
  if (induction.lesson.practice.length === 0) return null;
  const isSyllabary = language.script === "syllabary";
  return (
    <div className="mt-10">
      <h3 className="font-display text-xl text-cream">Practice sentences</h3>
      <p className="mt-1 text-sm text-muted">
        Generated by recombining known words, every one passed an attestation
        check.
      </p>
      <div className="mt-4 space-y-2.5">
        {induction.lesson.practice.map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className={`text-cream ${isSyllabary ? "font-display text-lg" : ""}`}>
                {s.target}
              </span>
              <span className="shrink-0 text-sm text-muted">{s.english}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {s.usesVocab.map((w) => (
                <span
                  key={w}
                  className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-pounamu"
                >
                  {w}
                </span>
              ))}
            </div>
            {s.note && <p className="mt-2 text-[11px] italic text-faint">{s.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
