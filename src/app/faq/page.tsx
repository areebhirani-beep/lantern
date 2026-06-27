import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FaqAccordion } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ, Lantern",
  description:
    "How Lantern builds a real course for an endangered language from the few words a community still remembers — and how it stays honest.",
};

export default function FAQ() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-5 py-20">
        <p className="text-sm uppercase tracking-[0.3em] text-ember">Questions</p>
        <h1 className="mt-4 font-display text-4xl text-cream sm:text-5xl">
          Frequently asked
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          The honest answers — how an AI can help save a language it barely knows, where
          the words come from, and who they belong to.
        </p>

        <FaqAccordion />

        <div className="mt-12 rounded-2xl border border-line bg-ink/60 p-6">
          <p className="leading-relaxed text-muted">
            Still curious?{" "}
            <Link href="/lang/mi" className="text-ember hover:text-flame">
              Watch it learn Māori
            </Link>{" "}
            from 41 phrases, or{" "}
            <Link href="/api/metrics" className="text-ember hover:text-flame">
              check the numbers yourself
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
