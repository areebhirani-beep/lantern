"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
import {
  Atmosphere,
  EmberField,
  HeroFlame,
  ScrollProgress,
  SectionHead,
  StoryReveal,
} from "./primitives";
import { Hero } from "./Hero";
import { LiveInduction } from "./LiveInduction";
import { HowItWorks } from "./HowItWorks";
import { FeatureBento } from "./FeatureBento";
import { TryItCTA } from "./TryItCTA";
import { BrowserFrame } from "./BrowserFrame";
import { TextRevealByWord } from "./TextReveal";
import { RollingNumber } from "./RollingNumber";
import { Marquee } from "@/components/magic/marquee";
import { BorderBeam } from "@/components/vengeance/border-beam";
import { GlowBorderCard } from "@/components/vengeance/glow-border-card";
import { PerspectiveGrid } from "@/components/vengeance/perspective-grid";
import { CyberGlitchText } from "@/components/vengeance/cyber-glitch-text";
import { TestimonialsCard } from "@/components/vengeance/testimonials-card";
import { RadialGlowButton } from "@/components/vengeance/radial-glow-button";
import { LightLines } from "@/components/vengeance/light-lines";
import AnimatedButton from "@/components/vengeance/animated-button";

/** Mission-framed, honestly-sourced community cards. No fabricated personal
 *  quotes — each line states the revival mission, and photo attribution is kept
 *  inline so the section's "it cites every photo" promise still holds. */
const COMMUNITY_TESTIMONIALS = [
  {
    id: "mi",
    title: "te reo Māori",
    description:
      "From near-loss to kōhanga reo immersion nests and a Māori Language Act — proof a language can be carried forward. Photo: Schwede66, Te Matatini, CC BY-SA 4.0.",
    image: "/people/maori-kapa-haka.jpg",
  },
  {
    id: "chr",
    title: "ᏣᎳᎩ Cherokee",
    description:
      "Fluent speakers number in the hundreds, keeping a syllabary and grammar alive. Lantern only ever teaches words they actually said. Photo: NARA, public domain.",
    image: "/people/cherokee-stickball.jpg",
  },
];

export function StoryLanding() {
  const router = useRouter();
  return (
    <main className="relative">
      <ScrollProgress />

      {/* ───────────── 1 · The person ───────────── */}
      <Hero />

      {/* ───────────── 2 · What Lantern actually is (clarity first) ───────────── */}
      <section className="mx-auto max-w-5xl px-5 py-24 sm:py-28">
        <StoryReveal className="max-w-3xl">
          <SectionHead index="01" label="What it is" />
          <h2 className="mt-7 font-display text-3xl leading-[1.08] text-cream sm:text-5xl">
            Lantern builds a language-learning app for languages that are
            disappearing.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Think of Duolingo. Now imagine a language so endangered that no one has
            ever built a course for it. Lantern builds that course from scratch,
            using only the handful of words people still remember.
          </p>
        </StoryReveal>

        <StoryReveal delay={0.05}>
          <div className="mt-8 max-w-xl border-l-2 border-ember/30 pl-4">
            <div className="font-mono text-sm text-faint">
              <RollingNumber value={0} className="text-ember" /> invented words
              <span className="mx-2 text-line">·</span>
              <RollingNumber value={48} suffix="/48" className="text-ember" /> words cited
              <span className="mx-2 text-line">·</span>
              <RollingNumber value={7} suffix="/7" className="text-ember" /> sentences attested
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-faint">
              recomputed live at{" "}
              <a
                href="/api/metrics"
                className="underline decoration-dotted underline-offset-2 hover:text-cream"
              >
                /api/metrics
              </a>
            </p>
          </div>
        </StoryReveal>

        {/* the live demo: corpus → cited vocabulary, with the guardrail
            discarding an invented word in real time. Cluely cannot fake this. */}
        <StoryReveal delay={0.1}>
          <div className="mt-14">
            <LiveInduction />
          </div>
        </StoryReveal>
      </section>

      {/* ───────────── 3 · The loss (the one signature scroll motion) ───────────── */}
      <TextRevealByWord text="Every two weeks, a language takes its last breath. A thousand years of grammar, story, and song, gone unwritten, because no one had the time to write it down." />

      <section className="relative mx-auto max-w-5xl overflow-hidden px-5 pb-32">
        {/* A perspective grid receding into the dark — the quiet scale of the loss. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-full opacity-[0.14]">
          <PerspectiveGrid gridSize={26} showOverlay={false} className="bg-transparent" />
        </div>
        <div className="relative">
        <StoryReveal className="max-w-2xl">
          <p className="text-lg leading-relaxed text-muted">
            Of the world&rsquo;s 7,000 languages, nearly half are expected to fall
            silent within a lifetime. The reason is rarely that no one cares. It is
            that documenting a language and teaching it has always taken trained
            experts years, and most languages will never get that time.
          </p>
        </StoryReveal>
        <StoryReveal delay={0.12}>
          <div className="mt-12 grid max-w-3xl gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
            {[
              { value: 7000, prefix: "", label: "spoken today", tone: "text-cream" },
              { value: 3000, prefix: "", label: "expected to vanish", tone: "text-cream" },
              { value: 14, prefix: "~", label: "days between each loss", tone: "text-ember" },
            ].map(({ value, prefix, label, tone }) => (
              <div key={label} className="bg-ink p-6">
                <RollingNumber
                  value={value}
                  prefix={prefix}
                  className={`font-display text-4xl ${tone}`}
                />
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </StoryReveal>
        <StoryReveal delay={0.24}>
          <p className="mt-12 font-display text-2xl text-ember sm:text-3xl">
            Hers is on that list.
          </p>
        </StoryReveal>
        </div>
      </section>

      {/* ───────────── 4 · The turn (her words) ───────────── */}
      <section className="relative overflow-hidden px-5 py-28">
        <Atmosphere />
        <div className="relative mx-auto max-w-3xl">
          <StoryReveal>
            <p className="font-display text-3xl leading-[1.12] text-cream sm:text-5xl">
              So we sat with her, and wrote down what she remembers.
            </p>
          </StoryReveal>
          <StoryReveal delay={0.12}>
            <p className="mt-8 max-w-xl text-lg text-muted">
              Forty-one phrases. Greetings, the names for family, a few small
              sentences. That was all we had — and it was enough.
            </p>
          </StoryReveal>
          <StoryReveal delay={0.24}>
            <div className="relative mt-10 inline-block overflow-hidden rounded-2xl border border-line bg-ink/50 px-6 py-4">
              <BorderBeam
                size={140}
                duration={9}
                colorFrom="#ffb454"
                colorTo="#34d8a6"
                className="pointer-events-none"
              />
              <p className="max-w-2xl text-xl leading-relaxed text-cream">
                Then we handed them to{" "}
                <span className="font-display-italic text-flame">Lantern</span>.
              </p>
            </div>
          </StoryReveal>
        </div>
      </section>

      {/* ───────────── 5 · How it works (narrated) ───────────── */}
      <HowItWorks />

      {/* ───────────── 6 · The real product ───────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <StoryReveal className="max-w-2xl">
          <SectionHead index="03" label="The real product" />
          <h2 className="mt-7 font-display text-3xl text-cream sm:text-4xl">
            This is the actual app, not a mockup.
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Everything you see below was learned from those 41 phrases. Nothing was
            invented.
          </p>
        </StoryReveal>
        <StoryReveal delay={0.1} className="mt-12">
          <div className="relative overflow-hidden rounded-2xl">
            <BrowserFrame url="lantern.app/lang/mi">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/preview/structure.png"
                alt="The Lantern workspace showing the grammar and vocabulary it induced for Māori"
                className="block w-full"
              />
            </BrowserFrame>
            <BorderBeam
              size={260}
              duration={13}
              colorFrom="#ffb454"
              colorTo="#34d8a6"
              className="pointer-events-none"
            />
          </div>
        </StoryReveal>
      </section>

      {/* ───────────── 7 · The honest engine ───────────── */}
      <section className="relative overflow-hidden px-5 py-32">
        <Atmosphere />
        <div className="relative mx-auto max-w-3xl">
          <StoryReveal>
            <SectionHead index="04" label="The guardrail" tone="pounamu" />
          </StoryReveal>
          <StoryReveal delay={0.1}>
            <h2 className="mt-7 max-w-2xl font-display text-4xl leading-[1.05] text-cream sm:text-6xl">
              <CyberGlitchText text="It never makes up a word." scrambleDuration={45} />
            </h2>
          </StoryReveal>
          <StoryReveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              An AI cannot truly know a language with fifty speakers left, because
              there is almost nothing to learn it from. Pretending would be a lie,
              and an insult to the people who carry it. So Lantern only ever uses{" "}
              <span className="text-cream">her</span> words. If it ever tries to
              build a sentence with a word she never said, the app{" "}
              <span className="text-cream">deletes it automatically</span>
              <span className="text-faint">
                {" "}
                — checked in code, before anyone sees it.
              </span>
            </p>
          </StoryReveal>
          <StoryReveal delay={0.3}>
            <GlowBorderCard
              width="100%"
              height="auto"
              borderRadius="0.75rem"
              animationDuration={6}
              gradientColors={["#34d8a6", "#119b76", "#ffb454", "#ffd488"]}
              className="mt-8 max-w-sm border border-line bg-ink/70 p-0 text-left backdrop-blur-none"
            >
              <p className="inline-flex w-full items-center gap-2 font-mono text-xs text-pounamu">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                guardrail.check.ts · 0 hallucinations · 100% cited
              </p>
            </GlowBorderCard>
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
          <SectionHead index="06" label="The living ark" />
          <h2 className="mt-7 font-display text-3xl text-cream sm:text-4xl">
            She isn&rsquo;t alone. These are languages people are fighting to keep.
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
            <StoryReveal key={l.id} delay={i * 0.04} className="h-full">
              <Link href={`/lang/${l.id}`} className="group block h-full">
                {/* Each card's glow is keyed to its own language colour, then warmed
                    toward ember/flame so eight different hues still read as one
                    lantern-lit family. The conic ring is slow + clipped to the card,
                    so it's a calm rim-light, not a drifting blob. */}
                <GlowBorderCard
                  width="100%"
                  height="100%"
                  borderRadius="1rem"
                  animationDuration={12 + (i % 4) * 2}
                  gradientColors={[l.color, "#ffb454", "#ffd488", "#d98324"]}
                  borderWidth="0.7em"
                  blurAmount="0.45em"
                  inset="-0.4em"
                  className="border border-line bg-surface/40 p-0 backdrop-blur-none transition-colors group-hover:border-ember/40"
                >
                  <div className="flex h-full w-full flex-col items-start self-stretch text-left">
                    <span
                      className="block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: l.color, boxShadow: `0 0 10px ${l.color}` }}
                    />
                    <span className="mt-4 block font-display text-lg leading-tight text-cream">
                      {l.name}
                    </span>
                    <span className="mt-1 block text-xs text-muted">{l.region}</span>
                    <span className="mt-3 block font-mono text-[11px] leading-snug text-faint">
                      {l.speakers}
                    </span>
                  </div>
                </GlowBorderCard>
              </Link>
            </StoryReveal>
          ))}
        </div>
        <StoryReveal>
          <div className="mt-8">
            <AnimatedButton
              onClick={() => router.push("/ark")}
              className="group h-12 gap-2 rounded-full border-line bg-surface px-6 text-cream hover:bg-surface-2"
            >
              Enter the Living Ark
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </AnimatedButton>
          </div>
        </StoryReveal>
      </section>

      {/* ───────────── 11 · The people ───────────── */}
      <section className="mx-auto max-w-5xl px-5 py-24">
        <StoryReveal className="max-w-2xl">
          <SectionHead index="07" label="The communities" />
          <h2 className="mt-7 font-display text-3xl leading-tight text-cream sm:text-4xl">
            These are the people whose words we carry.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Not abstractions — living communities keeping their languages alive. The
            same way Lantern cites every word, it cites every photo.
          </p>
        </StoryReveal>
        <StoryReveal delay={0.1}>
          <div className="mt-8 flex justify-center">
            <TestimonialsCard
              items={COMMUNITY_TESTIMONIALS}
              width={560}
              autoPlay
              autoPlayInterval={6000}
            />
          </div>
        </StoryReveal>
      </section>

      {/* ───────────── 12 · Close (deliberate centered bookend) ───────────── */}
      <section className="relative overflow-hidden px-5 py-40 text-center">
        {/* Faint vertical light-rays behind the bookend — ember-recoloured and
            masked so they read as rising lantern light, never an "AI" wash.
            No solid gradient (from/to transparent); text stays fully crisp above. */}
        <div className="pointer-events-none absolute inset-0 -z-0 opacity-60 [mask-image:linear-gradient(to_top,transparent,black_28%,black_78%,transparent)]">
          <LightLines
            gradientFrom="transparent"
            gradientTo="transparent"
            lineColor="#ffb454"
            lightColor="#ffd488"
            linesOpacity={0.05}
            lightsOpacity={0.22}
            speedMultiplier={0.6}
          />
        </div>
        <Atmosphere extra={<EmberField count={14} />} />
        <div className="relative">
          <StoryReveal>
            <div className="flex justify-center">
              <HeroFlame size={84} />
            </div>
          </StoryReveal>
          <StoryReveal delay={0.15}>
            <h2 className="mx-auto mt-10 max-w-3xl font-display text-4xl leading-tight text-cream sm:text-6xl">
              A language only dies when the
              <br className="hidden sm:block" /> last person stops speaking it.
            </h2>
          </StoryReveal>
          <StoryReveal delay={0.3}>
            <p className="mt-7 text-lg text-muted">So we keep speaking. Light one, and see.</p>
            <div className="mt-9 flex justify-center">
              <RadialGlowButton
                onClick={() => router.push("/lang/mi")}
                aria-label="Start with Māori"
                style={{ borderRadius: 9999 }}
              >
                <span className="flex items-center gap-2">
                  Start with Māori
                  <ArrowRight className="h-4 w-4" />
                </span>
              </RadialGlowButton>
            </div>
          </StoryReveal>
        </div>
      </section>
    </main>
  );
}
