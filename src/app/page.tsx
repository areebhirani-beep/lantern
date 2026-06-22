import Link from "next/link";
import {
  ArrowRight,
  Sprout,
  Brain,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
  Volume2,
  Globe,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { SectionLabel, StatusBadge } from "@/components/ui";
import { LANGUAGES } from "@/lib/languages";

const STEPS = [
  {
    icon: Sprout,
    n: "01",
    title: "Seed",
    body: "A speaker or elder remembers a handful of phrases — even 20 is enough. That becomes the ground truth.",
  },
  {
    icon: Brain,
    n: "02",
    title: "Induce",
    body: "AI reads only those phrases: it aligns words to meanings, finds the grammar in minimal pairs, and builds a vocabulary bank — citing its evidence.",
  },
  {
    icon: GraduationCap,
    n: "03",
    title: "Learn",
    body: "A full beginner course materializes — flashcards, spaced repetition, pronunciation — for a language that had no materials an hour ago.",
  },
  {
    icon: RefreshCw,
    n: "04",
    title: "Grow",
    body: "Every learner who adds or corrects a phrase makes the course richer. The language's living record compounds. A digital ark.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:pt-28">
          <div className="rise mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ember flicker" />
              A language falls silent roughly every two weeks
            </span>

            <h1 className="mt-7 font-display text-5xl font-medium leading-[1.05] tracking-tight text-cream sm:text-7xl">
              Carry the light of a
              <br />
              language <span className="text-gradient-ember">forward</span>.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              Lantern turns a few remembered phrases from an endangered language
              into a living, growing course — with AI that learns the grammar
              from the community&rsquo;s own words, and{" "}
              <span className="text-cream">never invents what it cannot see.</span>
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/lang/mi"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ember px-6 font-medium text-ink transition-transform hover:scale-[1.03]"
              >
                Light te reo Māori
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/ark"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 font-medium text-cream transition-colors hover:bg-surface"
              >
                <Globe className="h-4 w-4" />
                Explore the Ark
              </Link>
            </div>
          </div>

          {/* stakes strip */}
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-4">
            {[
              { v: 7000, label: "languages spoken today" },
              { v: 3000, label: "endangered, fading now" },
              { v: 1, label: "lost every ~2 weeks" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="card px-4 py-6 text-center">
                <div className="font-display text-4xl text-cream sm:text-5xl">
                  <Counter value={s.v} />
                  {s.v === 3000 ? "+" : ""}
                </div>
                <div className="mt-2 text-xs leading-snug text-muted">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal className="max-w-2xl">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-4 font-display text-3xl text-cream sm:text-4xl">
            A 100× lever on language survival.
          </h2>
          <p className="mt-4 text-muted">
            Documenting a language has always taken linguists years. Lantern
            collapses that into a loop a community can run themselves.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08} className="card flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-ember">
                  <step.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-sm text-faint">{step.n}</span>
              </div>
              <h3 className="mt-5 font-display text-xl text-cream">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- The honesty differentiator ---- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal className="card relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pounamu/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-pounamu/30 bg-pounamu/10 px-3 py-1 text-xs font-medium text-pounamu">
              <ShieldCheck className="h-3.5 w-3.5" />
              The honest engine
            </span>
            <h2 className="mt-5 font-display text-3xl leading-tight text-cream sm:text-4xl">
              &ldquo;We never invent a word.&rdquo;
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              An AI can&rsquo;t know a language with fifty speakers — and faking
              it would insult the people who hold it. So Lantern reasons{" "}
              <span className="text-cream">only over the phrases it is given.</span>{" "}
              Every word it teaches cites its evidence. Every practice sentence is
              checked, in code, against the attested vocabulary — and{" "}
              <span className="text-cream">rejected if a single word isn&rsquo;t real.</span>
            </p>
            <p className="mt-4 text-sm text-faint">
              Honesty over completeness. That&rsquo;s what makes it trustworthy to
              a linguist — and to a community.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---- Hero language showcase ---- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal className="card flex flex-col justify-between p-8">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: "#34d8a6", boxShadow: "0 0 12px #34d8a6" }}
                />
                <span className="font-display text-2xl text-cream">te reo Māori</span>
                <StatusBadge status="vulnerable" />
              </div>
              <p className="mt-4 text-muted">
                Watch the engine pull a whole tense system out of one verb —
                <span className="text-cream"> i / kei te / ka / kua haere</span> —
                and turn 41 cited phrases into a course you can take right now.
              </p>
            </div>
            <Link
              href="/lang/mi"
              className="group mt-6 inline-flex items-center gap-2 text-ember hover:text-flame"
            >
              Open the Māori workspace
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="card flex flex-col justify-between p-8">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: "#ff8a5b", boxShadow: "0 0 12px #ff8a5b" }}
                />
                <span className="font-display text-2xl text-cream">ᏣᎳᎩ Cherokee</span>
                <StatusBadge status="critically-endangered" />
              </div>
              <p className="mt-4 text-muted">
                A language the AI barely knows — so the engine shows its work,
                learning Sequoyah&rsquo;s syllabary{" "}
                <span className="font-display text-cream">ᎣᏏᏲ · ᏩᏙ · ᏣᎳᎩ</span>{" "}
                from the few words it&rsquo;s given.
              </p>
            </div>
            <Link
              href="/lang/chr"
              className="group mt-6 inline-flex items-center gap-2 text-ember hover:text-flame"
            >
              Open the Cherokee workspace
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-faint">
          <Volume2 className="h-3.5 w-3.5" />
          Every word can be heard aloud — pronunciation is an approximate guide,
          and the app says so.
        </p>
      </section>

      {/* ---- Ark teaser ---- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal className="flex items-end justify-between">
          <div className="max-w-2xl">
            <SectionLabel>The Living Ark</SectionLabel>
            <h2 className="mt-4 font-display text-3xl text-cream sm:text-4xl">
              {LANGUAGES.length} languages aboard. Room for thousands.
            </h2>
          </div>
          <Link
            href="/ark"
            className="hidden shrink-0 items-center gap-2 text-ember hover:text-flame sm:inline-flex"
          >
            See the Ark <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LANGUAGES.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.04}>
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
                <span className="mt-3 text-[11px] leading-snug text-faint">
                  {l.speakers}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Closing CTA ---- */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal className="card relative overflow-hidden p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ember/15 to-transparent" />
          <h2 className="relative mx-auto max-w-2xl font-display text-4xl leading-tight text-cream sm:text-5xl">
            A language only dies when the last person stops speaking it.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-muted">
            Lantern makes the next speaker easier to find. Light one and see.
          </p>
          <Link
            href="/lang/mi"
            className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ember px-7 font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            Start with te reo Māori
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
