# Security

Lantern is a zero-config Next.js app that runs fully without any secrets (it serves verified fixtures). When you do configure providers, they register only when their env vars are present, so an unconfigured deploy exposes no dead controls. This document records the bounds that are actually enforced in code, and is honest about what is not yet built.

## Input bounds on /api/audio

The one route that accepts a user upload is `POST /api/audio` (multipart: `audio=<file>`, `languageId=<id>`). Every bound below is enforced in code.

| Bound | Behavior | Source |
|---|---|---|
| Size cap | 5MB hard cap (`MAX_BYTES = 5 * 1024 * 1024`); larger uploads rejected | `src/lib/storage.ts:8`, `:27` |
| MIME allowlist | Only `audio/webm`, `audio/ogg`, `audio/mpeg` (mp3), `audio/mp4` (m4a), `audio/wav`, `audio/x-wav`; anything else throws "Unsupported audio format." | `src/lib/storage.ts:10-17`, `:29` |
| Empty reject | `file.size === 0` rejected as "No audio provided." / "Empty recording." | `src/app/api/audio/route.ts:19-21`, `src/lib/storage.ts:26` |
| languageId sanitize | `replace(/[^a-z]/gi, "")` strips anything that is not an ASCII letter, `.slice(0, 8)` caps at 8 chars, empty result falls back to `"misc"` | `src/lib/storage.ts:30` |
| Storage unconfigured | Returns HTTP 503 when `BLOB_READ_WRITE_TOKEN` is unset, before any work | `src/app/api/audio/route.ts:10-15` |
| Bad input | Returns HTTP 400 on missing/empty file or any thrown error | `src/app/api/audio/route.ts:19-21`, `:25-30` |
| Runtime limits | `runtime = "nodejs"`, `maxDuration = 30`, `dynamic = "force-dynamic"` | `src/app/api/audio/route.ts:3-5` |

The flow is fail-closed: storage config is checked first (503), then the file is validated (400), and only a valid, in-bounds, allowlisted clip is ever written.

## Secret hygiene

All provider, database, and auth keys are server-side environment variables only. None are exposed to the client bundle.

- `src/lib/storage.ts` and `src/lib/users.ts` are marked `"server-only"`, so they cannot be imported into client code.
- `process.env` is empty in the client bundle. The comment in `src/lib/auth-config.ts:5` ("Call server-side only (process.env is empty in the client bundle)") documents this directly.
- Features register only when their env is present, so an unconfigured deploy shows no dead controls:
  - `storageConfigured()` = `Boolean(process.env.BLOB_READ_WRITE_TOKEN)` (`src/lib/storage.ts:19-21`). No token, no recorder, no upload route success.
  - `authConfigured()` = `Boolean(process.env.AUTH_SECRET)` (`src/lib/auth-config.ts:6`). No secret, no auth UI and no failing `/api/auth/session` calls.
  - Google and GitHub providers register conditionally on their client id and secret being set; an empty env still boots the app.
- `.env.local` is gitignored. Real secrets never enter the repo.
- `AUTH_SECRET` is required for auth to function (the one var Auth.js v5 hard-requires; generate with `npx auth secret`).
- Passwords are hashed with `bcryptjs` at **10 rounds** (`src/lib/users.ts`). Plaintext passwords are never stored.
- `FIREBASE_PRIVATE_KEY` must keep its `\n` escapes and be wrapped in double quotes in the env, so the multi-line key survives transport.

Roadmap note: `.env.example` lists `AWS_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `S3_BUCKET`, but no code reads them. Audio storage uses Vercel Blob (`BLOB_READ_WRITE_TOKEN`) exclusively. The S3 keys are not wired and are **Roadmap**; do not treat them as active credentials.

## No PII in URLs

| Concern | What is done | Source |
|---|---|---|
| Language in blob path | `languageId` is sanitized (letters only, max 8 chars, `"misc"` fallback) before it is interpolated into the Blob path `pronunciations/<lang>/clip.<ext>` | `src/lib/storage.ts:30-31` |
| Unguessable object paths | Audio objects are written with `addRandomSuffix: true`, so paths are not enumerable | `src/lib/storage.ts:34` |
| Sessions | Sessions are JWT (`session.strategy: "jwt"`). No email or user identifier is placed in a URL | `src/auth.ts` |
| OAuth callbacks | Standard Auth.js routes only: `/api/auth/callback/google`, `/api/auth/callback/github` | `src/app/api/auth/[...nextauth]` |

What is NOT done (stated honestly, not implied away):

- **Rate limiting** on `/api/audio` is not implemented. The 5MB cap and MIME allowlist limit abuse per request, but request volume is not throttled. **Roadmap.**
- **Authentication on `/api/audio`** is not enforced. Any client can post a valid, in-bounds clip when storage is configured. Gating uploads behind a session is **Roadmap.**

These are listed so operators do not assume protections that do not exist.

## Reporting

Found a vulnerability? Please disclose responsibly. Do not open a public issue with exploit details. Contact the maintainers through the repository at https://github.com/areebhirani-beep/lantern (open a security advisory or a minimal private report), and allow time for a fix before any public disclosure.

**Verified by:** `src/lib/storage.ts`, `src/app/api/audio/route.ts`, `src/lib/auth-config.ts`
