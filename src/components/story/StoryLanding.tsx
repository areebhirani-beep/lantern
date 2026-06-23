"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Sprout,
  Brain,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
import { StatusBadge } from "@/components/ui";
import {
  Atmosphere,
  EmberField,
  Gloss,
  HeroFlame,
  ScrollProgress,
  StoryReveal,
} from "./primitives";

// A small chip showing a real seed phrase + its meaning.
function Phrase({ mi, en }: { mi: string; en: string }) {
  return (
    <span className="inline-flex items-baseline gap-2 rounded-full border border-line bg-surface/70 px-3.5 py-1.5">
      <span className="font-display text-cream">{mi}</span>
      <span className="text-sm text-muted">{en}</span>
    </span>
  );
}

export function StoryLanding() {
  return (
    <div className="relative">
      <ScrollProgress />

      {/* ───────────────── 1 · The person ───────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
        <Atmosphere extra={<EmberField />} />
        <div className="relative">
          <StoryReveal>
            <div className="flex justify-center">
              <HeroFlame size={132} />
            </div>
          </StoryReveal>
          <StoryReveal delay={0.25}>
            <p className="mt-10 text-sm uppercase tracking-[0.3em] text-ember">
              A true story — like thousands of others
            </p>
          </StoryReveal>
          <StoryReveal delay={0.4}>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl leading-[1.1] tracking-tight text-cream sm:text-6xl md:text-7xl">
              My grandmother dreams in a
              <br className="hidden sm:block" /> language I was never taught.
            </h1>
          </StoryReveal>
          <StoryReveal delay={0.6}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              She speaks{" "}
              <Gloss term="te reo Māori" meaning="the language of the Māori, the first people of New Zealand" />.
              She is one of the last in our family who does.
            </p>
          </StoryReveal>
        </div>
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-faint">
          <span className="text-xs tracking-widest">SCROLL</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </section>

      {/* ───────────────── 2 · The loss ───────────────── */}
      <section className="relative mx-auto max-w-3xl px-5 py-40 text-center">
        <StoryReveal>
          <p className="font-display text-3xl leading-snug text-cream sm:text-5xl">
            Every two weeks, somewhere on Earth, a language takes its last breath.
          </p>
        </StoryReveal>
        <StoryReveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-muted">
            Of the world&rsquo;s ~7,000 languages, nearly half are expected to fall
            silent within a lifetime. When the last speaker goes, the words, the
            grammar, and an entire way of seeing the world usually go unwritten —
            because no one had the time to write them down.
          </p>
        </StoryReveal>
        <StoryReveal delay={0.3}>
          <p className="mt-10 font-display text-2xl text-ember sm:text-3xl">
            Hers is on that list.
          </p>
        </StoryReveal>
      </section>

      {/* ───────────────── 3 · The turn (Lantern enters) ───────────────── */}
      <section className="relative overflow-hidden px-5 py-32">
        <Atmosphere />
        <div className="relative mx-auto max-w-3xl text-center">
          <StoryReveal>
            <p className="font-display text-3xl leading-snug text-cream sm:text-5xl">
              So we sat with her, and wrote down what she remembers.
            </p>
          </StoryReveal>
          <StoryReveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-xl text-lg text-muted">
              Forty-one phrases. Greetings. The names for family. A handful of small
              sentences. That was all.
            </p>
          </StoryReveal>
          <StoryReveal delay={0.3}>
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              <Phrase mi="Kia ora" en="hello / be well" />
              <Phrase mi="whānau" en="family" />
              <Phrase mi="tama" en="son" />
              <Phrase mi="wai" en="water" />
              <Phrase mi="I haere au" en="I went" />
            </div>
          </StoryReveal>
          <StoryReveal delay={0.45}>
            <p className="mx-auto mt-14 max-w-2xl text-xl leading-relaxed text-cream">
              Then we gave them to <span className="font-display text-flame">Lantern</span>.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted">
              Lantern turns a few remembered phrases into a real course to learn from
              — using AI that studies <span className="text-cream">only the words you give it</span>,
              and never invents one it hasn&rsquo;t seen.
            </p>
          </StoryReveal>
        </div>
      </section>

      {/* ───────────────── 4 · How it works (narrated) ───────────────── */}
      <section className="mx-auto max-w-4xl px-5 py-24">
        <StoryReveal>
          <p className="text-center text-sm uppercase tracking-[0.3em] text-ember">
            What happened next
          </p>
          <h2 className="mt-4 text-center font-display text-3xl text-cream sm:text-4xl">
            A course took shape in minutes — not years.
          </h2>
        </StoryReveal>

        <div className="mt-16 space-y-5">
          <Step
            icon={Sprout}
            n="01"
            title="It started with her words"
            body="The forty-one phrases became the ground truth — the only thing Lantern is allowed to learn from."
          >
            <div className="flex flex-wrap gap-2">
              <Phrase mi="Kia ora" en="hello" />
              <Phrase mi="whānau" en="family" />
              <Phrase mi="I haere au" en="I went" />
            </div>
          </Step>

          <Step
            icon={Brain}
            n="02"
            title="Lantern found the grammar hiding inside them"
            body="It lined up her sentences and noticed a pattern most learners take months to see: the verb never changes — a tiny word in front carries the time."
          >
            <div className="grid gap-1.5 font-display text-cream sm:grid-cols-2">
              <span><span className="text-ember">i</span> haere au — I <span className="text-muted">went</span></span>
              <span><span className="text-ember">kei te</span> haere au — I&rsquo;m <span className="text-muted">going</span></span>
              <span><span className="text-ember">ka</span> haere au — I <span className="text-muted">will go</span></span>
              <span><span className="text-ember">kua</span> haere au — I <span className="text-muted">have gone</span></span>
            </div>
          </Step>

          <Step
            icon={GraduationCap}
            n="03"
            title="It built a course to learn from"
            body="Flashcards, pronunciation you can hear, and spaced repetition that brings each word back just before you'd forget it. The kind of thing that takes linguists years."
          />

          <Step
            icon={RefreshCw}
            n="04"
            title="And it grows"
            body="Every new phrase she remembers — or anyone adds — makes the course richer. Her language stops shrinking, and starts growing again."
            last
          />
        </div>
      </section>

      {/* ───────────────── 5 · The honest engine ───────────────── */}
      <section className="relative overflow-hidden px-5 py-32">
        <Atmosphere />
        <div className="relative mx-auto max-w-3xl text-center">
          <StoryReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-pounamu/30 bg-pounamu/10 px-3.5 py-1.5 text-sm font-medium text-pounamu">
              <ShieldCheck className="h-4 w-4" />
              The promise that makes it trustworthy
            </span>
          </StoryReveal>
          <StoryReveal delay={0.15}>
            <h2 className="mt-8 font-display text-4xl text-cream sm:text-6xl">
              &ldquo;We never invent a word.&rdquo;
            </h2>
          </StoryReveal>
          <StoryReveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              An AI can&rsquo;t truly know a language with fifty speakers left — there&rsquo;s
              almost nothing to learn it from. Pretending would be a lie, and an
              insult to the people who carry it. So Lantern only ever uses{" "}
              <span className="text-cream">her</span> words. If it ever builds a
              sentence with a word she never said, the app{" "}
              <span className="text-cream">throws it out automatically</span> — checked
              in code, before anyone sees it.
            </p>
          </StoryReveal>
        </div>
      </section>

      {/* ───────────────── 6 · Try it ───────────────── */}
      <section className="mx-auto max-w-4xl px-5 py-24">
        <StoryReveal>
          <div className="card relative overflow-hidden p-10 text-center sm:p-14">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ember/15 to-transparent" />
            <p className="relative text-sm uppercase tracking-[0.3em] text-ember">
              See it yourself
            </p>
            <h2 className="relative mx-auto mt-5 max-w-2xl font-display text-3xl text-cream sm:text-5xl">
              Watch Lantern learn te reo Māori from those 41 phrases.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-muted">
              Open the workspace. You&rsquo;ll see the words she gave it, the grammar it
              found, and a course you can take — right now, in your browser.
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/lang/mi"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ember px-7 font-medium text-ink transition-transform hover:scale-[1.03]"
              >
                Open the Māori workspace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/ark"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 font-medium text-cream transition-colors hover:bg-surface"
              >
                See every language
              </Link>
            </div>
          </div>
        </StoryReveal>
      </section>

      {/* ───────────────── 7 · The Ark ───────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <StoryReveal>
          <p className="text-center text-sm uppercase tracking-[0.3em] text-ember">
            She isn&rsquo;t alone
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl text-cream sm:text-4xl">
            Languages people are fighting to keep.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted">
            One has about ten speakers left. Two were declared gone — and brought
            back by their children. Each is a light someone refuses to let go out.
          </p>
        </StoryReveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LANGUAGES.map((l, i) => (
            <StoryReveal key={l.id} delay={i * 0.05}>
              <Link
                href={`/lang/${l.id}`}
                className="card group flex h-full flex-col p-5 transition-colors hover:border-line"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: l.color, boxShadow: `0 0 10px ${l.color}` }}
                />
                <span className="mt-4 font-display text-lg text-cream">{l.name}</span>
                <span className="mt-0.5 text-xs text-muted">{l.region}</span>
                <span className="mt-3 text-[11px] leading-snug text-faint">{l.speakers}</span>
              </Link>
            </StoryReveal>
          ))}
        </div>
        <StoryReveal>
          <div className="mt-8 text-center">
            <Link href="/ark" className="inline-flex items-center gap-2 text-ember hover:text-flame">
              Enter the Living Ark <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </StoryReveal>
      </section>

      {/* ───────────────── 8 · Close ───────────────── */}
      <section className="relative overflow-hidden px-5 py-40 text-center">
        <Atmosphere extra={<EmberField count={14} />} />
        <div className="relative">
          <StoryReveal>
            <div className="flex justify-center">
              <HeroFlame size={84} />
            </div>
          </StoryReveal>
          <StoryReveal delay={0.2}>
            <h2 className="mx-auto mt-10 max-w-3xl font-display text-4xl leading-tight text-cream sm:text-6xl">
              A language only dies when the
              <br className="hidden sm:block" /> last person stops speaking it.
            </h2>
          </StoryReveal>
          <StoryReveal delay={0.4}>
            <p className="mt-7 text-lg text-muted">So we keep speaking. Light one, and see.</p>
            <Link
              href="/lang/mi"
              className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-ember px-7 font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              Start with te reo Māori
              <ArrowRight className="h-4 w-4" />
            </Link>
          </StoryReveal>
        </div>
      </section>
    </div>
  );
}

// A narrated step with an optional worked example.
function Step({
  icon: Icon,
  n,
  title,
  body,
  children,
  last,
}: {
  icon: React.ComponentType<{ className?: string }>;
  n: string;
  title: string;
  body: string;
  children?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <StoryReveal>
      <div className="relative flex gap-5 sm:gap-8">
        {/* rail */}
        <div className="flex flex-col items-center">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ember">
            <Icon className="h-5 w-5" />
          </div>
          {!last && <div className="mt-2 w-px flex-1 bg-gradient-to-b from-line to-transparent" />}
        </div>
        {/* content */}
        <div className={last ? "pb-0" : "pb-12"}>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-sm text-faint">{n}</span>
            <h3 className="font-display text-xl text-cream sm:text-2xl">{title}</h3>
          </div>
          <p className="mt-2 max-w-xl leading-relaxed text-muted">{body}</p>
          {children && (
            <div className="mt-5 rounded-2xl border border-line bg-surface/40 p-5">
              {children}
            </div>
          )}
        </div>
      </div>
    </StoryReveal>
  );
}
