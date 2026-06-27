"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

/** Header account control. Signed out: a quiet "Sign in" link. Signed in: an
 *  initial avatar opening a small menu. Matches the editorial system —
 *  near-black surface, hairline border, mono labels, ember on hover. */
export function AccountMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Reserve width while loading so the nav doesn't shift.
  if (status === "loading") return <span className="inline-block h-8 w-8" />;

  if (!session?.user) {
    return (
      <Link
        href="/signin"
        className="whitespace-nowrap rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-cream"
      >
        Sign in
      </Link>
    );
  }

  const label = session.user.name || session.user.email || "Account";
  const initial = label.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid h-8 w-8 place-items-center rounded-full border border-line bg-surface font-mono text-xs text-cream transition-colors hover:border-ember/50"
      >
        {initial}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-card border border-line bg-ink p-1 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)]"
        >
          <div className="border-b border-line/60 px-3 py-2.5">
            <p className="truncate text-sm text-cream">{session.user.name || "Signed in"}</p>
            {session.user.email && (
              <p className="truncate font-mono text-[11px] text-faint">{session.user.email}</p>
            )}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut()}
            className="mt-1 w-full rounded-data px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-cream"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
