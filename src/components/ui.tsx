import type { Confidence, LanguageStatus } from "@/lib/types";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-ember">
      <span className="h-px w-6 bg-ember/50" />
      {children}
    </span>
  );
}

const CONF: Record<Confidence, { color: string; label: string }> = {
  high: { color: "var(--color-pounamu)", label: "High confidence — well attested" },
  medium: { color: "var(--color-ember)", label: "Medium confidence — limited evidence" },
  low: { color: "var(--color-faint)", label: "Low confidence — a lead, not a law" },
};

export function ConfidenceDot({ level }: { level: Confidence }) {
  const c = CONF[level];
  return (
    <span
      title={c.label}
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: c.color, boxShadow: `0 0 8px ${c.color}` }}
    />
  );
}

const STATUS: Record<LanguageStatus, { label: string; cls: string }> = {
  vulnerable: { label: "Vulnerable", cls: "text-amber-300 border-amber-400/30 bg-amber-400/10" },
  "definitely-endangered": {
    label: "Definitely endangered",
    cls: "text-orange-300 border-orange-400/30 bg-orange-400/10",
  },
  "severely-endangered": {
    label: "Severely endangered",
    cls: "text-rose-300 border-rose-400/30 bg-rose-400/10",
  },
  "critically-endangered": {
    label: "Critically endangered",
    cls: "text-red-300 border-red-400/30 bg-red-400/10",
  },
  dormant: { label: "Dormant", cls: "text-zinc-300 border-zinc-400/30 bg-zinc-400/10" },
};

export function StatusBadge({ status }: { status: LanguageStatus }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}
