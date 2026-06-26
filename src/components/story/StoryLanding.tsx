"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Volume2,
  Languages,
  Sparkles,
} from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
import {
  Atmosphere,
  EmberField,
  HeroFlame,
  ScrollProgress,
  StoryReveal,
} from "./primitives";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { FeatureBento } from "./FeatureBento";
import { TryItCTA } from "./TryItCTA";
import { SpotlightCard } from "./SpotlightCard";
import { BrowserFrame } from "./BrowserFrame";
import { TextRevealByWord } from "./TextReveal";
import { Marquee } from "@/components/magic/marquee";
import { NumberTicker } from "@/components/magic/number-ticker";

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

      {/* ───────────── 1 · The person ───────────── */}
      <Hero />

      {/* ───────────── 2 · What Lantern actually is (clarity first) ───────────── */}
      <section className="mx-auto max-w-5xl px-5 py-28">
        <StoryReveal className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-ember">In one sentence</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-cream sm:text-5xl">
            Lantern builds a language-learning app for languages that are
            disappearing.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Think of Duolingo. Now imagine a language so endangered that no one has
            ever built a course for it. Lantern builds that course from scratch,
            using only the handful of words people still remember.
          </p>
        </StoryReveal>

        {/* before → after */}
        <StoryReveal delay={0.1}>
          <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
            {/* INPUT */}
            <SpotlightCard className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-faint">You give it</p>
              <h3 className="mt-2 font-display text-xl text-cream">
                A few words someone remembers
              </h3>
              <div className="mt-5 space-y-2.5">
                {[
                  ["Kia ora", "hello"],
                  ["whānau", "family"],
                  ["tama", "son"],
                  ["I haere au", "I went"],
                  ["kua haere au", "I have gone"],
                ].map(([mi, en]) => (
                  <div
                    key={mi}
                    className="flex items-baseline justify-between rounded-lg border border-line/70 bg-ink/40 px-3.5 py-2"
                  >
                    <span className="font-display text-cream">{mi}</span>
                    <span className="text-sm text-muted">{en}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            {/* arrow + what it does */}
            <div className="flex flex-col items-center justify-center gap-3 px-2 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-ember/40 bg-ember/10 text-ember">
                <Sparkles className="h-5 w-5" />
              </span>
              <p className="max-w-[12rem] text-xs leading-relaxed text-muted">
                Lantern reads them, works out the grammar, and builds the lessons.
              </p>
              <ArrowRight className="hidden h-6 w-6 text-ember lg:block" />
              <ArrowDown className="h-6 w-6 text-ember lg:hidden" />
            </div>

            {/* OUTPUT */}
            <SpotlightCard className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-faint">You get</p>
              <h3 className="mt-2 font-display text-xl text-cream">
                A real course to learn from
              </h3>
              {/* flashcard mock */}
              <div className="mt-5 rounded-xl border border-line bg-ink/50 p-5 text-center">
                <p className="text-xs uppercase tracking-widest text-faint">say &ldquo;hello&rdquo;</p>
                <p className="mt-2 font-display text-3xl text-cream">Kia ora</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-muted">
                  <Volume2 className="h-3.5 w-3.5" /> hear it
                </span>
              </div>
              {/* grammar mock */}
              <p className="mt-5 text-xs text-muted">It even worked out the tenses:</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  ["past", "i haere"],
                  ["now", "kei te haere"],
                  ["future", "ka haere"],
                ].map(([t, v]) => (
                  <span
                    key={t}
                    className="rounded-full bg-surface-2 px-2.5 py-1 text-xs"
                  >
                    <span className="text-pounamu">{t}:</span>{" "}
                    <span className="text-cream">{v}</span>
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </StoryReveal>
      </section>

      {/* ───────────── 3 · The loss (scroll-revealed, Magic UI text reveal) ───────────── */}
      <TextRevealByWord text="Every two weeks, a language takes its last breath. A thousand years of grammar, story, and song, gone unwritten, because no one had the time to write it down." />

      <section className="relative mx-auto max-w-3xl px-5 pb-32 text-center">
        <StoryReveal>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
            Of the world&rsquo;s 7,000 languages, nearly half are expected to fall
            silent within a lifetime. The reason is rarely that no one cares. It is
            that documenting a language and teaching it has always taken trained
            experts years, and most languages will never get that time.
          </p>
        </StoryReveal>
        <StoryReveal delay={0.15}>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-6 border-y border-line py-9">
            <div>
              <div className="font-display text-3xl text-cream sm:text-4xl">
                <NumberTicker value={7000} />
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-faint">
                spoken today
              </p>
            </div>
            <div>
              <div className="font-display text-3xl text-cream sm:text-4xl">
                <NumberTicker value={3000} />
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-faint">
                expected to vanish
              </p>
            </div>
            <div>
              <div className="font-display text-3xl text-ember sm:text-4xl">
                <NumberTicker value={14} />
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-faint">
                days between each loss
              </p>
            </div>
          </div>
        </StoryReveal>
        <StoryReveal delay={0.3}>
          <p className="mt-10 font-display text-2xl text-ember sm:text-3xl">
            Hers is on that list.
          </p>
        </StoryReveal>
      </section>

      {/* ───────────── 4 · The turn (her words) ───────────── */}
      <section className="relative overflow-hidden px-5 py-28">
        <Atmosphere />
        <div className="relative mx-auto max-w-3xl text-center">
          <StoryReveal>
            <p className="font-display text-3xl leading-snug text-cream sm:text-5xl">
              So we sat with her, and wrote down what she remembers.
            </p>
          </StoryReveal>
          <StoryReveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-xl text-lg text-muted">
              Forty-one phrases. Greetings, the names for family, a few small
              sentences. That was all we had.
            </p>
          </StoryReveal>
          <StoryReveal delay={0.3}>
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              <Phrase mi="Kia ora" en="hello" />
              <Phrase mi="whānau" en="family" />
              <Phrase mi="tama" en="son" />
              <Phrase mi="wai" en="water" />
              <Phrase mi="I haere au" en="I went" />
            </div>
          </StoryReveal>
          <StoryReveal delay={0.45}>
            <p className="mx-auto mt-12 max-w-2xl text-xl leading-relaxed text-cream">
              Then we handed them to{" "}
              <span className="font-display text-flame">Lantern</span>.
            </p>
          </StoryReveal>
        </div>
      </section>

      {/* ───────────── 5 · How it works (narrated) ───────────── */}
      <HowItWorks />

      {/* ───────────── 6 · The real product ───────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <StoryReveal className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-ember">Not a mockup</p>
          <h2 className="mt-4 font-display text-3xl text-cream sm:text-4xl">
            This is the actual app.
          </h2>
          <p className="mt-4 text-muted">
            Everything you see below was learned from those 41 phrases. Nothing was
            invented.
          </p>
        </StoryReveal>
        <StoryReveal delay={0.1} className="mt-12">
          <BrowserFrame url="lantern.app/lang/mi">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/preview/structure.png"
              alt="The Lantern workspace showing the grammar and vocabulary it induced for Māori"
              className="block w-full"
            />
          </BrowserFrame>
        </StoryReveal>
      </section>

      {/* ───────────── 7 · The honest engine ───────────── */}
      <section className="relative overflow-hidden px-5 py-32">
        <Atmosphere />
        <div className="relative mx-auto max-w-3xl text-center">
          <StoryReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-pounamu/30 bg-pounamu/10 px-3.5 py-1.5 text-sm font-medium text-pounamu">
              <ShieldCheck className="h-4 w-4" />
              The rule that makes it trustworthy
            </span>
          </StoryReveal>
          <StoryReveal delay={0.15}>
            <h2 className="mt-8 font-display text-4xl text-cream sm:text-6xl">
              It never makes up a word.
            </h2>
          </StoryReveal>
          <StoryReveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              An AI cannot truly know a language with fifty speakers left, because
              there is almost nothing to learn it from. Pretending would be a lie,
              and an insult to the people who carry it. So Lantern only ever uses{" "}
              <span className="text-cream">her</span> words. If it ever tries to
              build a sentence with a word she never said, the app{" "}
              <span className="text-cream">deletes it automatically</span>, checked in
              code before anyone sees it.
            </p>
          </StoryReveal>
        </div>
      </section>

      {/* ───────────── 8 · Bento features ───────────── */}
      <FeatureBento />

      {/* ───────────── 9 · Try it ───────────── */}
      <TryItCTA />

      {/* ───────────── 10 · The Ark ───────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <StoryReveal className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-ember">
            <Languages className="h-4 w-4" /> She isn&rsquo;t alone
          </p>
          <h2 className="mt-4 font-display text-3xl text-cream sm:text-4xl">
            Languages people are fighting to keep.
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            One has about ten speakers left. Two were declared gone, then brought
            back by their children. Each is a light someone refuses to let go out.
          </p>
        </StoryReveal>

        <div className="relative mt-12 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <Marquee pauseOnHover className="[--duration:34s]">
            {LANGUAGES.map((l) => (
              <span key={l.id} className="mx-7 font-display text-2xl text-cream/70">
                {l.endonym}
              </span>
            ))}
          </Marquee>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LANGUAGES.map((l, i) => (
            <StoryReveal key={l.id} delay={i * 0.05}>
              <Link href={`/lang/${l.id}`} className="block h-full">
                <SpotlightCard className="flex h-full flex-col p-5 transition-colors hover:border-line">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: l.color, boxShadow: `0 0 10px ${l.color}` }}
                  />
                  <span className="mt-4 font-display text-lg text-cream">{l.name}</span>
                  <span className="mt-0.5 text-xs text-muted">{l.region}</span>
                  <span className="mt-3 text-[11px] leading-snug text-faint">{l.speakers}</span>
                </SpotlightCard>
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

      {/* ───────────── 11 · Close ───────────── */}
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
              Start with Māori
              <ArrowRight className="h-4 w-4" />
            </Link>
          </StoryReveal>
        </div>
      </section>
    </div>
  );
}
