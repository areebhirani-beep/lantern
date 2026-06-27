import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service, Lantern",
  description: "The terms for using Lantern and contributing language data.",
};

export default function Terms() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-5 py-20">
        <p className="text-sm uppercase tracking-[0.3em] text-ember">Terms</p>
        <h1 className="mt-4 font-display text-4xl text-cream sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-faint">Last updated 26 June 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-muted">
          <p>
            By using Lantern you agree to these terms. Lantern is an educational
            tool for learning endangered languages from community-contributed
            phrases, built to help communities keep their languages alive.
          </p>

          <section>
            <h2 className="font-display text-xl text-cream">
              What Lantern is, and is not
            </h2>
            <p className="mt-3">
              Lantern induces vocabulary, grammar, and lessons strictly from the
              phrases a community provides, and it never teaches a word that was not
              attested by a real speaker. Even so, induced grammar notes and
              pronunciation are best understood as a careful guide, not an
              authoritative reference. For formal study, defer to fluent speakers
              and established community resources.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Contributions</h2>
            <p className="mt-3">
              When you contribute a phrase, you confirm that you have the right to
              share it and that it reflects how a real speaker uses the language.
              You grant Lantern a non-exclusive license to display it as part of
              that language&rsquo;s course. Communities retain ownership of their
              language and its corpus. Do not submit invented, machine-translated,
              offensive, or misattributed content; doing so undermines the one
              promise this project makes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Acceptable use</h2>
            <p className="mt-3">
              Use Lantern respectfully and in good faith. Do not attempt to misuse
              the service, scrape it at scale, or use it to misrepresent a language
              or community.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Accounts</h2>
            <p className="mt-3">
              Accounts are optional. You are responsible for keeping your sign-in
              secure, and you may delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">No warranty</h2>
            <p className="mt-3">
              Lantern is provided as is, without warranty of any kind. We work to
              keep it accurate and available, but we do not guarantee uninterrupted
              service or that every induced detail is perfect.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Changes</h2>
            <p className="mt-3">
              We may update these terms as the project grows. Material changes will
              be reflected by the date above.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Contact</h2>
            <p className="mt-3">
              Reach the maintainers via the{" "}
              <a
                href="https://github.com/areebhirani-beep/lantern"
                className="text-ember hover:text-flame"
              >
                GitHub repository
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
