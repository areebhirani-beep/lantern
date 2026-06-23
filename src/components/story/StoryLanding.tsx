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
  Volume2,
  Languages,
  Sparkles,
} from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
import {
  Atmosphere,
  EmberField,
  Gloss,
  HeroFlame,
  ScrollProgress,
  StoryReveal,
} from "./primitives";
import { SpotlightCard } from "./SpotlightCard";
import { BrowserFrame } from "./BrowserFrame";
import { TextRevealByWord } from "./TextReveal";
import { Marquee } from "@/components/magic/marquee";
import { BorderBeam } from "@/components/magic/border-beam";
import { AnimatedShinyText } from "@/components/magic/animated-shiny-text";

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
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
        <Atmosphere extra={<EmberField />} />
        <div className="relative">
          <StoryReveal>
            <div className="flex justify-center">
              <HeroFlame size={132} />
            </div>
          </StoryReveal>
          <StoryReveal delay={0.25}>
            <p className="mt-10 text-sm uppercase tracking-[0.3em]">
              <AnimatedShinyText className="text-ember/70">
                A true story, like thousands of others
              </AnimatedShinyText>
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
              <Gloss term="te reo Māori" meaning="the Māori language of New Zealand" />.
              She is one of the last in our family who can.
            </p>
          </StoryReveal>
        </div>
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-faint">
          <span className="text-xs tracking-widest">WHAT WE DID ABOUT IT</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </section>

      {/* ───────────── 2 · What Lantern actually is (clarity first) ───────────── */}
      <section className="mx-auto max-w-5xl px-5 py-28">
        <StoryReveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-ember">In one sentence</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-cream sm:text-5xl">
            Lantern builds a language-learning app for languages that are
            disappearing.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
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
        <StoryReveal delay={0.2}>
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
      <section className="mx-auto max-w-4xl px-5 py-20">
        <StoryReveal>
          <p className="text-center text-sm uppercase tracking-[0.3em] text-ember">
            What happened next
          </p>
          <h2 className="mt-4 text-center font-display text-3xl text-cream sm:text-4xl">
            A whole course took shape in minutes.
          </h2>
        </StoryReveal>

        <div className="mt-16 space-y-5">
          <Step
            icon={Sprout}
            n="01"
            title="It started with her words"
            body="The forty-one phrases became the ground truth. They are the only thing Lantern is allowed to learn from."
          />
          <Step
            icon={Brain}
            n="02"
            title="It found the grammar hiding inside them"
            body="Lantern lined up her sentences and spotted a pattern: the verb never changes, and a small word in front of it carries the time."
          >
            <div className="grid gap-1.5 font-display text-cream sm:grid-cols-2">
              <span><span className="text-ember">i</span> haere au, I <span className="text-muted">went</span></span>
              <span><span className="text-ember">kei te</span> haere au, I&rsquo;m <span className="text-muted">going</span></span>
              <span><span className="text-ember">ka</span> haere au, I <span className="text-muted">will go</span></span>
              <span><span className="text-ember">kua</span> haere au, I <span className="text-muted">have gone</span></span>
            </div>
          </Step>
          <Step
            icon={GraduationCap}
            n="03"
            title="It built a course you can take"
            body="Flashcards, pronunciation you can hear, and spaced repetition that brings each word back just before you would forget it. The kind of thing that normally takes linguists years."
          />
          <Step
            icon={RefreshCw}
            n="04"
            title="And it keeps growing"
            body="Every new phrase she remembers, or anyone adds, makes the course richer. Her language stops shrinking and starts growing again."
            last
          />
        </div>
      </section>

      {/* ───────────── 6 · The real product ───────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <StoryReveal className="mx-auto max-w-2xl text-center">
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
      <section className="mx-auto max-w-6xl px-5 py-20">
        <StoryReveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-cream sm:text-4xl">
            Everything a learner needs, generated from almost nothing.
          </h2>
        </StoryReveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            className="lg:col-span-2"
            icon={Sprout}
            title="A course for a language that never had one"
            body="No textbook, no app, no data online. Lantern starts from whatever words are left and builds the rest."
          />
          <Feature
            icon={ShieldCheck}
            title="Never invents a word"
            body="Every word it teaches is real and cited. The rest is rejected in code."
          />
          <Feature
            icon={Volume2}
            title="Hear every word"
            body="Built-in pronunciation so you can speak it, not just read it."
          />
          <Feature
            icon={Brain}
            title="Real grammar, discovered"
            body="It works out tense, plurals, and patterns from the examples it is given."
          />
          <Feature
            className="lg:col-span-2"
            icon={RefreshCw}
            title="It grows every time someone uses it"
            body="Add a phrase and the whole course re-derives, richer. The language's record compounds instead of fading."
          />
        </div>
      </section>

      {/* ───────────── 9 · Try it ───────────── */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <StoryReveal>
          <div className="card relative overflow-hidden p-10 text-center sm:p-14">
            <BorderBeam duration={9} size={80} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ember/15 to-transparent" />
            <p className="relative text-sm uppercase tracking-[0.3em] text-ember">
              See it for yourself
            </p>
            <h2 className="relative mx-auto mt-5 max-w-2xl font-display text-3xl text-cream sm:text-5xl">
              Watch Lantern learn Māori from those 41 phrases.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-muted">
              Open the workspace. You will see the words she gave it, the grammar it
              found, and a course you can take, right now, in your browser.
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

      {/* ───────────── 10 · The Ark ───────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <StoryReveal>
          <p className="flex items-center justify-center gap-2 text-center text-sm uppercase tracking-[0.3em] text-ember">
            <Languages className="h-4 w-4" /> She isn&rsquo;t alone
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl text-cream sm:text-4xl">
            Languages people are fighting to keep.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted">
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
        <div className="flex flex-col items-center">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ember">
            <Icon className="h-5 w-5" />
          </div>
          {!last && <div className="mt-2 w-px flex-1 bg-gradient-to-b from-line to-transparent" />}
        </div>
        <div className={last ? "pb-0" : "pb-12"}>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-sm text-faint">{n}</span>
            <h3 className="font-display text-xl text-cream sm:text-2xl">{title}</h3>
          </div>
          <p className="mt-2 max-w-xl leading-relaxed text-muted">{body}</p>
          {children && (
            <div className="mt-5 rounded-2xl border border-line bg-surface/40 p-5">{children}</div>
          )}
        </div>
      </div>
    </StoryReveal>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <SpotlightCard className={`p-7 ${className}`}>
      <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-ember">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 font-display text-xl text-cream">{title}</h3>
      <p className="mt-2 leading-relaxed text-muted">{body}</p>
    </SpotlightCard>
  );
}
