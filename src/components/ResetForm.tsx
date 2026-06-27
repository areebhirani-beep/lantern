"use client";

import Link from "next/link";
import { useState } from "react";

/** The password-reset form. Reads the single-use token (passed from the server
 *  page) and posts a new password to /api/auth/reset. */
export function ResetForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // No token at all — the link is malformed or was opened bare.
  if (!token) {
    return (
      <div role="status" aria-live="polite">
        <p className="text-sm leading-relaxed text-muted">
          This reset link is missing or invalid. Request a fresh one from the
          sign-in screen.
        </p>
        <Link
          href="/signin"
          className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-ember text-sm font-medium text-ink transition-transform hover:scale-[1.01]"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div role="status" aria-live="polite">
        <p className="text-sm leading-relaxed text-muted">
          Your password has been updated. You can sign in with it now.
        </p>
        <Link
          href="/signin?reset=1"
          className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-ember text-sm font-medium text-ink transition-transform hover:scale-[1.01]"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      return setError("Use a password of at least 8 characters.");
    }
    if (password !== confirm) {
      return setError("Those passwords don't match.");
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not reset the password.");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Field
        label="New password"
        value={password}
        onChange={setPassword}
        placeholder="At least 8 characters"
        autoComplete="new-password"
      />
      <Field
        label="Confirm password"
        value={confirm}
        onChange={setConfirm}
        placeholder="Re-enter your password"
        autoComplete="new-password"
      />

      {error && (
        <p className="font-mono text-xs text-ember" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-1 h-11 w-full rounded-full bg-ember text-sm font-medium text-ink transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {busy ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
        {label}
      </span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-data border border-line bg-ink px-3.5 text-sm text-cream placeholder:text-faint/70 outline-none transition-colors focus:border-ember/60"
      />
    </label>
  );
}
