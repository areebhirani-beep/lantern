// True only when AUTH_SECRET is set — the one env var Auth.js v5 hard-requires
// to function (it throws "server configuration" without it in production).
// Drives whether any auth UI renders, so an unconfigured deploy shows no dead
// sign-in controls and makes no failing /api/auth/session calls.
// Call server-side only (process.env is empty in the client bundle).
export const authConfigured = () => Boolean(process.env.AUTH_SECRET);
