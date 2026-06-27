import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy, Lantern",
  description:
    "How Lantern handles your data and the language data communities entrust to it.",
};

export default function Privacy() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-5 py-20">
        <p className="text-sm uppercase tracking-[0.3em] text-ember">Privacy</p>
        <h1 className="mt-4 font-display text-4xl text-cream sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-faint">Last updated 26 June 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-muted">
          <p>
            Lantern helps communities turn the words they still remember into a
            course to learn an endangered language. This policy explains, in plain
            language, what we collect, why, and what you can do about it. You can
            use the entire app, browse languages, take courses, hear pronunciation,
            and contribute, without an account. Signing in is optional and only
            adds saved progress and attribution.
          </p>

          <section>
            <h2 className="font-display text-xl text-cream">What we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <span className="text-cream">Account details</span>, only if you
                sign in: your name, email, and avatar from Google, GitHub, or an
                email and password you create.
              </li>
              <li>
                <span className="text-cream">Learning progress</span>: which cards
                you have reviewed and their spaced-repetition schedule, so you can
                pick up where you left off.
              </li>
              <li>
                <span className="text-cream">Contributions</span>: phrases you add
                to a language, with the meaning and any source you provide. These
                become part of that language&rsquo;s public corpus.
              </li>
              <li>
                <span className="text-cream">Basic technical data</span> needed to
                serve the app. We do not sell your data or run advertising
                trackers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">
              How your data is used and stored
            </h2>
            <p className="mt-3">
              Account and progress data is stored in Firebase and MongoDB Atlas,
              used only to run the app, save your progress, and credit your
              contributions. Pronunciation is generated in your own browser with
              the Web Speech API, so no audio is sent to us. When the engine builds
              a course, only the language&rsquo;s cited phrases are sent to our
              model provider, never your personal information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">
              Language data and community ownership
            </h2>
            <p className="mt-3">
              Endangered-language data carries real cultural ownership. Our
              position is that the community owns and governs its corpus, and
              Lantern is a tool used on that data, never an extraction pipeline. We
              cite the source of every seed phrase, and formal data-sovereignty
              controls, letting a community decide who can view, download, and
              contribute to its language, are an active part of our roadmap. If you
              represent a community and want your language&rsquo;s data handled
              differently, contact us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Third parties</h2>
            <p className="mt-3">
              We use Google and GitHub for optional sign-in, Firebase and MongoDB
              for storage, and a hosted language model for course induction. Each
              receives only the data needed for its function, and never your
              personal data for model inference.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Your choices</h2>
            <p className="mt-3">
              You can use Lantern fully without an account. If you have one, you can
              ask us to delete your account and the personal data tied to it. Public
              contributions may remain in a language&rsquo;s corpus to preserve the
              community record, but we will detach them from your identity on
              request.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-cream">Contact</h2>
            <p className="mt-3">
              Questions about privacy or a community&rsquo;s data can be sent to the
              maintainers via the{" "}
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
