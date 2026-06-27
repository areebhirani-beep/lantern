"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The /signin form: OAuth buttons (shown when configured) plus an email +
 *  password form that toggles between sign in and create account. */
export function AuthForm({
  hasGoogle,
  hasGithub,
  callbackUrl = "/lang/mi",
}: {
  hasGoogle: boolean;
  hasGithub: boolean;
  callbackUrl?: string;
}) {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email)) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Use a password of at least 8 characters.");
    setBusy(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: name || undefined }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Could not create the account.");
          return;
        }
      }
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(mode === "register" ? "Account created, but sign-in failed." : "Wrong email or password.");
        return;
      }
      window.location.href = callbackUrl;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const hasOAuth = hasGoogle || hasGithub;

  return (
    <div className="w-full">
      {hasOAuth && (
        <div className="space-y-2.5">
          {hasGoogle && (
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-line bg-surface/40 text-sm font-medium text-cream transition-colors hover:bg-surface"
            >
              <GoogleGlyph />
              Continue with Google
            </button>
          )}
          {hasGithub && (
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl })}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-line bg-surface/40 text-sm font-medium text-cream transition-colors hover:bg-surface"
            >
              <GithubGlyph />
              Continue with GitHub
            </button>
          )}
        </div>
      )}

      {hasOAuth && (
        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            or with email
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "register" && (
          <Field
            label="Name"
            value={name}
            onChange={setName}
            type="text"
            placeholder="Your name (optional)"
            autoComplete="name"
          />
        )}
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="At least 8 characters"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
        />

        {error && (
          <p className="font-mono text-xs text-ember" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 h-11 w-full rounded-full bg-ember text-sm font-medium text-ink transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {busy
            ? "One moment…"
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-faint">
        {mode === "signin" ? "New to Lantern? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "signin" ? "register" : "signin"));
            setError(null);
          }}
          className="text-ember transition-colors hover:text-flame"
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder: string;
  autoComplete: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-data border border-line bg-ink px-3.5 text-sm text-cream placeholder:text-faint/70 outline-none transition-colors focus:border-ember/60"
      />
    </label>
  );
}

function GoogleGlyph() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1 2.6-2.1 3.4v2.8h3.4c2-1.85 3.2-4.57 3.2-7.8 0-.74-.07-1.46-.2-2.15z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.85 0 5.24-.95 6.99-2.55l-3.4-2.8c-.95.64-2.16 1.02-3.59 1.02-2.76 0-5.1-1.87-5.93-4.38H2.55v2.9C4.29 19.99 7.86 22 12 22z"
      />
      <path
        fill="#4A90D9"
        d="M6.07 13.29A6 6 0 0 1 5.76 12c0-.45.08-.88.21-1.29V7.81H2.55A10 10 0 0 0 2 12c0 1.6.38 3.12 1.05 4.46l3.02-2.36z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.6c1.55 0 2.95.53 4.05 1.58l3.02-3.02C17.24 2.45 14.85 1.5 12 1.5 7.86 1.5 4.29 3.51 2.55 6.54l3.52 2.9C6.9 7.47 9.24 5.6 12 5.6z"
      />
    </svg>
  );
}

function GithubGlyph() {
  return (
    <svg className="h-4 w-4 text-cream" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}
