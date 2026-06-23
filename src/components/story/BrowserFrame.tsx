import type { ReactNode } from "react";

/** A mock browser window to frame real product screenshots. */
export function BrowserFrame({
  url = "lantern.app/lang/mi",
  children,
}: {
  url?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 border-b border-line bg-ink-2 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-400/70" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <span className="ml-4 inline-flex items-center rounded-md bg-ink/60 px-3 py-1 text-xs text-faint">
          {url}
        </span>
      </div>
      <div className="bg-ink">{children}</div>
    </div>
  );
}
