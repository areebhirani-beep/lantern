import { Nav } from "@/components/Nav";

/** Skeleton shown while a language page server-renders its induction. Mirrors the
 *  real header layout so there's no shift when the content lands. */
export default function Loading() {
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-5xl animate-pulse px-5 py-16" aria-hidden>
        <div className="h-4 w-28 rounded bg-line/60" />
        <div className="mt-6 h-12 w-64 rounded bg-line/60" />
        <div className="mt-5 h-4 w-80 max-w-full rounded bg-line/40" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-line/30" />
        <div className="mt-10 h-24 w-full rounded-2xl border border-line bg-ink/60" />
        <div className="mt-8 flex gap-6">
          <div className="h-5 w-20 rounded bg-line/50" />
          <div className="h-5 w-16 rounded bg-line/30" />
          <div className="h-5 w-20 rounded bg-line/30" />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="h-40 rounded-2xl border border-line bg-ink/40" />
          <div className="h-40 rounded-xl border border-line bg-ink/40" />
        </div>
      </div>
    </>
  );
}
