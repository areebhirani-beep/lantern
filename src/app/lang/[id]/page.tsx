import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLanguageMeta } from "@/lib/languages";
import { getStore } from "@/lib/store";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Workspace } from "@/components/Workspace";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const language = getLanguageMeta(id);
  if (!language) return { title: "Unknown language, Lantern" };
  return {
    title: `${language.name} (${language.endonym}), Lantern`,
    description: `${language.blurb} Learn ${language.name} from a living, AI-amplified corpus.`,
  };
}

export default async function LangPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const language = getLanguageMeta(id);
  if (!language) notFound();

  const store = await getStore();
  const phrases = await store.getPhrases(id);

  return (
    <>
      <Nav />
      <Workspace language={language} initialPhrases={phrases} />
      <Footer />
    </>
  );
}
