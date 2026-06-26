"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, RotateCcw, Check } from "lucide-react";
import type { Flashcard, Language, Lesson } from "@/lib/types";
import { type Grade, type SrsState, initSrs, review } from "@/lib/srs";
import { speak, ttsSupported } from "@/lib/tts";

type SrsMap = Record<string, SrsState>;

function loadSrs(langId: string): SrsMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(`lantern:srs:${langId}`) || "{}");
  } catch {
    return {};
  }
}

function saveSrs(langId: string, map: SrsMap) {
  try {
    localStorage.setItem(`lantern:srs:${langId}`, JSON.stringify(map));
  } catch {
    /* ignore quota */
  }
}

const GRADES: { label: string; grade: Grade; cls: string }[] = [
  { label: "Again", grade: 1, cls: "border-rose-400/40 text-rose-300 hover:bg-rose-400/10" },
  { label: "Hard", grade: 3, cls: "border-amber-400/40 text-amber-300 hover:bg-amber-400/10" },
  { label: "Good", grade: 4, cls: "border-pounamu/40 text-pounamu hover:bg-pounamu/10" },
  { label: "Easy", grade: 5, cls: "border-pounamu/40 text-pounamu hover:bg-pounamu/10" },
];

export function Flashcards({
  language,
  lesson,
}: {
  language: Language;
  lesson: Lesson;
}) {
  const total = lesson.cards.length;
  const [session, setSession] = useState<Flashcard[]>(lesson.cards);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [srs, setSrs] = useState<SrsMap>({});

  useEffect(() => setSrs(loadSrs(language.id)), [language.id]);

  const card = session[pos];
  const done = pos >= session.length;
  const canSpeak = ttsSupported();

  const reveal = useCallback(() => {
    setFlipped(true);
    if (card) speak(card.answer, language.ttsLang);
  }, [card, language.ttsLang]);

  const grade = useCallback(
    (g: Grade) => {
      if (!card) return;
      const now = Date.now();
      const next = review(srs[card.id] ?? initSrs(now), g, now);
      const nextMap = { ...srs, [card.id]: next };
      setSrs(nextMap);
      saveSrs(language.id, nextMap);

      setLearned((prev) => {
        const s = new Set(prev);
        if (g >= 3) s.add(card.id);
        return s;
      });

      // failed recall → re-drill this card later in the session
      if (g < 3) setSession((prev) => [...prev, card]);

      setFlipped(false);
      setPos((p) => p + 1);
    },
    [card, srs, language.id],
  );

  const restart = () => {
    setSession(lesson.cards);
    setPos(0);
    setFlipped(false);
    setLearned(new Set());
  };

  const progress = useMemo(
    () => Math.round((learned.size / Math.max(1, total)) * 100),
    [learned, total],
  );

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-[14px] border border-line bg-ink p-12 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-pounamu/15 text-pounamu">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl text-cream">
          You learned {learned.size} {learned.size === 1 ? "word" : "words"} of{" "}
          {language.name}.
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          An hour ago this course did not exist. Your reviews are saved, come
          back and the spacing will bring them up again.
        </p>
        <button
          onClick={restart}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-cream hover:bg-surface"
        >
          <RotateCcw className="h-4 w-4" /> Study again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* progress */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-pounamu transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted">
          {learned.size}/{total}
        </span>
      </div>

      {/* card */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.button
            key={`${card.id}-${flipped}`}
            onClick={() => (flipped ? undefined : reveal())}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[16rem] w-full flex-col items-center justify-center gap-4 rounded-[14px] border border-line bg-ink p-10 text-center shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]"
          >
            {!flipped ? (
              <>
                <span className="text-xs uppercase tracking-[0.2em] text-faint">
                  {card.category || "word"}
                </span>
                <span className="font-display text-3xl text-cream">{card.prompt}</span>
                <span className="mt-2 text-xs text-faint">tap to reveal</span>
              </>
            ) : (
              <>
                <span
                  className={`text-cream ${
                    language.script === "syllabary"
                      ? "font-display text-5xl"
                      : "font-display text-4xl"
                  }`}
                >
                  {card.answer}
                </span>
                {card.romanization && (
                  <span className="text-lg text-muted">{card.romanization}</span>
                )}
                {card.hint && (
                  <span className="text-xs text-faint">{card.hint}</span>
                )}
                {canSpeak && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(card.answer, language.ttsLang);
                    }}
                    className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:text-cream"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> hear it
                  </span>
                )}
              </>
            )}
          </motion.button>
        </AnimatePresence>
      </div>

      {/* grading */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {GRADES.map((g) => (
          <button
            key={g.label}
            disabled={!flipped}
            onClick={() => grade(g.grade)}
            className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${g.cls}`}
          >
            {g.label}
          </button>
        ))}
      </div>
      {!canSpeak && (
        <p className="mt-3 text-center text-xs text-faint">
          Audio isn&rsquo;t available in this browser, pronunciation playback is
          disabled.
        </p>
      )}
    </div>
  );
}
